const express = require("express");

const bodyParser = require('body-parser');
const router = express.Router();
const fs = require('fs');

const cors = require('cors')
const pool = require('../db')
const bcrypt = require('bcryptjs')
//importing jwt
const jwt=require('jsonwebtoken')


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
                // bcrypt.compare(data.password, login.rows[0].password, function(err, result) {
                    
                //     // handle bcrypt compare error
                //     if (err) { throw (err); }
                const result = await pool.query("SELECT * FROM users WHERE email_id=$1", [data.email_id]);
                    // password matches
                    console.log(result.rows[0]['password'])
                    if(result.rows[0]['password'] === req.body.password){

                        //GET JWT TOKEN 
                        const emailid=data.email_id
                        
                        jwt.sign({emailid},'secretkey',{expiresIn: '5h'},async (err,token)=>{
                            
                            if(err){
                                console.log(err.message)
                            }else{
                                
                                //need to create fcm token dont know how
                                const fcmToken="temporary_fcm_token"   
                                const checkEntry =  await pool.query("SELECT email_id FROM fcm_jwt WHERE email_id=$1", [data.email_id]);
                                
                                // //if already logged in then update
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
                                    token: token,
                                    msg: "Successfully logged in!",
                                    user_id: login.rows[0].user_id,
                                    restaurant_id: login.rows[0].restaurant_id,
                                    usertype_id: login.rows[0].usertype_id,
                                    user_name: login.rows[0].user_name,
                                    contact_no: login.rows[0].contact_no,
                                });
                            }
                            
                        }); 
                    }// invalid password
                    else {
                        return res.status(400).json({
                            error:1,
                            msg: "Invalid password! Please try again!"
                        });
                    }
                // });
                         
            }
        
        } catch (err) {
            console.log(err.message);
        }
})

router.put('/menu', verifyToken, async(req, res) => {
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){
    
            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            try {
                const data = req.body;
        
                const upd = await pool.query("UPDATE menu SET dish_name=$1, dish_price=$2, status=$3, description=$4, jain_availability=$5 WHERE restaurant_id=$6 and dish_id=$7", [data.dish_name, data.dish_price, data.status, data.description, data.jain_availability, data.restaurant_id, data.dish_id]);
                //console.log(upd);
                res.status(200).json({msg: "Updated status successfully!"});
        
            } catch (err) {
                console.error(err);
                res.json({msg : "Error"});
            }
            
        }
    });   
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