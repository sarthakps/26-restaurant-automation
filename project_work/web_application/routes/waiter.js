const express = require("express")

const bodyParser = require('body-parser');
const router = express.Router();
const fs = require('fs');

const bcrypt = require('bcryptjs')
//importing jwt
const jwt=require('jsonwebtoken')

const cors = require('cors')
const pool = require('../db')

// var admin = require('firebase');
// var serviceAccount = require("routes\canteen-management-456ca-firebase-adminsdk-9j8r5-1317415eb1.json");
// var app_fcm = admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
//   });




router.post('/fcmtest', async(req, res) => {

    try {
        console.log('body:', req.body);
        const data = req.body;
        var token = data['token'];

        var message = {
        data: {
            score: '850',
            time: '2:45'
        },
        token: token
        };

        console.log("Client Token: ", token);

        // Send a message to the device corresponding to the provided
        // registration token.
        admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
    } catch (error) {
        console.log('error: ', error);
    }

})

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
                if (err) { 
                    throw (err); 
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
                                "INSERT INTO fcm_jwt(email_id,fcm_token,last_jwt) VALUES ($1, $2, $3)",
                                [data.email_id, fcmToken, token]);
                                
                        }

                        //TOKEN CREATED WITHOUT ERROR  RETURN IT ALONG WITH LOGIN DATA
                        return  res.status(200).json({
                                // token: token,
                                msg: "Successfully logged in!",
                                user_id: login.rows[0].user_id,
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




async function verifyToken(req,res,next){

    const data =req.body
    // console.log(data)
    const checkEntry =  await pool.query("SELECT last_jwt FROM fcm_jwt WHERE email_id=$1", [data.email_id]);
    // console.log(checkEntry)
    const bearerToken = checkEntry.rows[0];
    
    if(typeof(bearerToken)!=='undefined'){
        req.token=bearerToken['last_jwt'];
        next();
    }else{
        res.sendStatus(403);
    }
}

module.exports = router;
