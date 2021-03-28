const express = require("express")

const bodyParser = require('body-parser');
const router = express.Router();
const fs = require('fs');

const cors = require('cors')
const pool = require('../db')
const bcrypt = require('bcryptjs')
//importing jwt
const jwt=require('jsonwebtoken')

//const path = require('path')
//const app = express()


// invalid password error
router.post('/login', async(req,res) => {
    try {
        const data = req.body;
        // check if a user with the given email ID exists in the database
        // if not, return error
        const login = await pool.query("SELECT * FROM manager WHERE email_id=$1", [data.email_id]);
        console.log(login.rows.length)
        console.log(login.rows[0])
        if(login.rows.length == 0){
            return res.status(400).json({
                error: 1,
                msg: "A user with this email ID does not exist!"
            });
        }

        else{
            // validate password
                bcrypt.compare(data.password, login.rows[0].password, function(err, result) {
                    
                    // handle bcrypt compare error
                    if (err) { throw (err); }
                
                    // password matches
                    if(result){

                        //GET JWT TOKEN 
                        jwt.sign({},'secretkey',{expiresIn: '1h'},(err,token)=>{
                            //console.log(req.token)
                            if(err){
                                console.log(err.message)
                            }else{

                                //TOKEN CREATED WITHOUT ERROR  RETURN IT ALONG WITH LOGIN DATA
                            return  res.json({
                                    token,
                                    msg: "Successfully logged in!",
                                    user_id: login.rows[0].user_id,
                                    restaurant_id: login.rows[0].restaurant_id,
                                    usertype_id: login.rows[0].usertype_id,
                                    user_name: login.rows[0].user_name,
                                    contact_no: login.rows[0].contact_no,
                                });
                            }
                            
                        }); 
                    }
                
                
                    // invalid password
                    else {
                        return res.status(400).json({
                            error:1,
                            msg: "Invalid password! Please try again!"
                        });
                    }
                });
                
                    //password matches
                    // if(login.rows[0].password === data.password){

                    //             //TOKEN CREATED WITHOUT ERROR  RETURN IT ALONG WITH LOGIN DATA
                    //         return  res.json({
                    //                 msg: "Successfully logged in!",
                    //                 user_id: login.rows[0].user_id,
                    //                 restaurant_id: login.rows[0].restaurant_id,
                    //                 usertype_id: login.rows[0].usertype_id,
                    //                 user_name: login.rows[0].user_name,
                    //                 contact_no: login.rows[0].contact_no,
                    //             });
                    //         }
                           
                    //         // invalid password
                    // else {
                    //     return res.status(400).json({
                    //         error:1,
                    //         msg: "Invalid password! Please try again!"
                    //     });
                    // }
                 
                    }
        
    } catch (err) {
        console.log(err.message);
    }
})



// check if jwt works or not. getting error code 403-forbidden
router.post('/viewmenu',verifyToken, async(req, res) => {
    
    //INITIALIZE JWT VERIFICATION
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){

            //INVALID TOKEN/TIMEOUT
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            const data = req.body;
            const viewmenu =  await pool.query("SELECT dish_id, dish_name, description, dish_price, status, jain_availability FROM menu WHERE restaurant_id=$1", [data.restaurant_id]);
            
            if(!viewmenu.rows[0] && !viewmenu.rows.length){
                res.status(400).json({
                    error:1,
                    msg: "No menu item available for this restaurant"
                });
            }
            else{
                res.json({total_results: viewmenu.rowCount, dishes: viewmenu.rows});
            }
            

            console.log("total_results: " + viewmenu.rowCount, "dishes: " + viewmenu.rows);

        }
    });

    //console.log("in viewmenu api")
    try {
        const data = req.body;
        const viewmenu = await pool.query("SELECT dish_id, dish_name, description, dish_price, status, jain_availability FROM menu WHERE restaurant_id=$1", [data.restaurant_id]);

        if(!viewmenu.rows[0] && !viewmenu.rows.length){
            res.status(400).json({
                error:1,
                msg: "No menu item available for this restaurant"
            });
        }
        else{
            res.json({total_results: viewmenu.rowCount, dishes: viewmenu.rows});
        }
        

        //console.log("total_results: " + viewmenu.rowCount, "dishes: " + viewmenu.rows);
    } catch (err) {
        console.log(err.message)
    }
    
})




// works
router.post('/revenue', async(req, res) => {
    try {
        const data = req.body;

        const final = await pool.query("SELECT SUM(final_bill) FROM revenue WHERE time_stamp>=$1 and time_stamp<=$2", [data.from_time_stamp
        , data.to_time_stamp]);

        console.log(final.rows[0])

        if(!final.rows[0] && !final.rows.length){
            res.json(400,{
                error:1,
                msg: "some error"
            });
        } else {
            res.json(final.rows[0]);
        }

    } catch (err) {
        console.log(err.message)
    }
})


// works
router.post('/register_user',async(req,res) => {  
    try {
        const data = req.body;
        // console.log(data.usertype_id);

        // check if one or more mandatory field is empty
        // return error if true
        console.log(data)
        if(!data.restaurant_id || !data.user_image || !data.usertype_id || !data.user_name || !data.email_id || !data.contact_no || !data.password){
            return res.status(400).json({
                error: 1,
                msg: "One or more required field is empty!"
            }); 
        } 

        // check if the email ID is already registered or not
        // return error if true
        const user = await pool.query("SELECT email_id from users WHERE email_id=$1", [data.email_id]);
        if(user.rows.length){
            return res.status(400).json({
                error: 1,
                msg: "This email ID is already registered!"
            });
        }
        
        // check if maximum allowed registrations corresponding to user's role for the given restaurant is reached or not
        // if maximum users of given role are already registered, return error
        // const userRole = await pool.query("SELECT user_role from usertype WHERE usertype_id= $1", data.usertype_id);
        const subscriptiontypeId = await pool.query("SELECT subscription_type_id FROM restaurant WHERE restaurant_id = $1", [data.restaurant_id]);  
        const usertypeid=data.usertype_id; 
        const subscriptionTypeId=subscriptiontypeId.rows[0]['subscription_type_id']; 
        
        // console.log(typeof(usertypeid),typeof(data.restaurant_id))
        switch(usertypeid){
            // if user role == waiter
            case 1:
                const maxwaiters = await pool.query("SELECT max_waiter FROM subscription WHERE subscription_type_id = $1", [subscriptionTypeId]);
                const maxWaiters = maxwaiters.rows[0]['max_waiter']
                
                const currentwaiters = await pool.query("SELECT count(*) from users WHERE restaurant_id = $1 and usertype_id = $2", [data.restaurant_id, usertypeid]);
                const currentWaiters = parseInt(currentwaiters.rows[0]['count'])
                
                if(currentWaiters >= maxWaiters){
                    return res.status(400).json({
                        error: 1,
                        msg: "Maximum number of allowed waiters are already registered! Your plan only allows a maximum of " + maxWaiters.toString() + " waiters!"
                    });
                }
                break;

            // if user role == inventory manager
            case 2:
                const maxinventoryManager = await pool.query("SELECT max_inv_manager FROM subscription WHERE subscription_type_id = $1", [subscriptionTypeId]);
                const maxInventoryManager = maxinventoryManager.rows[0]['max_inv_manager']
                const currentinventoryManager = await pool.query("SELECT count(*) from users WHERE restaurant_id = $1 and usertype_id = $2", [data.restaurant_id, usertypeid]);
                const currentInventoryManager = parseInt(currentinventoryManager.rows[0]['count'])
                if(currentInventoryManager >= maxInventoryManager){
                    return res.status(400).json({
                        error: 1,
                        msg: "Maximum number of allowed inventory managers are already registered! Your plan only allows a maximum of " + maxWaiters.toString() + " inventory managers!"
                    });
                }
                break;

            // if user role == kitchen personnel
            case 3:
                const maxkitchenPersonnel = await pool.query("SELECT max_kitchen_personnel FROM subscription WHERE subscription_type_id = $1",[ subscriptionTypeId]);
                const maxKitchenPersonnel = maxkitchenPersonnel.rows[0]['max_kitchen_personnel']
                const currentkitchenPersonnel = await pool.query("SELECT count(*) from users WHERE restaurant_id = $1 and usertype_id = $2", [data.restaurant_id, usertypeid]);
                const currentKitchenPersonnel = parseInt(currentkitchenPersonnel.rows[0]['count'])
                if(currentKitchenPersonnel >= maxKitchenPersonnel){
                    return res.status(400).json({
                        error: 1,
                        msg: "Maximum number of allowed kitchen personnel are already registered! Your plan only allows a maximum of " + maxWaiters.toString() + " kitchen personnel!"
                    });
                }
                break;
        }

        // generating hashed password (salt rounds = 12)
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        
        // inserting new user into the database
        const newUser = await pool.query(
        "INSERT INTO users(restaurant_id,user_image,usertype_id,user_name,email_id,contact_no,contact_no_optional,password) VALUES ($1, $2, $3,$4, $5,$6,$7,$8)",
        [data.restaurant_id, data.user_image, usertypeid, data.user_name, data.email_id, data.contact_no, data.contact_no_optional, hashedPassword]);

        return res.status(201).json({
            msg: "Registered successfully!"
        });
    } catch (err) {
        console.log(err.message)
    }
})


// works
router.post('/mark_attendance',async(req,res) => {
    
    try {
        const data = req.body;
        if(!data.restaurant_id || !data.user_id || !data.attendance_status){
            
            res.status(400).json({
                error:1,
                msg: "Provide all values"   
            }); 

        } else { 
           
            const time_now= await pool.query("SELECT NOW()");
            
            const username = await pool.query("SELECT user_name from users WHERE user_id=$1", [data.user_id])
            const username2 = username.rows[0].user_name;
            const newUser = await pool.query(
            "INSERT INTO attendance(restaurant_id,user_id, user_name, time_stamp,attendance_status) VALUES ($1, $2, $3, $4, $5)",
                [data.restaurant_id,data.user_id, username2, time_now.rows[0]['now'],data.attendance_status]);
                
            res.json({msg:"Attendance marked" });
        }
    } catch (err) {
        console.log(err.message)
    }
})


// works
// ATTENDANCE
router.get('/view_attendance', async (req,res)=>{
    try {
        const results = await pool.query('SELECT user_id,user_name,time_stamp,attendance_status FROM ATTENDANCE');
        //console.log(results.rows[0]);
        if(!results.rows[0] && !results.rows.length)
        {
            res.status(400).json({
                error:1,
                msg: "No attendance record found"   
            }); 
        }
        else{
            res.status(200).json(results.rows);
        }
        
    } 
    catch (err) {
        console.log(err.message)
    }
})


// works
router.post('/view_attendance',async (req,res)=>{
    // console.log(req.body);
    //res.send(req.body);
    try{
        if(!req.body.user_name)
        {
            res.status(400).json({
                error:1,
                msg: "Empty field"   
            }); 
        }
        else{
            const results = await pool.query(`SELECT user_id,user_name,time_stamp,attendance_status FROM ATTENDANCE where user_name like '%${req.body.user_name}%'`)
            //console.log(results)
            if(!results.rows[0] && !results.rows.length)
            {
                res.status(400).json({
                    error:1,
                    msg: "No data found for a given user"   
                }); 
            }
            else{
                res.status(200).json(results.rows);
            }
        }        
        
    }
    catch(err){
        console.log(err.message);
    }
});

// FEEDBACK
router.get('/feedback',async (req,res)=>{
    try{
        const results = await pool.query(`select FEEDBACK_ID,CATEGORY1,CATEGORY2,CATEGORY3,CATEGORY4 from feedback`);
        if(!results.rows[0] && !results.rows.length)
        {
            res.status(400).json({
                error:1,
                msg: "No feedback record found"   
            }); 
        }
        else{
            res.status(200).json(results.rows);
        }
        
    }
    catch(err){
        console.log(err.message);
    }
});


router.post('/feedback',async (req,res)=>{
    const query_detail = req.body.detail
    try{
        if(!req.body.detail)
        {
            res.status(400).json({
                error:1,
                msg: "Empty field"   
            }); 
        }
        else {
           const results = await pool.query("select FEEDBACK_ID,CATEGORY1,CATEGORY2,CATEGORY3,CATEGORY4 from feedback where CATEGORY1 = $1 or CATEGORY2 = $1 or CATEGORY3 = $1 or CATEGORY4 = $1", [query_detail]);

            if(!results.rows[0] && !results.rows.length)
            {
                res.status(400).json({
                    error:1,
                    msg: "No feedback record found for given details"   
                }); 
            }
            else{
                res.status(200).json(results.rows);
            }
        }     
    }
    catch(err){
        console.log(err.message);
    }
});


async function verifyToken(req,res,next){

    const bearerToken = req.headers['authorization'];
    
    
    if(typeof(bearerToken)!=='undefined'){
        req.token=bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }


}

module.exports = router;