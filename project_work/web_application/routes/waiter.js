
const express = require("express")

const bodyParser = require('body-parser');
const router = express.Router();
const fs = require('fs');

const bcrypt = require('bcryptjs')
//importing jwt
const jwt=require('jsonwebtoken')

const cors = require('cors')
const pool = require('../db')



var admin = require('firebase-admin');
var serviceAccount = require(".\\restaurant-automation-8ad32-firebase-adminsdk-tixax-5d244a4be7.json")
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
// =======
//                 if (err) { 
//                     throw (err); 
// =======
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
                                "INSERT INTO fcm_jwt(email_id,fcm_token,last_jwt,restaurant_id,usertype_id) VALUES ($1, $2, $3,$4,1)",
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
                        });
                    }
                  
                    

                }); 
                
            });     
                 
        }
        
    } catch (err) {
        console.log(err.message);
        res.status(400).json({
            error_msg:err.message
        })
    }
})

// ===== dev

router.post('/send_feedback_questions',verifyToken,async(req, res) =>{
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
    if(err){
        console.log(err)
        //INVALID TOKEN/TIMEOUT so delete the entry from databse 
        // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
        res.status(400).json({msg: "Session expired. Login again"})
        
    }else{
        try{
            const result = await pool.query('SELECT QUESTION FROM feedback_questions');
            if(!result.rows[0] && !result.rows.length)
            {
                res.status(400).json({
                    error:1,
                    msg: "No questions are in database"   
                }); 
            }
            else{
                // console.log(result);
                res.status(200).json({
                    questions:result.rows
                });
            }
        }catch(err){
            console.log(err.message);
        }
    }
    });
});
//add verify token
router.post('/receive_feedback',verifyToken,async(req, res) =>{
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
    if(err){
        console.log(err)
        //INVALID TOKEN/TIMEOUT so delete the entry from databse 
        // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
        res.status(400).json({msg: "Session expired. Login again"})
        
    }else{
        try{
            const data = req.body;
            if(!data.restaurant_id || !data.bill_id || !data.question_id || !data.score || data.question_id.length==0 || data.score.length==0 || data.question_id.length!=data.score.length)
            {
                res.status(400).json({
                    error:1,
                    msg: "One or more required field is empty!" });
              
            }else{
               //It is assumed that score will always be between 1 to 5.
                
                    
                let index;         
                for(index=0;index<data.question_id.length;index++)
                {
                    const result = await pool.query('INSERT INTO feedback(RESTAURANT_ID,BILL_ID,QUESTION_ID,SCORE) VALUES($1,$2,$3,$4)',[data.restaurant_id,data.bill_id,data.question_id[index],data.score[index]])
                    // console.log(result);
                }
                return res.status(200).json({
                    msg: "Added Successfully!"
                });
                
                
            }
        }catch(err){
            console.log(err.message);
        }
    }
    });
});
// =======

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

//insert order into the ordered_dishes table and send notification to the kitchen personnel
//input: order details
//output: 
    // msg:status of insertion
    // data:{
    //     order: data sent to the kitchen personnel
    // }
 router.post('/insert_order', verifyToken, async(req, res) =>{
        jwt.verify(req.token, 'secretkey',async (err,authData)=>{
            if(err){
                
                res.status(400).json({msg: "Session expired. Login again"})
                
            }else{
                try{
                    const data = req.body;
                    if(!data.restaurant_id || !data.table_no || !data.is_jain_wanted || !data.dish_id || !data.dish_qty || !data.no_of_occupants || data.dish_id.length==0 || data.dish_qty.length==0 || data.dish_id.length!=data.dish_qty.length || data.is_jain_wanted.length!=data.dish_qty.length)
                    {
                        res.status(400).json({
                            error:1,
                            msg: "One or more required field is empty!"
                        });
                    }
                    else{
                        let date = new Date();
                        let currentISODate = ISODateTimeString(date);
                        // check for availibility of order dishes
                        let availability=await checkavailability(data.dish_id);
                        // console.log(availability)
                        if(!availability)
                        {
                            res.status(400).json({
                                error:1,
                                msg:"Dish not available!"
                                });
                        }
                        else{
                            //Add all the orderes to ORDERED_DISHES                             
                            var notif_arr=[];
                            let index;    
                            for(index=0;index<data.dish_id.length;index++)
                            {
                                const result = await pool.query('INSERT INTO ORDERED_DISHES(RESTAURANT_ID,TABLE_NO,DISH_ID,DISH_QTY,NO_OF_OCCUPANTS,TIME_STAMP,delivered,is_jain_wanted) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',[data.restaurant_id,data.table_no,data.dish_id[index],data.dish_qty[index],data.no_of_occupants,currentISODate,false,data.is_jain_wanted[index]])
                                
                                //push orders into notification array
                                notif_arr.push({
                                    "restaurant_id":data.restaurant_id,
                                    "table_no":data.table_no,
                                    "dish_id":data.dish_id[index],
                                    "dish_qty":data.dish_qty[index],
                                    "no_of_occupants":data.no_of_occupants,
                                    "is_jain_wanted":data.is_jain_wanted[index],
                                    "time_stamp":currentISODate,
                                    "delivered":false
                                })
                            }
                            
                            //convert notification array to string to pass as attr
                            var notif={}
                            notif.orders=JSON.stringify(notif_arr)
                            
    
                            //get fcm_tokens of all kitchen personnel with same restaurant_id
                            var kitchen_personnel_fcm = await pool.query("SELECT fcm_token FROM fcm_jwt WHERE restaurant_id=$1 and usertype_id=$2", [data.restaurant_id,3]);
                            if(kitchen_personnel_fcm.rowCount!=0){
                            var tokens=[]
                            kitchen_personnel_fcm['rows'].forEach((element, index, array) => {
                                tokens.push(element['fcm_token'])
                            })
    
                            //send notification to all kitchen personnel with same restaurant_id
                            var payload = {
                                notification:{
                                    title: "New order"
                                },
                                data: notif
                            };
                            // console.log(tokens)
                            
                            // to retieve data back use this syntax
                            // var crap=JSON.parse(payload.data.orders)
                            // console.log(crap[0])
    
                            admin.messaging().sendToDevice(tokens,payload)
                            .then((response) => {
                                console.log('Successfully sent message:', response);
                            })
                            .catch((error) => {
                                console.log('Error sending message:', error);
                            });
                            }
                            return res.status(200).json({
                                msg: "Added Successfully!",
                                data: notif
                            });
                        }
                    }
                }catch (err) {
                    console.log(err.message)
                    return res.status(400).json({
                        error: err.message,
                        msg: 'Invalid input!'
                    })
                }
            }
        });
    });


// data in request = email_id, restaurant_id, tabel_no
// returned data in response : table_no, dish_id, dish_qty, price of that particular dish(according to quantity), no_of_occupants, time_stamp of order of every dish, Grand Total !
router.post('/generate_bill', verifyToken, async(req, res) => {
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){
            //console.log("ERORRRR: ", err)
            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            try {
                const data = req.body;
            
                const final = await pool.query("SELECT order_id, table_no, dish_id, dish_qty, no_of_occupants, time_stamp FROM ordered_dishes WHERE restaurant_id=$1 and table_no=$2", [data.restaurant_id, data.table_no]);
                const final2 = final.rows;
               // console.log("final2 : ", final2.length)

                const price = await pool.query("SELECT dish_id, dish_name, dish_price from menu");
                const price2 = price.rows;
                //console.log("price2 : ", price2)

                    var final_ans = [];
                    var grand_total = 0;
                    //console.log(final2[0].dish_id)

                    if(final2.length == 1){
                        price2.forEach((element, index, array) => {
                            if(element.dish_id == final2[0].dish_id){
                                final_ans.push({
                                    "order_id" : final2[0].order_id,
                                    "dish_id": final2[0].dish_id,
                                    "table_no": final2[0].table_no,
                                    "dish_name": element.dish_name,
                                    "dish_price": element.dish_price,
                                    "dish_qty": final2[0].dish_qty,
                                    "no_of_occupants": final2[0].no_of_occupants,
                                    "time_stamp": final2[0].time_stamp
                                })
                                grand_total += (element.dish_price)*(final2[0].dish_qty)
                            }
                        }) 
                        //console.log("final_ans : ", final_ans)
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

                    //console.log(final_ans, grand_total);

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

// input = email_id, restaurannt_id, table_no, final_bill, no_of_occupants
// output = sucess message of database insertion
router.post('/on_bill_pay', verifyToken, async(req, res) => {
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){
    
            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            try {
                const data = req.body;

                if(!data.restaurant_id || !data.table_no || !data.final_bill || !data.no_of_occupants){
                    return res.status(400).json({
                        error: 1,
                        msg: "Provide all of the attributes!"
                    }); 
                }

                const date = new Date();
                const datenow = ISODateTimeString(date);
                //console.log("Datenow : ", datenow)
                const revenue = await pool.query("INSERT INTO revenue(restaurant_id, table_no, no_of_occupants, final_bill, time_stamp) VALUES($1, $2, $3, $4, $5)", [data.restaurant_id, data.table_no, data.no_of_occupants, data.final_bill, datenow])

                const revenue2 = await pool.query("SELECT bill_id FROM revenue WHERE restaurant_id=$1 and table_no=$2 and time_stamp=$3", [data.restaurant_id, data.table_no, datenow]);
                //console.log("bill_id", revenue2.rows[0].bill_id)

                const bill_id = revenue2.rows[0].bill_id;

                const orders = await pool.query("SELECT * FROM ordered_dishes WHERE restaurant_id=$1 and table_no=$2", [data.restaurant_id, data.table_no])
                //console.log("ORDERS : ", orders.rows)

                orders.rows.forEach(async element => {

                    try {
                         var paid_dishes = await pool.query("INSERT INTO paid_dishes(order_id, restaurant_id, bill_id, table_no, dish_id, dish_qty, no_of_occupants, time_stamp) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
                    [element.order_id, element.restaurant_id, bill_id, element.table_no, element.dish_id, element.dish_qty, element.no_of_occupants, datenow]);

                    //console.log("paid dishes : ",paid_dishes)

                    } catch (err) {
                        console.log("Eror - ", err)
                        res.status(400).json({msg: "Some error occured"})
                    }

                })

                const order_delete = await pool.query("DELETE FROM ordered_dishes WHERE restaurant_id=$1 and table_no=$2", [data.restaurant_id, data.table_no])

                res.status(200).json({msg: "Updated status successfully!"});

            } catch (err) {
                console.error(err);
                res.json({msg : "Error"});
            }
     }      
})
            
})


function ISODateTimeString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate()) +' '
          + pad(d.getUTCHours())+':'
          + pad(d.getUTCMinutes())+':'
          + pad(d.getUTCSeconds())}


async function checkavailability(dish_id){
        let index;
        //First check availability of all dishes
            
            for(index=0;index<dish_id.length;index++)
            {
                const results = await pool.query('SELECT STATUS FROM MENU WHERE DISH_ID=$1',[dish_id[index]]);
                // console.log(results);
                // change status according to bool value in final
                if(!results.rows[0] || !results.rows.length || !results.rows[0].status)
                {
                    return false;
                }
            }
            return true;
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