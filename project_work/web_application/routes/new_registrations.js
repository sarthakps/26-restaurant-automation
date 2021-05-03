
// @flow

const express = require("express")

const bodyParser = require('body-parser');
const router= express.Router();
const fs = require('fs');

const cors = require('cors')
const pool = require('../db')
const bcrypt = require('bcryptjs')
//importing jwt
const jwt=require('jsonwebtoken')

//const path = require('path')
//const app = express()





router.post('/register_manager',async(req,res) => {  
    
    try {
        const data = req.body;
        // check if one or more mandatory field is empty
        // return error if true
        //manager ID will be added implicitly as it is serial
        if(!data.restaurant_id || !data.user_image  || !data.user_name || !data.email_id || !data.contact_no || !data.password){
            return res.status(400).json({
                error: 1,
                msg: "One or more required field is empty!"
            }); 
        } 

        // check if the email ID is already registered or not
        // return error if true
        const user_manager = await pool.query("SELECT email_id from manager WHERE email_id=$1", [data.email_id]);
        if(user_manager.rows.length){
            return res.status(400).json({
                error: 1,
                msg: "This email ID is already registered!"
            });
        }
        
        // check if maximum allowed managers for the given restaurant is reached or not
        // if maximum managers are already registered, return error
        const subscriptiontypeId = await pool.query("SELECT subscription_type_id FROM restaurant WHERE restaurant_id = $1", [data.restaurant_id]);  
        const usertypeid=data.usertype_id; 
        const subscriptionTypeId=subscriptiontypeId.rows[0]['subscription_type_id']; 
        
        const maxmanagers = await pool.query("SELECT max_manager FROM subscription WHERE subscription_type_id = $1", [subscriptionTypeId]);
        const maxManagers = maxmanagers.rows[0]['max_manager']
        
        const currentmanagers = await pool.query("SELECT count(*) from manager WHERE restaurant_id = $1", [data.restaurant_id]);
        const currentManagers = parseInt(currentmanagers.rows[0]['count'])
        
        if(currentManagers >= maxManagers){
            return res.status(400).json({
                error: 1,
                msg: "Maximum number of allowed managers are already registered! Your plan only allows a maximum of " + maxManagers.toString() + " managers!"
            });
        }

        // generating hashed password (salt rounds = 12)
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        
        // inserting new manager into the database
        const newUser = await pool.query(
        "INSERT INTO manager(restaurant_id,user_image,user_name,email_id,contact_no,contact_no_optional,password) VALUES ($1, $2, $3,$4, $5,$6,$7)",
        [data.restaurant_id, data.user_image, data.user_name, data.email_id, data.contact_no, data.contact_no2, hashedPassword]);
    
        return res.status(200).json({
            msg: "Registered successfully!"
        });

    } catch (err) {
        console.log('error found')
        console.log(err.message)
    }
})

router.post('/register_restaurant',async(req,res) =>{

    try {
        const data = req.body;
        console.log(data)
        // check if one or more mandatory field is empty
        // return error if true
        //restaurant ID will be added implicitly as it is serial
        if(!data.restaurant_name || !data.total_tables || !data.subscription_type_id){
            return res.status(400).json({
                error: 1,
                msg: "One or more required field is empty!"
            }); 
        }
        
        // check if the restaurant name is already registered or not
        // return error if true
        const restaurant_name = await pool.query("SELECT restaurant_name from restaurant WHERE restaurant_name=$1", [data.restaurant_name]);
        if(restaurant_name.rows.length){
            return res.status(400).json({
                error: 1,
                msg: "This restaurant name is already registered!"
            });
        }
    
        // inserting new restaurant into the database
        const newRestaurant = await pool.query(
        "INSERT INTO restaurant(restaurant_name,total_tables,subscription_type_id) VALUES ($1,$2,$3)",
        [data.restaurant_name,data.total_tables,data.subscription_type_id]);
        
        return res.status(200).json({
            msg: "Restaurant added!"
        });

    } catch (err) {
        console.log(err)
        return res.status(400).json({
                error: 2,
                msg: "Input error: Check values and datatypes."
            });
    }

})

router.post('/new_subscription',async(req,res) =>{

    try {
        const data = req.body;
        console.log(data)
        // check if one or more mandatory field is empty
        // return error if true
        //subsciption ID will be added implicitly as it is serial
        if(!data.price || !data.max_kitchen_personnel || !data.max_inv_manager|| !data.max_manager || !data.max_waiter){
            return res.status(400).json({
                error: 1,
                msg: "One or more required field is empty!"
            }); 
        }
        

        // inserting new subscription type into the database
        const new_subscription = await pool.query(
        "INSERT INTO subscription(max_manager,max_inv_manager,max_kitchen_personnel,max_waiter,price) VALUES ($1,$2,$3,$4,$5)",
        [data.max_manager,data.max_inv_manager,data.max_kitchen_personnel,data.max_waiter,data.price]);
        
        return res.status(200).json({
            msg: "New subscription added!"
        });

    } catch (err) {
        console.log(err)
        return res.status(400).json({
                error: 2,
                msg: "Input error: Check values and datatypes."
            });
    }

})



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


function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate())}
   

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