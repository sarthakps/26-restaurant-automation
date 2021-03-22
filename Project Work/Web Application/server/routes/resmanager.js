const express = require("express")

const bodyParser = require('body-parser');
const router = express.Router();
const fs = require('fs');

const cors = require('cors')
const pool = require('../db')

//const path = require('path')

//const app = express()



router.post('/login', async(req,res) => {
    try {
        const data = req.body;
        pool.query("SET search_path TO 'restaurant_db';");
        const login = await pool.query("SELECT user_id, password FROM restaurant_db.manager WHERE user_id=$1 and password=$2", [data.user_id, data.password]);

        console.log("login data res", login.rows);

        if(!login.rows[0] && !login.rows.length){
            res.json(400,{
                error:1,
                msg: "some error"
            });
        } else {
            res.json(login.rows[0]);
        }

    } catch (err) {
        console.log(err.message);
    }
})


router.get('/viewmenu', async(req, res) => {
    try {
        const viewmenu = await pool.query("SELECT dish_id, dish_name, description, dish_price, status, jain_availability FROM restaurant_db.menu");
        res.json({total_results: viewmenu.rowCount, dishes: viewmenu.rows});

        console.log("total_results: " + viewmenu.rowCount, "dishes: " + viewmenu.rows);
    } catch (err) {
        console.log(err.message)
    }
})


router.post('/revenue', async(req, res) => {
    try {
        const data = req.body;

        const final = await pool.query("SELECT SUM(final_bill) FROM restaurant_db.revenue WHERE time_stamp>=$1 and time_stamp<=$2", [data.from_time_stamp
        , data.to_time_stamp]);

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


//
router.post('/register_user',async(req,res) => {
    
    try {
        const data = req.body;
        if(!data.restaurant_id || !data.user_image || !data.user_role || !data.user_name || !data.email_id || !data.contact_no || !data.password){
            
            res.status(400).json({
                error:1,
                msg: "Provide all values"
            }); 

        } else { 

            const usertypeid = await pool.query("SELECT usertype_id from restaurant_db.usertype WHERE user_role=$1", [data.user_role])
            const usertypeid2 = usertypeid.rows[0].usertype_id;
                const newUser = await pool.query(
                "INSERT INTO restaurant_db.users(restaurant_id,user_image,usertype_id,user_name,email_id,contact_no,contact_no_optional,password) VALUES ($1, $2, $3,$4, $5,$6,$7,$8)",
                [data.restaurant_id, data.user_image, usertypeid2, data.user_name, data.email_id, data.contact_no, data.contact_no_optional, data.password]);
               
                res.json({msg:"User added" });
            
        }
    } catch (err) {
        console.log("ERROR : ", err.message)
    }
})


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
            
            const username = await pool.query("SELECT user_name from restaurant_db.users WHERE user_id=$1", [data.user_id])
            const username2 = username.rows[0].user_name;
            const newUser = await pool.query(
            "INSERT INTO restaurant_db.attendance(restaurant_id,user_id, user_name, time_stamp,attendance_status) VALUES ($1, $2, $3, $4, $5)",
                [data.restaurant_id,data.user_id, username2, time_now.rows[0]['now'],data.attendance_status]);
                
            res.json({msg:"Attendance marked" });
        }
    } catch (err) {
        console.log(err.message)
    }
})

module.exports = router;