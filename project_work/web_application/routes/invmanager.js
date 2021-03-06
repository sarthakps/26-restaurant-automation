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
                        const checkEntry =  await pool.query("SELECT email_id FROM fcm_jwt WHERE email_id=$1 and restaurant_id=$2", [data.email_id,data.restaurant_id]);
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
                                "INSERT INTO fcm_jwt(email_id,fcm_token,last_jwt,restaurant_id,usertype_id) VALUES ($1, $2, $3,$4,2)",
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
                                restaurant_id: data.restaurant_id,
                                user_name: login.rows[0].user_name,
                                user_image: login.rows[0].user_image
                        });
                    }
                    
                }); 
                
            });
        } 
    }catch (err) {
        console.log(err.message);
        res.status(400).json({
            error_msg:err.message
        })
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


router.post('/view_inventory',verifyToken, async(req, res) => {
    
    //INITIALIZE JWT VERIFICATION
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){

            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            const data = req.body;
            const viewinv =  await pool.query("SELECT inventory_id, item_name, available_qty FROM inventory WHERE restaurant_id=$1", [data.restaurant_id]);
            
            if(!viewinv.rows[0] && !viewinv.rows.length){
                return res.status(400).json({
                    error:1,
                    msg: "No menu item available for this restaurant"
                });
              
            }
            else{
                return res.json({total_results: viewinv.rowCount, dishes: viewinv.rows});
            }    
            //console.log("total_results: " + viewmenu.rowCount, "dishes: " + viewmenu.rows);
        }
    });   
    
})

router.put('/inventory', verifyToken, async(req, res) => {
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){
    
            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            try {
                const data = req.body;
                    if(!data.item_name || !data.available_qty || !data.restaurant_id || !data.inventory_id){
                        return res.status(400).json({
                            error: 1,
                            msg: "One or more required field is empty!"
                        }); 
                    }
                //console.log(data)
                const upd = await pool.query("UPDATE inventory SET item_name=$1, available_qty=$2 WHERE restaurant_id=$3 and inventory_id=$4", [data.item_name, data.available_qty, data.restaurant_id,data.inventory_id]);
                console.log(upd);
                res.status(200).json({msg: "Updated inventory successfully!"});
        
            } catch (err) {
                console.error(err);
                res.json({msg : "Error"});
            }
            
        }
    });   
})


//delete inventory item
router.delete('/inventory_item', verifyToken, async(req, res) => {
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){
    
            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            try {
                const data = req.body;
                    if(!data.restaurant_id || !data.inventory_id){
                        return res.status(400).json({
                            error: 1,
                            msg: "One or more required field is empty!"
                        }); 
                    }
                //console.log(data)
                const upd = await pool.query("DELETE from inventory where restaurant_id=$1 and inventory_id=$2", [data.restaurant_id,data.inventory_id]);
                if(upd.rowCount==0){
                    res.status(403).json({
                        msg:"Trying to delete data that does not exist."
                    })
                }else{
                    res.status(200).json({msg: "Delete successful!"});
                }
        
            } catch (err) {
                console.error(err);
                res.json({msg : "Error"});
            }
            
        }
    });   
})

//delete menu item
router.delete('/menu_item', verifyToken, async(req, res) => {
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){
    
            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            try {
                const data = req.body;
                    if(!data.restaurant_id || !data.dish_id){
                        return res.status(400).json({
                            error: 1,
                            msg: "One or more required field is empty!"
                        }); 
                    }
                //console.log(data)
                const upd = await pool.query("DELETE from menu where restaurant_id=$1 and dish_id=$2", [data.restaurant_id,data.dish_id]);
                if(upd.rowCount==0){
                    res.status(403).json({
                        msg:"Trying to delete data that does not exist."
                    })
                }else{
                    res.status(200).json({msg: "Delete successful!"});
                }
        
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