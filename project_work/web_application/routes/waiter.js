const express = require("express")

const bodyParser = require('body-parser');
const router = express.Router();
const fs = require('fs');

const bcrypt = require('bcryptjs')
//importing jwt
const jwt=require('jsonwebtoken')

const cors = require('cors')
const pool = require('../db')


var admin = require('firebase');
var serviceAccount = require("routes\canteen-management-456ca-firebase-adminsdk-9j8r5-1317415eb1.json");
var app_fcm = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });





// login + jwt + email
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
        }else{
            // validate password
            bcrypt.compare(data.password, login.rows[0].password, async function(err, result2) {
                
                // handle bcrypt compare error
                if (result2==false) { 
                    return res.status(400).json({'msg':'Incorrect password!'})
                }
                
                //GET JWT TOKEN 
                const emailid=data.email_id
                jwt.sign({emailid},'secretkey',{expiresIn: '5h'},async (err,token)=>{
                    
                    if(err){
                        console.log(err.message)
                    }else{
                        
                        const fcmToken="temporary_fcm_token"   
                        const checkEntry =  await pool.query("SELECT email_id FROM fcm_jwt WHERE email_id=$1", [data.email_id]);
                        
                        //if already logged in then update
                        if(checkEntry && typeof(checkEntry.rows[0])!=='undefined')
                        {
                            console.log('updating')
                            const newUser = await pool.query(
                                "UPDATE fcm_jwt SET last_jwt = $1 WHERE email_id=$2", [token, data.email_id]);
                                
                        }//if there is no login info then insert
                        else{
                                console.log('inserting')
                                const newUser = await pool.query(
                                "INSERT INTO fcm_jwt(email_id,fcm_token,last_jwt,restaurant_id,usertype_id) VALUES ($1, $2, $3,$4,1)",
                                [data.email_id, fcmToken, token,data.restaurant_id]);
                                
                        }

                        //TOKEN CREATED WITHOUT ERROR  RETURN IT ALONG WITH LOGIN DATA
                        return  res.status(200).json({
                                token: token,
                                msg: "Successfully logged in!",
                                user_id: login.rows[0].user_id,
                                restaurant_id: data.restaurant_id,
                                user_name: login.rows[0].user_name,
                        });
                    }
                    
                }); 
                
            });
            
            
                    
                 
        }
        
    } catch (err) {
        console.log(err.message);
    }
})


// save_fcm_token : fcm, jwt
router.post('/save_fcm_token',verifyToken, async(req,res) => {

    const data = req.body;
    const email =  await pool.query("SELECT email_id from fcm_jwt WHERE last_jwt=$1", [data.jwt]);

    if(!email.rows[0] && !email.rows.length){
        res.status(400).json({msg: "Invalid jwt-token!"})        
    }
    else{
        const newUser = await pool.query(
            "UPDATE fcm_jwt SET fcm_token = $1 WHERE last_jwt=$2", [data.token, data.jwt]);
        return res.json({msg: "FCM token updated."});
    }   
})


router.post('/viewmenu',verifyToken, async(req, res) => {
    
    //INITIALIZE JWT VERIFICATION
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){
            console.log(err)
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
        }
    });   
    
})


// data in request = email_id, restaurant_id, tabel_no
// returned data in response : table_no, dish_id, dish_qty, price of that particular dish(according to quantity), no_of_occupants, time_stamp of order of every dish, Grand Total !

router.post('/generate_bill', verifyToken, async(req, res) => {
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){
            console.log("ERORRRR: ", err)
            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            try {
                const data = req.body;
            
                const final = await pool.query("SELECT order_id, table_no, dish_id, dish_qty, no_of_occupants, time_stamp FROM ordered_dishes WHERE restaurant_id=$1 and table_no=$2", [data.restaurant_id, data.table_no]);
                const final2 = final.rows;

                const price = await pool.query("SELECT dish_id, dish_name, dish_price from menu");
                const price2 = price.rows;

                    var final_ans = [];
                    var grand_total = 0;

                    if(final2.length == 1){
                        price2.forEach((element, index, array) => {
                            if(element.dish_id == final2.dish_id){
                                final_ans.push({
                                    "order_id" : final2.order_id,
                                    "dish_id": final2.dish_id,
                                    "table_no": final2.table_no,
                                    "dish_name": element.dish_name,
                                    "dish_price": element.dish_price,
                                    "dish_qty": final2.dish_qty,
                                    "no_of_occupants": final2.no_of_occupants,
                                    "time_stamp": final2.time_stamp,
                                })
                                grand_total = (element.dish_price)*(dish_qty)
                            }
                        }) 

                    }

                    else{
                        
                        final2.forEach((element, index, array) => {
                            var dish_id = element.dish_id;
                            var order_id = element.order_id;
                            var table_no = element.table_no;
                            var dish_qty = element.dish_qty;
                            var no_of_occupants = element.no_of_occupants;
                            var time_stamp = element.time_stamp;

                            price2.forEach((element, index, array) => {
                                if(element.dish_id == dish_id){
                                    final_ans.push({
                                        "order_id" : order_id,
                                        "dish_id": dish_id,
                                        "table_no": table_no,
                                        "dish_name": element.dish_name,
                                        "dish_price": element.dish_price,
                                        "dish_qty": dish_qty,
                                        "no_of_occupants": no_of_occupants,
                                        "time_stamp": time_stamp
                                    })
                                    grand_total += (element.dish_price)*(dish_qty)
                                }
                            })     
                                
                        });
                    }

                    console.log(final_ans, grand_total);

                if(!final_ans[0] && !final_ans.length){
                    res.status(400).json({
                        error:1,
                        msg: "some error"
                    });
                } else {  
                    
                    res.json({"ans": final_ans, "grand_total": grand_total});
                }
            
            } catch (err) {
                console.log(err.message)
            }
     }      
})
            
})


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
