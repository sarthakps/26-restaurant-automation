const express = require("express")

const bodyParser = require('body-parser');
const router = express.Router();
const fs = require('fs');

const bcrypt = require('bcryptjs')
//importing jwt
const jwt=require('jsonwebtoken')

const cors = require('cors')
const pool = require('../db')

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

        // validate password
        bcrypt.compare(data.password, login.rows[0].password, function(err, result) {
            
            // handle bcrypt compare error
            if (err) { throw (err); }
           
            // password matches
            if(result){
                return res.status(200).json({
                    msg: "Successfully logged in!",
                    user_id: login.rows[0].user_id,
                    restaurant_id: login.rows[0].restaurant_id,
                    usertype_id: login.rows[0].usertype_id,
                    user_name: login.rows[0].user_name,
                    contact_no: login.rows[0].contact_no,
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
    } catch (err) {
        console.log(err.message);
    }
})

module.exports = router;