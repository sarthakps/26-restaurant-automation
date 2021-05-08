const express = require("express")

const bodyParser = require('body-parser');
const router = express.Router();
const fs = require('fs');

const cors = require('cors')
const pool = require('../db')
const bcrypt = require('bcryptjs')
//importing jwt
const jwt=require('jsonwebtoken')

// var store = require('store')
const HandyStorage = require('handy-storage');
const storage = new HandyStorage({
    beautify: true
});


router.post('/login', async(req,res) => {
    try {
        const data = req.body;
        // check if a user with the given email ID exists in the database
        // if not, return error
        const login = await pool.query("SELECT * FROM users WHERE email_id=$1", [data.email_id]);
        
        if(login.rows.length == 0){
            return res.status(400).json({
                error: 1,
                msg: "A user with this email ID does not exist!"
            });
        }

        else{
            // validate password
                bcrypt.compare(data.password, login.rows[0].password, async function(err, result1){
                    console.log(result1)
                    // handle bcrypt compare error
                    if (result1==false) { 
                        return res.status(400).json({
                            error:1,
                            msg: "Invalid password! Please try again!"
                        });
                        throw (err); 
                    }else{
                        
                            const result = await pool.query("SELECT * FROM users WHERE email_id=$1", [data.email_id]);
                            // password matches
                            // console.log(result.rows[0]['password'])
                            // if(result.rows[0]['password'] === req.body.password){

                            //GET JWT TOKEN 
                            const emailid=data.email_id
                            
                            jwt.sign({emailid},'secretkey',{expiresIn: '5h'},async (err,token)=>{
                                
                                if(err){
                                    console.log(err.message)
                                }else{
                                    
                                    //need to create fcm token dont know how
                                    const fcmToken="temporary_fcm_token"   
                                    const checkEntry =  await pool.query("SELECT email_id FROM fcm_jwt WHERE email_id=$1", [data.email_id]);
                                    const checkEmailEntry =  await pool.query("SELECT email_id FROM fcm_jwt WHERE email_id=$1", [data.email_id]);
                                    //if already logged in then update
                                    if(checkEntry && typeof(checkEntry.rows[0])!=='undefined')
                                    {
                                        console.log('updating')
                                        const newUser = await pool.query(
                                            "UPDATE fcm_jwt SET last_jwt = $1 WHERE email_id=$2", [token, data.email_id]);
                                            
                                    }//if there is no email id info then insert
                                    else if(typeof(checkEmailEntry.rows[0])=='undefined'){
                                            console.log('inserting')
                                            const newUser = await pool.query(
                                            "INSERT INTO fcm_jwt(email_id,fcm_token,last_jwt,restaurant_id,usertype_id) VALUES ($1, $2, $3,$4,3)",
                                            [data.email_id, fcmToken, token,data.restaurant_id]);
                                            
                                    }//password is verified and there is log of email so resturant_id would be wrong
                                    else{
                                        console.log('invalid details')
                                        return res.status(400).json({
                                            error:"Invalid value of restaurant_id"
                                        })
                                    }

                                    //TOKEN CREATED WITHOUT ERROR  RETURN IT ALONG WITH LOGIN DATA
                                    return  res.status(200).json({
                                        token: token,
                                        msg: "Successfully logged in!",
                                        user_id: login.rows[0].user_id,
                                        restaurant_id: login.rows[0].restaurant_id,
                                        usertype_id: login.rows[0].usertype_id,
                                        user_name: login.rows[0].user_name,
                                        contact_no: login.rows[0].contact_no,
                                        user_image: login.rows[0].user_image
                                    });
                                }
                            
                            
                             }); 
                    }// invalid password
                    // else {
                    //     return res.status(400).json({
                    //         error:1,
                    //         msg: "Invalid password! Please try again!"
                    //     });
                    // }
                });
                         
            }
        
        } catch (err) {
            console.log(err.message);
        }
})


router.post('/ordered_dishes', verifyToken, async(req, res) => {
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){
    
            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            try {
                const data = req.body;
                const final = await pool.query("SELECT order_id, table_no, dish_id, dish_qty, no_of_occupants, time_stamp, delivered, is_jain_wanted FROM ordered_dishes WHERE restaurant_id=$1 and delivered=false", [data.restaurant_id]);
                //console.log( "FINAL.ROWS", final.rows)

                if(!final.rows[0] && !final.rows.length){
                    res.status(400).json({
                        error:1,
                        msg: "some error"
                    });
                } else {

                    const array = final.rows;
                    const final2 = await iter(array);
       
                    const dishName = await pool.query("SELECT dish_id, dish_name from menu WHERE restaurant_id=$1", [data.restaurant_id]);
                    //console.log("DISHNAME", dishName.rows)
                    const dishName2 = dishName.rows;

                    //console.log("FINAL2 dish_id", final2[0].dish_id)
                    var final_ans = [];
                    if(final2.length == 1){
                        dishName2.forEach((element, index, array) => {
                            if(element.dish_id == final2[0].dish_id){
                                final_ans.push({
                                    "order_id" : final2[0].order_id,
                                    "table_no": final2[0].table_no,
                                    "dish_name": element.dish_name,
                                    "dish_qty": final2[0].dish_qty,
                                    "no_of_occupants": final2[0].no_of_occupants,
                                    "time_stamp": final2[0].time_stamp,
                                    "is_jain_wanted": final2[0].is_jain_wanted
                                })
                            }
                        })  
                    }

                    else{
                        
                        final2.forEach((element, index, array) => {
                            var final_dishid = element.dish_id;
                            var order_id = element.order_id;
                            var table_no = element.table_no;
                            var dish_qty = element.dish_qty;
                            var no_of_occupants = element.no_of_occupants;
                            var time_stamp = element.time_stamp;
                            var delivered = element.delivered;
                            var is_jain_wanted = element.is_jain_wanted

                            dishName2.forEach((element, index, array) => {
                                if(element.dish_id == final_dishid){
                                    final_ans.push({
                                        "order_id" : order_id,
                                        "table_no": table_no,
                                        "dish_name": element.dish_name,
                                        "dish_qty": dish_qty,
                                        "no_of_occupants": no_of_occupants,
                                        "time_stamp": time_stamp,
                                        "delivered": delivered,
                                        "is_jain_wanted" : is_jain_wanted
                                    })
                                }
                            })     
                                
                        });

                    }
                    
                    //console.log(final_ans)
                    res.json({"ans": final_ans});
                }

            } catch (err) {
                console.log(err.message)
            }
     }      
})
            
})


router.put('/delivered', verifyToken, async(req, res) => {
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){
    
            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            try {
                const data = req.body;
                const final = await pool.query("UPDATE ordered_dishes SET delivered=true WHERE order_id=$1", [data.order_id]);

                res.status(200).json({msg: "Updated status successfully!"});

            } catch (err) {
                console.error(err);
                res.json({msg : "Error"});
            }
     }      
})
            
})



function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate())}


async function iter(myArr){

    var response = [];
    var date = new Date();
    var currentISODate = ISODateString(date);
    myArr.forEach((element, index, array) => {
        var date2 = element.time_stamp.split(" ");

        //order_id, table_no, dish_id, dish_qty, no_of_occupants
        if(date2[0] == currentISODate){
            response.push({
                "order_id" : element.order_id,
                "table_no": element.table_no,
                "dish_id": element.dish_id,
                "dish_qty": element.dish_qty,
                "no_of_occupants": element.no_of_occupants,
                "time_stamp": date2[1],
                "is_jain_wanted": element.is_jain_wanted
            })
        }
    });
    return response;
}


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