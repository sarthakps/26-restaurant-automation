const express = require("express")

const bodyParser = require('body-parser');
const router = express.Router();
const fs = require('fs');

const cors = require('cors')
const pool = require('../db')
const bcrypt = require('bcryptjs')
//importing jwt
const jwt=require('jsonwebtoken')

//const path = require('path')
//const app = express()


// invalid password error
//solution: changed query select * from manager ===> select * from users
// SOLVED
router.post('/login', async(req,res) => {
    try {
        const data = req.body;
        // check if a user with the given email ID exists in the database
        // if not, return error
        const login = await pool.query("SELECT * FROM manager WHERE email_id=$1", [data.email_id]);
        
        if(login.rows.length == 0){
            return res.status(400).json({
                error: 1,
                msg: "A user with this email ID does not exist!"
            });
        }

        else{
            // validate password
                bcrypt.compare(data.password, login.rows[0].password, async function(err, result2) {
                    
                     // handle bcrypt compare error
                    if (result2==false) { 
                        res.status(400).json({'msg':'Invalid password!'})
                    }
                    const result = await pool.query("SELECT * FROM manager WHERE email_id=$1", [data.email_id]);
                    
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
                                    //usertype_id=4 for manager
                                    const newUser = await pool.query(
                                    "INSERT INTO fcm_jwt(email_id,fcm_token,last_jwt,restaurant_id,usertype_id) VALUES ($1, $2, $3, $4,4)",
                                    [data.email_id, fcmToken, token,data.restaurant_id]);
                                    
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
                    
                });
                
                    
                 
            }
        
        } catch (err) {
            console.log(err.message);
        }
})

router.post('/viewmenu',verifyToken, async(req, res) => {
    
    //INITIALIZE JWT VERIFICATION
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){

            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            const data = req.body;
            const viewmenu =  await pool.query("SELECT dish_id, dish_name, description, dish_price, status, jain_availability, veg FROM menu WHERE restaurant_id=$1", [data.restaurant_id]);
            
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


// ALL USERS
router.post('/allusers',verifyToken, async(req, res) => {
    
    //INITIALIZE JWT VERIFICATION
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){

            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            const data = req.body;
            const viewUsers =  await pool.query("SELECT user_id, user_name, user_image, usertype_id FROM users WHERE restaurant_id=$1", [data.restaurant_id]);
            
            if(!viewUsers.rows[0] && !viewUsers.rows.length){
                return res.status(400).json({
                    error:1,
                    msg: "No menu item available for this restaurant"
                });
              
            }
            else{
                return res.json({total_results: viewUsers.rowCount, users: viewUsers.rows});
            }    
            //console.log("total_results: " + viewmenu.rowCount, "dishes: " + viewmenu.rows);
        }
    });   
    
})

// get the list of all uses for marking attendance
router.post('/viewusers',verifyToken, async(req, res) => {
    
    //INITIALIZE JWT VERIFICATION
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){

            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            //WHEN USER HAS VALID JWT TOKEN
            const data = req.body;
            const todate = new Date();
            const todate_iso = ISODateString(todate)
            //console.log(todate_iso);

            const markedusers = await pool.query("SELECT user_id, time_stamp from attendance")
            //console.log("marke users", markedusers)
            const result = matchDate(markedusers.rows); // user ids that have been marked for today's attendance
           console.log(result.size);
           //console.log(typeof result);
           const viewusers =  await pool.query("SELECT user_image, user_id, user_name, usertype_id FROM users WHERE restaurant_id=$1", [data.restaurant_id]);

            if(result.size == 0){
                
                if(!viewusers.rows[0] && !viewusers.rows.length){
                    return res.status(400).json({
                        error:1,
                        msg: "No user available for this restaurant"
                    });
                  
                }
                else{
                    return res.json({users: viewusers.rows});
                }
            }
           
            
            else if(result.size != 0){
                
                const viewusers2 = viewusers.rows; // all of the users
                //console.log(viewusers2);
    
                final_ans = [];
    
                viewusers2.forEach((element, index, array) => {
                    var cnt=0;
                    result.forEach((value) => {
                        //console.log("element.user_id and value",element.user_id, value);
                        if(element.user_id != value){
                            cnt++;
                        }
                    })
                    if(cnt == result.size){
                        final_ans.push({
                            "user_image": element.user_image,
                            "user_id": element.user_id,
                            "user_name": element.user_name,
                            "usertype_id": element.usertype_id
                        })
                    }
                })
                
               //console.log(final_ans)
    
                if(!final_ans && !final_ans){
                    return res.status(400).json({
                        error:1,
                        msg: "No user available for this restaurant"
                    });
                  
                }
                else{
                    return res.json({users: final_ans});
                }  
            }
            
         }
    });   
    
})



// works
router.post('/revenue', async(req, res) => {

    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){

            console.log(err)
            //INVALID TOKEN/TIMEOUT 
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            
                    try {
                        const data = req.body;

                        const final = await pool.query("SELECT sum(final_bill) as final_bill, split_part(time_stamp, ' ', 1) as time_stamp from revenue where restaurant_id=$1 and split_part(time_stamp, ' ', 1) >= $2 and split_part(time_stamp, ' ', 1) <= $3 group by split_part(time_stamp, ' ', 1)", [data.restaurant_id, data.date1N, data.date2N]);
                        var myArr = final.rows;

                        if(!myArr[0] && !myArr.length){
                            res.status(400).json({
                                error:1,
                                msg: "some error"
                            });
                        } else {
                            res.json({"ans": myArr});
                        }

                    } catch (err) {
                        console.log(err.message)
                    }
            }      
})


// works
router.post('/register-user',async(req,res) => {  

    try {
        const data = req.body;

        // check if one or more mandatory field is empty
        // return error if true
        if(!data.restaurant_id || !data.user_image || !data.usertype_id || !data.user_name || !data.email_id || !data.contact_no || !data.password){
            return res.status(400).json({
                error: 1,
                msg: "One or more required field is empty!"
            }); 
        } 

        // check if the email ID is already registered or not
        // return error if true
        const user = await pool.query("SELECT email_id from users WHERE email_id=$1", [data.email_id]);
        if(user.rows.length){
            return res.status(400).json({
                error: 1,
                msg: "This email ID is already registered!"
            });
        }
        
        // check if maximum allowed registrations corresponding to user's role for the given restaurant is reached or not
        // if maximum users of given role are already registered, return error
        // const userRole = await pool.query("SELECT user_role from usertype WHERE usertype_id= $1", data.usertype_id);
        const subscriptiontypeId = await pool.query("SELECT subscription_type_id FROM restaurant WHERE restaurant_id = $1", [data.restaurant_id]);  
        const usertypeid=data.usertype_id; 
        const subscriptionTypeId=subscriptiontypeId.rows[0]['subscription_type_id']; 
        
        // console.log(typeof(usertypeid),typeof(data.restaurant_id))
        switch(usertypeid){
            // if user role == waiter
            case 1:
                const maxwaiters = await pool.query("SELECT max_waiter FROM subscription WHERE subscription_type_id = $1", [subscriptionTypeId]);
                const maxWaiters = maxwaiters.rows[0]['max_waiter']
                
                const currentwaiters = await pool.query("SELECT count(*) from users WHERE restaurant_id = $1 and usertype_id = $2", [data.restaurant_id, usertypeid]);
                const currentWaiters = parseInt(currentwaiters.rows[0]['count'])
                
                if(currentWaiters >= maxWaiters){
                    return res.status(400).json({
                        error: 1,
                        msg: "Maximum number of allowed waiters are already registered! Your plan only allows a maximum of " + maxWaiters.toString() + " waiters!"
                    });
                }
                break;

            // if user role == inventory manager
            case 2:
                const maxinventoryManager = await pool.query("SELECT max_inv_manager FROM subscription WHERE subscription_type_id = $1", [subscriptionTypeId]);
                const maxInventoryManager = maxinventoryManager.rows[0]['max_inv_manager']
                const currentinventoryManager = await pool.query("SELECT count(*) from users WHERE restaurant_id = $1 and usertype_id = $2", [data.restaurant_id, usertypeid]);
                const currentInventoryManager = parseInt(currentinventoryManager.rows[0]['count'])
                if(currentInventoryManager >= maxInventoryManager){
                    return res.status(400).json({
                        error: 1,
                        msg: "Maximum number of allowed inventory managers are already registered! Your plan only allows a maximum of " + maxWaiters.toString() + " inventory managers!"
                    });
                }
                break;

            // if user role == kitchen personnel
            case 3:
                const maxkitchenPersonnel = await pool.query("SELECT max_kitchen_personnel FROM subscription WHERE subscription_type_id = $1",[ subscriptionTypeId]);
                const maxKitchenPersonnel = maxkitchenPersonnel.rows[0]['max_kitchen_personnel']
                const currentkitchenPersonnel = await pool.query("SELECT count(*) from users WHERE restaurant_id = $1 and usertype_id = $2", [data.restaurant_id, usertypeid]);
                const currentKitchenPersonnel = parseInt(currentkitchenPersonnel.rows[0]['count'])
                if(currentKitchenPersonnel >= maxKitchenPersonnel){
                    return res.status(400).json({
                        error: 1,
                        msg: "Maximum number of allowed kitchen personnel are already registered! Your plan only allows a maximum of " + maxWaiters.toString() + " kitchen personnel!"
                    });
                }
                break;
        }

        // generating hashed password (salt rounds = 12)
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        
        // inserting new user into the database
        const newUser = await pool.query(
        "INSERT INTO users(restaurant_id,user_image,usertype_id,user_name,email_id,contact_no,contact_no_optional,password) VALUES ($1, $2, $3,$4, $5,$6,$7,$8)",
        [data.restaurant_id, data.user_image, usertypeid, data.user_name, data.email_id, data.contact_no, data.contact_no2, hashedPassword]);

        return res.status(200).json({
            msg: "Registered successfully!"
        });
    } catch (err) {
        console.log("ERRRRR", err.message)
    }
})


// works
router.post('/mark_attendance',async(req,res) => {
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){

            //INVALID TOKEN/TIMEOUT 
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
    
                try {
                    const data = req.body;
                    if(!data.restaurant_id || !data.user_id){
                        
                        res.status(400).json({
                            error:1,
                            msg: "Provide all values"   
                        }); 

                    } else { 
                    
                        var date = new Date();
                        var currentISODate = ISODateTimeString(date);
                        
                        const username = await pool.query("SELECT user_name from users WHERE user_id=$1", [data.user_id])
                        const username2 = username.rows[0].user_name;
                        console.log(currentISODate)
                        const newUser = await pool.query(
                        "INSERT INTO attendance(restaurant_id,user_id, user_name, time_stamp,attendance_status) VALUES ($1, $2, $3, $4, $5)",
                            [data.restaurant_id,data.user_id, username2, currentISODate ,true]);
                            
                        res.status(200).json({msg:"Attendance marked" });
                    }
                } catch (err) {
                    console.log(err.message)
                }
            }
})


// works
// ATTENDANCE
router.post('/view_attendance', async (req,res)=>{
jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){

            //INVALID TOKEN/TIMEOUT 
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{

    const data = req.body;
    
                try {

                    if(!req.body.restaurant_id)
                    {
                        res.status(400).json({
                            error:1,
                            msg: "Provide a restaurant ID"   
                        }); 
                    }
                    else{
                        const results = await pool.query("SELECT user_id,user_name,attendance_status, split_part(time_stamp, ' ', 1) as time_stamp FROM ATTENDANCE WHERE restaurant_id=$1 and split_part(time_stamp, ' ', 1) >= $2 and split_part(time_stamp, ' ', 1) <= $3", [data.restaurant_id, data.date1N, data.date2N]);
                        
                        console.log(results.rows[0]);
                        if(!results.rows[0] && !results.rows.length)
                        {
                            res.status(400).json({
                                error:1,
                                msg: "No attendance record found"   
                            }); 
                        }
                        else{
                            res.status(200).json(results.rows);
                        }
                    }
                    
                    
                } 
                catch (err) {
                    console.log(err.message)
                }
            }
})

// FEEDBACK 
router.post('/feedback',async (req,res)=>{

    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){

            //INVALID TOKEN/TIMEOUT
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
    
                try{
                    const data = req.body;
                    const results = await pool.query(`select FEEDBACK_ID, bill_id ,question_id, score from feedback WHERE restaurant_id=$1 group by (feedback_id, bill_id)`, [data.restaurant_id]);
                    const results2 = results.rows;
                    //console.log("results2 : ", results2)

                    const questions = await pool.query("SELECT question_id, question FROM feedback_questions")
                    const questions2 = questions.rows;
                    //console.log("questions2 : ", questions2)


                    var final_ans = [];
                    var total_feed = 0;
                    var cnt = 0;
                        results2.forEach((element, index, array) => {
                            var feedback_id = element.feedback_id;
                            var bill_id = element.bill_id;
                            var question_id = element.question_id;
                            var score = element.score;

                            questions2.forEach((element, index, array) => {
                                if(element.question_id == question_id){
                                    final_ans.push({
                                        "feedback_id" : feedback_id,
                                        "bill_id": bill_id,
                                        "question": element.question,
                                        "score": score
                                    })
                                    total_feed += score;
                                    cnt += 1;
                                }
                            })     
                                
                        });
                        total_feed = total_feed/cnt;

                    if(!final_ans[0] && !final_ans.length)
                    {
                        res.status(400).json({
                            error:1,
                            msg: "No feedback record found"   
                        }); 
                    }
                    else{
                        res.status(200).json({final_ans: final_ans, "avg_feed": total_feed});
                    }
                    
                }
                catch(err){
                    console.log(err.message);
                }
            }       
});



router.post('/avg_feedback',async (req,res)=>{

    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){

            //INVALID TOKEN/TIMEOUT
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
    
                try{
                    const data = req.body;
                    const count = await pool.query("SELECT count(*) FROM feedback WHERE restaurant_id=$1", [data.restaurant_id])
                    const results = await pool.query(`select sum(score),question_id from feedback WHERE restaurant_id=$1 group by question_id`, [data.restaurant_id]);
                    const results2 = results.rows;
                    console.log("results2 : ", results2)
                    console.log("COUNT : ", count.rows[0].count)

                    const questions = await pool.query("SELECT question_id, question FROM feedback_questions")
                    const questions2 = questions.rows;
                    //console.log("questions2 : ", questions2)


                    var final_ans = [];
                    // var avg1, avg2, avg3 = 0;
                    var cnt = 0;
                        results2.forEach((element, index, array) => {
                            var question_id = element.question_id;
                            var score = element.sum
                        
                            questions2.forEach((element, index, array) => {
                                if(element.question_id == question_id){
                                    final_ans.push({
                                        "name": element.question,
                                        "score": score/count.rows[0].count
                                    })
                                }
                            })     
                                
                        });
                       

                    if(!final_ans[0] && !final_ans.length)
                    {
                        res.status(400).json({
                            error:1,
                            msg: "No feedback record found"   
                        }); 
                    }
                    else{
                        res.status(200).json(final_ans);
                    }
                    
                }
                catch(err){
                    console.log(err.message);
                }
            }       
});



// delete stff member : requires restaurant_id and user_id
router.post('/delete_staff', async(req, res) => {
    try{
        const data = req.body;
        // Check for empty field
        if(!data.user_id || !data.restaurant_id)
        {
            return res.status(400).json({
                error: 1,
                msg: "One or more required field is empty!"
            });
        }
        else
        {
            //Get email_id from user_id
            const EmailOfUser = await pool.query("SELECT email_id FROM users WHERE restaurant_id=$1 and user_id=$2", [data.restaurant_id,data.user_id]);
            if(!EmailOfUser.rows[0] && !EmailOfUser.rows.length && !EmailOfUser.rows[0].email_id)
            {
                return res.status(400).json({
                    error:1,
                    msg: "A user with given user id does not exists for this restaurant"
                });
            }
            else{
                // console.log(EmailOfUser.rows[0].email_id);
                // Remove entry from FCM_JWT
                const isLoggedIn = await pool.query("DELETE FROM fcm_jwt WHERE email_id=$1", [EmailOfUser.rows[0].email_id]);
                // Remove entry from Attendance table
                const result1 = await pool.query("DELETE FROM attendance WHERE restaurant_id=$1 and user_id=$2", [data.restaurant_id,data.user_id]);
                // Remove entry from Users table
                const result2 = await pool.query("DELETE FROM users WHERE restaurant_id=$1 and user_id=$2", [data.restaurant_id,data.user_id]);
                return res.status(200).json({
                    msg: "Deleted successfully!"
                });
            }
        }

    }catch(err)
    {
        console.log(err.message);
    }
});

const {PythonShell} =require('python-shell');
// Required at least 30 entries in database for forecasting
// Input: restaurant_id and days_forecast(no. of days to forecast)
// Output: start_date, end_date, resposnse
// start_date: date corresponding to first entry of response
// end_date: date corresponding to last entry of response
// response: no of visitors of a restaurant on each day from statr_date to end_date
// Here, function outputs past 30 days' visitors and expected visitors in next "days_predict"
router.post('/rush_hour',verifyToken, async (req, res) => {

    //INITIALIZE JWT VERIFICATION
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){

            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
            
                    try {
                        const data = req.body;
                        if(!data.restaurant_id || !data.days_predict)
                        {
                            res.status(400).json({
                                error:1,
                                msg: "Provide a restaurant ID"   
                            }); 
                        }
                        else
                        {
                            
                            
                            const SaveCsvTo = __dirname+'\\datafile.csv';
                            // console.log(SaveCsvTo);
                            const final = await pool.query(`copy (SELECT no_of_occupants,time_stamp FROM revenue WHERE restaurant_id=${data.restaurant_id}) to '${SaveCsvTo}' with csv`);
                            const resForlastDate = await pool.query('SELECT DATE(time_stamp) FROM revenue WHERE restaurant_id=$1 order by DATE(time_stamp) DESC  limit 1',[data.restaurant_id]);
                            const noOfEntries = await pool.query('select COUNT(DISTINCT time_stamp) FROM revenue WHERE restaurant_id=$1',[data.restaurant_id]);
                            const checkdate = resForlastDate.rows[0].date;
                            const startDate = new Date();
                            startDate.setDate(checkdate.getDate() - 30);
                            const endDate = new Date();
                            endDate.setDate(checkdate.getDate() + 7);

                            
                            if(!final || !noOfEntries || noOfEntries.rows[0].count<30){
                                res.status(400).json({
                                    error:1,
                                    msg: "error"
                                });
                            } else {
                            
                                console.log("File saved");
                                let options = {
                                    mode: 'text',
                                    pythonOptions: ['-u'], // get print results in real-time
                                    scriptPath: __dirname, //If you are having python_test.py script in same folder, then it's optional.
                                    args: [__dirname+'\\datafile.csv',__dirname+'\\testmodel.pkl',data.days_predict] //An argument which can be accessed in the script using sys.argv[1]
                                };
                                var response = [];
                                PythonShell.run('test.py', options, function (error, result){
                                    if (error) 
                                    {
                                        // In case of failure in python script print error message and return 400 response
                                        console.log(error.message);
                                        res.status(400).json({
                                            err:1,
                                            msg:"Error occured"
                                        });
                                        // throw err;
                                    }
                                    else{
                                        // result is an array consisting of messages collected 
                                        //during execution of script.
                                        // console.log(result);
                                        result.forEach((element,index,arr)=>{
                                            response.push(parseInt(element));
                                        })
                                        
                                        // res.json({"reply":result.toString()});
                                    }
                                    if(!response || !response.length)
                                    {
                                        res.status(400).json({
                                            error:1,
                                            msg: "some error"
                                        });
                                        
                                    }
                                    else{
                                        res.status(200).json({
                                            "start_date":ISOISTDateTimeString(startDate),
                                            "end_date":ISOISTDateTimeString(endDate),
                                            "reply":response
                                            });
                                    }
                                });
                                
                            }
                        }

                    } catch (err) {
                        console.log(err.message)
                    }
            }      
    });
});
// Train model
// To train model. It will just return success message generated from train.py
router.post('/rush_hour_train',verifyToken, async (req, res) => {

    //INITIALIZE JWT VERIFICATION
    jwt.verify(req.token, 'secretkey',async (err,authData)=>{
        if(err){

            //INVALID TOKEN/TIMEOUT so delete the entry from databse 
            // const deleted_info = await pool.query("DELETE FROM fcm_jwt WHERE EMAIL_ID=$1 ",[req.body.email_id])
            res.status(400).json({msg: "Session expired. Login again"})
            
        }else{
                    try {
                        const data = req.body;
                        if(!data.restaurant_id)
                        {
                            res.status(400).json({
                                error:1,
                                msg: "Provide a restaurant ID"   
                            }); 
                        }
                        else
                        {
                            
                            const SaveCsvTo = __dirname+'\\datafile.csv';
                            // console.log(SaveCsvTo);
                            const final = await pool.query(`copy (SELECT no_of_occupants,time_stamp FROM revenue WHERE restaurant_id=${data.restaurant_id}) to '${SaveCsvTo}' with csv`);
                            
                            
                            if(!final){
                                res.status(400).json({
                                    error:1,
                                    msg: "error"
                                });
                            } else {
                            
                                console.log("File saved");
                                let options = {
                                    mode: 'text',
                                    pythonOptions: ['-u'], // get print results in real-time
                                    scriptPath: __dirname, //If you are having python_test.py script in same folder, then it's optional.
                                    args: [__dirname+'\\datafile.csv',__dirname+'\\testmodel.pkl'] //An argument which can be accessed in the script using sys.argv[1]
                                };
                                var response = [];
                                PythonShell.run('train.py', options, function (error, result){
                                    if (error) 
                                    {   
                                        // In case of failure in python script print error message and return 400 response
                                        console.log(error.message);
                                        res.status(400).json({
                                            err:1,
                                            msg:"Error occured"
                                        });
                                        // throw err;
                                    }
                                    if(!result || !result.length)
                                    {
                                        res.status(400).json({
                                            error:1,
                                            msg: "some error"
                                        });
                                    }
                                    else{
                                        res.status(200).json({
                                            "reply":result[0]//"Model Trained.."
                                            });
                                    }
                                });
                            }
                        }
                    } catch (err) {
                        console.log(err.message)
                    }
            }      
    });
});


function matchDate(myArr){

    var response = new Set();
    var date = new Date();
    var currentISODate = ISODateString(date);
    myArr.forEach((element, index, array) => {
        var date2 = element.time_stamp.split(" ");

        if(date2[0] == currentISODate){
            // response.push({
            //     "user_id" : element.user_id
            // })
            // response['user_id'] = element.user_id;
            response.add(element.user_id)
        }
    });

    return response;
}


function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate())}

function ISODateTimeString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate()) +' '
          + pad(d.getUTCHours())+':'
          + pad(d.getUTCMinutes())+':'
          + pad(d.getUTCSeconds())}
  

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