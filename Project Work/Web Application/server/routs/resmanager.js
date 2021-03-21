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
        const viewmenu = await pool.query("SELECT dish_name, dish_price FROM restaurant_db.menu");
        res.json(viewmenu.rows);
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

module.exports = router;