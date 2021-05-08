import React, {Fragment, useState, useRef} from "react";
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom";
import BackupIcon from '@material-ui/icons/Backup';
import { Button,IconButton ,Avatar} from '@material-ui/core';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import axios from 'axios';
import Swal from "sweetalert2";
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { green, lightGreen, purple,blue } from '@material-ui/core/colors';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { deepOrange, deepPurple , red } from '@material-ui/core/colors';
import HomeIcon from '@material-ui/icons/Home';
import SendIcon from '@material-ui/icons/Send';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Header from './Header'
import Footer from './Footer'
import revenueimg from './revenueimg.jpg'

const theme = createMuiTheme({
    palette: {
      secondary: green,
    },
  });

const useStyles = makeStyles((theme) => ({
    submit123: {
      margin: theme.spacing(3, 0, 2),
    },
    formControl123: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
    
    purple123: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
    },
    paper123: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar123: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    root123: {
      height: '100vh',
    },
    image123: {
      backgroundRepeat: 'no-repeat',
      backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: "100%",
      height: "95vh",
    },
    form123: {
      width: '100%', 
      marginTop: theme.spacing(2),
    },
    orange123: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
      Red123: {
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
      },
    
  }));

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
    
    const divRef = useRef();


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

    const classes = useStyles();

    const user_image2 = localStorage.getItem("user_image")

    return (
      <body style={{background:"#F2F4F3"}}>


      <Header logout={"log out"} avatar={user_image} logoutpath={"/restaurantmanager/login"} homepath={"/restaurantmanager/reshome"} height={"65px"} color={"white"} color2={"#0A0908"}/> 
      
      
      <div className="row">

              <div className="container text-center" style={{marginTop: "100px", marginBottom: "100px", width:"40%"}}>
                          <h1 class="w3-jumbo" style={{textAlign: "center", marginTop: "0px", marginBottom: "50px", fontFamily: "Open Sans Condensed", fontSize: "100px !important", color: "#0a0908", filter: "brightness(100%)"}}>Register a User</h1>
                          
                          <h5 style={{fontFamily: "Rubik", color: "#a9927d", filter: "brightness(100%)"}}>Lorem  typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</h5>
                          
              </div>  

              

              <div className="container text-center" 
            style={{position: "relative",
            zIndex: "1",
            backgroundColor: "white",
            maxWidth: "40%",
            margin: "20px auto 20px ",
            marginTop: "50px",
            padding: "15px",
            textAlign: "center",
            boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24)"}} >
              
           
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
            <br />
            <br />
            <br />
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
            <form action="/action_page.php"  class="needs-validation" novalidate onSubmit={onSubmitProfile}>

            <FormControl className={classes.formControl123} style = {{float: "left", marginTop:"130px" }}>
                <InputLabel htmlFor="ucpi">User role</InputLabel>
                <Select native defaultValue="" id="grouped-native-select" aria-label="Default select example"
                
                onChange={(e) => {
                        const selectedField = e.target.value;
                        setUsertypeid(selectedField)
                    }}>
                <option aria-label="None" value="" />
                <optgroup label="Select User role">
                    <option value={1}>Waiter</option>
                    <option value={2}>Inventory Manager</option>
                    <option value={2}>Kitchen Personnel</option>
                </optgroup>
                </Select>
            </FormControl>

                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="ucpi"
                type="ucpi"
                label="Enter user name"
                name="ucpi"
                autoComplete="email"
                autoFocus
                required value = {user_name}
                 onChange={e => setUsername(e.target.value)}
                />
              
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="pswd"
                label="Enter Password"
                type="password"
                id="pwd"
                autoComplete="current-password"
                required value = {password} 
                onChange={e => setPassword(e.target.value)}
                />

                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="umail"
                type="email"
                label="Enter email ID"
                name="umail"
                autoComplete="email"
                autoFocus
                required value = {email_id}
                onChange={e => setEmailid(e.target.value)}
                />

                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="upno"
                type="upno"
                label="Enter contact no."
                name="upno"
                autoFocus
                required value = {contact_no}
                onChange={e => setContactno(e.target.value)}
                />

                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="upno2"
                type="upno2"
                label="Enter optional contact no."
                name="upno2"
                autoFocus
                required value = {contact_no2}
                onChange={e => setContactno2(e.target.value)}
                />

                
            <Box textAlign='center'>
            <br />
            <br />
                <Button
                type="submit"
                //fullWidth
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                className={classes.submit123}
                style={{width:"30%"}}
                >
                Submit
                </Button>
            </Box>

            </form>
            </div>
            <br/>
            <br/>     
        </div>      
      </div>

      
      <div style={{background:"#F2F4F3"}}>
        <br/>
        <br/>
        <br/>
        <br/>
         <div ref={divRef} >
         <Footer />
        </div>
        </div>
        </body>
    )
}

export default RegisterUser

