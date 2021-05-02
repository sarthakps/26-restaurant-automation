import React, {Fragment, useState} from "react";
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom";
import BackupIcon from '@material-ui/icons/Backup';
import { Button,IconButton ,Avatar} from '@material-ui/core';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import axios from 'axios';
import Swal from "sweetalert2";
// import 'bootstrap';
// import 'bootstrap-select-dropdown';

const RegisterUser = () => {

    const restaurant_id = localStorage.getItem("resID");
    //const [restaurant_id, setRestaurantid] = useState();
    const [user_image, setUserimage] = useState("");
    const [usertype_id, setUsertypeid] = useState();
    const [user_name, setUsername] = useState("");
    const [email_id, setEmailid] = useState("");
    const [contact_no, setContactno] = useState("");
    const [contact_no2, setContactno2] = useState("");
    const [password, setPassword] = useState("");


    const onSubmitProfile = async(e) => {
        e.preventDefault();
        try {
            const body = {restaurant_id, usertype_id, user_name, email_id, contact_no, contact_no2, password, user_image};
            //console.log("BODY : ", body);
            const head = {
              headers:  {"Content-Type": "application/json"}};
            const resSubmit = await axios.post("/restaurantmanager/register-user", JSON.stringify(body),head)
                //body: JSON.stringify(body.then(res => {

               // return res.json()  
           
           //console.log("Heelo",resSubmit.status);
            if(resSubmit.status === 200) {
                //console.log("Step2");

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your profile has been created!',
                showConfirmButton: false,
                timer: 1500
            })
            window.location.reload();

        
        } else {
            Swal.fire("Sorry!", "Something went wrong :/", "error")

        }
            //window.location = "/";
     } catch (err) {
            console.error(err.message)
        }
    }


    const setProfilePhoto = (e) =>{
        if(e.target.files[0]){
            var reader = new FileReader();
            reader.addEventListener('load',()=>{
               // localStorage.setItem('profile_photo',reader.result);
               setUserimage(reader.result)
            });
            reader.readAsDataURL(e.target.files[0]);
        }
       /* else{
        setImageurl('/static/images/avatar/1.jpg')
        }*/
    }

   
    return (
        <div className="container text-center">
            <br />
            <h1>Register User Page</h1>
            <br />

            <div className="container">

        <div className = "Profile_Photo" style = {{display : "flex", flexDirection : 'column-reverse', flex :"1", float: "right", marginBottom : "40px", alignItems :"center"}}>
            <div className = "photo_title" > 
            <br />
            <Button variant="contained" classname = "fileInput" component="label" color="primary" startIcon = {<AddAPhotoIcon/>} > Add Profile Photo                    <input
                    accept="image/*"
                    type="file"
                    style={{ display: "none" }}
                    onChange = {setProfilePhoto}/>

                    </Button>
                </div>
           <label for = "Avatar">
            <Avatar 
                alt = "USER"
                src={user_image} 
                style={{
                    width: "80px",
                    height: "80px",
                }} 
                />
            </label>
            </div>

            
            <br />
            <form action="/action_page.php"  class="needs-validation" novalidate onSubmit={onSubmitProfile}>
            
                <div class="form-group">
                <label for="ucpi" style = {{float: "left", marginTop:"130px" }}>User role : </label>
                    <select class="form-select" aria-label="Default select example" onChange={(e) => {
                        const selectedField = e.target.value;
                        setUsertypeid(selectedField)
                    }}>
                        <option selected>Select User role</option>
                        <option value="1">Waiter</option>
                        <option value="2">Inventory Manager</option>
                        <option value="3">Kitchen Personnel</option>
                    </select>
                    
                </div>

                <br />
                <div class="form-group">
                    <label for="ucpi" style = {{float: "left" }}>Name : </label>
                    <input type="text" class="form-control" id="ucpi" placeholder="Enter user name" name="ucpi" required value = {user_name} onChange={e => setUsername(e.target.value)} />
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>
                <br />
                <div class="form-group">
                    <label for="pwd" style = {{float: "left" }}>Password:</label>
                    <input type="password" class="form-control" id="pwd" placeholder="Enter password" name="pswd" required value = {password} onChange={e => setPassword(e.target.value)}/>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>
                <br />
                <div class="form-group">
                    <label for="umail" style = {{float: "left" }}>Email : </label>
                    <input type="text" class="form-control" id="umail" placeholder="Enter email ID" name="umail" required value = {email_id} onChange={e => setEmailid(e.target.value)}/>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>
                <br />
                <div class="form-group ">
                    <label for="upno" style = {{float: "left" }}>Contact number : </label>
                    <input type="text" class="form-control" id="upno" placeholder="Enter contact no." name="upno" required value = {contact_no} onChange={e => setContactno(e.target.value)}/>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>
                <br />
                <div class="form-group">
                    <label for="upno2" style = {{float: "left" }}>Contact number : (optional)</label>
                    <input type="text" class="form-control" id="upno2" placeholder="Enter optional contact no." name="upno2" required value = {contact_no2} onChange={e => setContactno2(e.target.value)}/>
                    <div class="valid-feedback">Valid.</div>
                    <div class="invalid-feedback">Please fill out this field.</div>
                </div>
                <br />
                <br/>
                
                <div >
                <button className="btn btn-success">Submit</button>
                </div>

            </form>
            </div>

            <br />
            <br />
            <br />
            <Link to="/restaurantmanager/reshome"><button className="btn btn-primary">Go to Home Page</button></Link>
            <br />
            <br />
        </div>
    )
}

export default RegisterUser

