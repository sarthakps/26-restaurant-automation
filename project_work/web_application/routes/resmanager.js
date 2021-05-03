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
//solution: changed query select * from manager ===> select * from users
// SOLVED
// router.post('/login', async(req,res) => {
//     try {
//         const data = req.body;
//         // check if a user with the given email ID exists in the database
//         // if not, return error
//         const login = await pool.query("SELECT * FROM manager WHERE email_id=$1", [data.email_id]);
        
//         if(login.rows.length == 0){
//             return res.status(400).json({
//                 error: 1,
//                 msg: "A user with this email ID does not exist!"
//             });
//         }

//         else{
//             // validate password
//                 bcrypt.compare(data.password, login.rows[0].password, async function(err, result2) {
                    
//                      // handle bcrypt compare error
//                     if (err) { 
//                         throw (err); 
//                     }
//                     const result = await pool.query("SELECT * FROM manager WHERE email_id=$1", [data.email_id]);
//                     // password matches
//                     // console.log(result.rows[0]['password'])
//                     // if(result.rows[0]['password'] === req.body.password){

//                     //GET JWT TOKEN 
//                     const emailid=data.email_id
                    
//                     jwt.sign({emailid},'secretkey',{expiresIn: '5h'},async (err,token)=>{
                        
//                         if(err){
//                             console.log(err.message)
//                         }else{
                            
//                             //need to create fcm token dont know how
//                             const fcmToken="temporary_fcm_token"   
//                             const checkEntry =  await pool.query("SELECT email_id FROM fcm_jwt WHERE email_id=$1", [data.email_id]);
                            
//                             // //if already logged in then update
//                             if(checkEntry && typeof(checkEntry.rows[0])!=='undefined')
//                             {
//                                 console.log('updating')
//                                 const newUser = await pool.query(
//                                     "UPDATE fcm_jwt SET last_jwt = $1 WHERE email_id=$2", [token, data.email_id]);
                                    
//                             }//if there is no login info then insert
//                             else{
//                                     console.log('inserting')
//                                     const newUser = await pool.query(
//                                     "INSERT INTO fcm_jwt(email_id,fcm_token,last_jwt) VALUES ($1, $2, $3)",
//                                     [data.email_id, fcmToken, token]);
                                    
//                             }

//                         //TOKEN CREATED WITHOUT ERROR  RETURN IT ALONG WITH LOGIN DATA
//                             return  res.status(200).json({
//                                     token: token,
//                                     msg: "Successfully logged in!",
//                                     user_id: login.rows[0].user_id,
//                                     restaurant_id: login.rows[0].restaurant_id,
//                                     usertype_id: login.rows[0].usertype_id,
//                                     user_name: login.rows[0].user_name,
//                                     contact_no: login.rows[0].contact_no,
//                                 });
//                             }
                            
//                         }); 
//                     }// invalid password
//                     else {
//                         return res.status(400).json({
//                             error:1,
//                             msg: "Invalid password! Please try again!"
//                         });
//                     }
//                 // });   
//             }
//         } catch (err) {
//             console.log(err.message);
//         }
// })


// check if jwt works or not. getting error code 403-forbidden
//solution: check if you have passed email_id and restaurant_id in body
// SOLVED
router.post('/viewmenu',verifyToken, async(req, res) => {
    
    //INITIALIZE JWT VERIFICATION
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){

            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            const data = req.body;
            const viewmenu =  await pool.query("SELECT dish_id, dish_name, description, dish_price, status, jain_availability FROM menu WHERE restaurant_id=$1", [data.restaurant_id]);
            
            if(!viewmenu.rows[0] && !viewmenu.rows.length){
                return res.status(400).json({
                    error:1,
                    msg: "No menu item available for this restaurant"
                });
              
            }
            else{
                return res.json({total_results: viewmenu.rowCount, dishes: viewmenu.rows});
            }    
            //console.log("total_results: " + viewmenu.rowCount, "dishes: " + viewmenu.rows);
        }
    });   
    
})


// ALL USERS
router.post('/allusers',verifyToken, async(req, res) => {
    
    //INITIALIZE JWT VERIFICATION
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){

            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            const data = req.body;
            const viewUsers =  await pool.query("SELECT user_id, user_name, user_image, usertype_id FROM users WHERE restaurant_id=$1", [data.restaurant_id]);
            
            if(!viewUsers.rows[0] && !viewUsers.rows.length){
                return res.status(400).json({
                    error:1,
                    msg: "No menu item available for this restaurant"
                });
              
            }
            else{
                return res.json({total_results: viewUsers.rowCount, users: viewUsers.rows});
            }    
            //console.log("total_results: " + viewmenu.rowCount, "dishes: " + viewmenu.rows);
        }
    });   
    
})

// get the list of all uses for marking attendance
router.post('/viewusers',verifyToken, async(req, res) => {
    
    //INITIALIZE JWT VERIFICATION
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){

            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            const data = req.body;
            const todate = new Date();
            const todate_iso = ISODateString(todate)
            //console.log(todate_iso);

            const markedusers = await pool.query("SELECT user_id, time_stamp from attendance")
            //console.log("marke users", markedusers)
            const result = matchDate(markedusers.rows); // user ids that have been marked for today's attendance
           console.log(result.size);
           //console.log(typeof result);
           const viewusers =  await pool.query("SELECT user_image, user_id, user_name, usertype_id FROM users WHERE restaurant_id=$1", [data.restaurant_id]);

            if(result.size == 0){
                
                if(!viewusers.rows[0] && !viewusers.rows.length){
                    return res.status(400).json({
                        error:1,
                        msg: "No user available for this restaurant"
                    });
                  
                }
                else{
                    return res.json({users: viewusers.rows});
                }
            }
           
            
            else if(result.size != 0){
                
                const viewusers2 = viewusers.rows; // all of the users
                //console.log(viewusers2);
    
                final_ans = [];
    
                viewusers2.forEach((element, index, array) => {
                    var cnt=0;
                    result.forEach((value) => {
                        //console.log("element.user_id and value",element.user_id, value);
                        if(element.user_id != value){
                            cnt++;
                        }
                    })
                    if(cnt == result.size){
                        final_ans.push({
                            "user_image": element.user_image,
                            "user_id": element.user_id,
                            "user_name": element.user_name,
                            "usertype_id": element.usertype_id
                        })
                    }
                })
                
               //console.log(final_ans)
    
                if(!final_ans && !final_ans){
                    return res.status(400).json({
                        error:1,
                        msg: "No user available for this restaurant"
                    });
                  
                }
                else{
                    return res.json({users: final_ans});
                }  
            }
            
         }
    });   
    
})



// works
router.post('/revenue', async(req, res) => {

    // jwt.verify(req.token, 'secretkey',async (err,authData)=>{
    //     if(err){

    //         //INVALID TOKEN/TIMEOUT 
    //         res.status(400).json({msg: "Session expired. Login again"})
            
    //     }else{
            
                    try {
                        const data = req.body;
                        const final = await pool.query("SELECT bill_id, table_no, no_of_occupants, final_bill, time_stamp FROM revenue WHERE restaurant_id=$1", [data.restaurant_id]);
   
                        var myArr = final.rows;
                        var answer = await iter(myArr);

                        if(!answer[0] && !answer.length){
                            res.status(400).json({
                                error:1,
                                msg: "some error"
                            });
                        } else {
                            res.json({"ans": answer});
                        }

                    } catch (err) {
                        console.log(err.message)
                    }
            // }      
})


// works
router.post('/register-user',async(req,res) => {  

    try {
        const data = req.body;

        // check if one or more mandatory field is empty
        // return error if true
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
        [data.restaurant_id, data.user_image, usertypeid, data.user_name, data.email_id, data.contact_no, data.contact_no2, hashedPassword]);

        return res.status(200).json({
            msg: "Registered successfully!"
        });
    } catch (err) {
        console.log("ERRRRR", err.message)
    }
})


// works
router.post('/mark_attendance',async(req,res) => {
    // jwt.verify(req.token, 'secretkey',async (err,authData)=>{
    //     if(err){

    //         //INVALID TOKEN/TIMEOUT 
    //         res.status(400).json({msg: "Session expired. Login again"})
            
    //     }else{
    
                try {
                    const data = req.body;
                    //console.log(data.restaurant_id)
                    //console.log(data.user_id)
                    //console.log(data.attendance_status)
                    if(!data.restaurant_id || !data.user_id){
                        
                        res.status(400).json({
                            error:1,
                            msg: "Provide all values"   
                        }); 

                    } else { 
                    
                        var date = new Date();
                        var currentISODate = ISODateTimeString(date);
                        
                        const username = await pool.query("SELECT user_name from users WHERE user_id=$1", [data.user_id])
                        const username2 = username.rows[0].user_name;
                        console.log(currentISODate)
                        const newUser = await pool.query(
                        "INSERT INTO attendance(restaurant_id,user_id, user_name, time_stamp,attendance_status) VALUES ($1, $2, $3, $4, $5)",
                            [data.restaurant_id,data.user_id, username2, currentISODate ,true]);
                            
                        res.status(200).json({msg:"Attendance marked" });
                    }
                } catch (err) {
                    console.log(err.message)
                }
            // }
})


// works
// ATTENDANCE
router.post('/view_attendance', async (req,res)=>{
// jwt.verify(req.token, 'secretkey',async (err,authData)=>{
    //     if(err){

    //         //INVALID TOKEN/TIMEOUT 
    //         res.status(400).json({msg: "Session expired. Login again"})
            
    //     }else{

    const data = req.body;
    
                try {

                    if(!req.body.restaurant_id)
                    {
                        res.status(400).json({
                            error:1,
                            msg: "Provide a restaurant ID"   
                        }); 
                    }
                    else{
                        const results = await pool.query('SELECT user_id,user_name,time_stamp,attendance_status FROM ATTENDANCE WHERE restaurant_id=$1', [data.restaurant_id]);
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
                    
                    
                } 
                catch (err) {
                    console.log(err.message)
                }
            // }
})


// works
// router.post('/view_attendance',async (req,res)=>{
//     // jwt.verify(req.token, 'secretkey',async (err,authData)=>{
//     //     if(err){

//     //         //INVALID TOKEN/TIMEOUT
//     //         res.status(400).json({msg: "Session expired. Login again"})
            
//     //     }else{
    
//                 try{
//                     if(!req.body.user_name)
//                     {
//                         res.status(400).json({
//                             error:1,
//                             msg: "Empty field"   
//                         }); 
//                     }
//                     else{
//                         const results = await pool.query(`SELECT user_id,user_name,time_stamp,attendance_status FROM ATTENDANCE where user_name like '%${req.body.user_name}%'`)
//                         //console.log(results)
//                         if(!results.rows[0] && !results.rows.length)
//                         {
//                             res.status(400).json({
//                                 error:1,
//                                 msg: "No data found for a given user"   
//                             }); 
//                         }
//                         else{
//                             res.status(200).json(results.rows);
//                         }
//                     }        
                    
//                 }
//                 catch(err){
//                     console.log(err.message);
//                 }
//             // }
// });

// FEEDBACK
router.post('/feedback',async (req,res)=>{

    // jwt.verify(req.token, 'secretkey',async (err,authData)=>{
    //     if(err){

    //         //INVALID TOKEN/TIMEOUT
    //         res.status(400).json({msg: "Session expired. Login again"})
            
    //     }else{
    
                try{
                    const data = req.body;
                    const results = await pool.query(`select FEEDBACK_ID,CATEGORY1,CATEGORY2,CATEGORY3,CATEGORY4 from feedback WHERE restaurant_id=$1`, [data.restaurant_id]);
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
            // }       
});

// delete stff member : requires restaurant_id and user_id
router.post('/delete_staff', async(req, res) => {
    try{
        const data = req.body;
        // Check for empty field
        if(!data.user_id || !data.restaurant_id)
        {
            return res.status(400).json({
                error: 1,
                msg: "One or more required field is empty!"
            });
        }
        else
        {
            //Get email_id from user_id
            const EmailOfUser = await pool.query("SELECT email_id FROM users WHERE restaurant_id=$1 and user_id=$2", [data.restaurant_id,data.user_id]);
            if(!EmailOfUser.rows[0] && !EmailOfUser.rows.length && !EmailOfUser.rows[0].email_id)
            {
                return res.status(400).json({
                    error:1,
                    msg: "A user with given user id does not exists for this restaurant"
                });
            }
            else{
                // console.log(EmailOfUser.rows[0].email_id);
                // Remove entry from FCM_JWT
                const isLoggedIn = await pool.query("DELETE FROM fcm_jwt WHERE email_id=$1", [EmailOfUser.rows[0].email_id]);
                // Remove entry from Attendance table
                const result1 = await pool.query("DELETE FROM attendance WHERE restaurant_id=$1 and user_id=$2", [data.restaurant_id,data.user_id]);
                // Remove entry from Users table
                const result2 = await pool.query("DELETE FROM users WHERE restaurant_id=$1 and user_id=$2", [data.restaurant_id,data.user_id]);
                return res.status(200).json({
                    msg: "Deleted successfully!"
                });
            }
        }

    }catch(err)
    {
        console.log(err.message);
    }
});


async function iter(myArr){

    var response = [];
    var date = new Date();
    var currentISODate = ISODateString(date);
    myArr.forEach((element, index, array) => {
        var date2 = element.time_stamp.split(" ");

        if(date2[0] == currentISODate){
            response.push({
                "bill_id" : element.bill_id,
                "table_no": element.table_no,
                "no_of_occupants": element.no_of_occupants,
                "final_bill": element.final_bill,
                "time_stamp": date2[0] + " " + date2[1],
            })
            //sum += element.final_bill;
        }

    });

    return response;
}


function matchDate(myArr){

    // var response = [];
    // var response = new Map();
    var response = new Set();
    var date = new Date();
    var currentISODate = ISODateString(date);
    myArr.forEach((element, index, array) => {
        var date2 = element.time_stamp.split(" ");

        if(date2[0] == currentISODate){
            // response.push({
            //     "user_id" : element.user_id
            // })
            // response['user_id'] = element.user_id;
            response.add(element.user_id)
        }
    });

    return response;
}


function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate())}

function ISODateTimeString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate()) +' '
          + pad(d.getUTCHours())+':'
          + pad(d.getUTCMinutes())+':'
          + pad(d.getUTCSeconds())}
   

async function verifyToken(req,res,next){

    const data =req.body
    const checkEntry =  await pool.query("SELECT last_jwt FROM fcm_jwt WHERE email_id=$1", [data.email_id]);
    const bearerToken = checkEntry.rows[0];
    
    if(typeof(bearerToken)!=='undefined'){
        req.token=bearerToken['last_jwt'];
        next();
    }else{
        res.sendStatus(403);
    }
}

module.exports = router;