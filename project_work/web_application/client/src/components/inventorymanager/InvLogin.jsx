import React,{Fragment, useState } from "react";
import {Link } from "react-router-dom";
import Swal from "sweetalert2";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Carousel from 'react-material-ui-carousel';
import { green } from '@material-ui/core/colors';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import HomeIcon from '@material-ui/icons/Home';
import i1 from './i1.jpg';
import i2 from './i2.jpg';
import i3 from './i3.jpg';

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
      marginTop: "30px"
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
}));
  
const ResLogin = (props) => {
  const [restaurant_id, setRestaurant_id] = useState("")
    const [email_id, setUid] = useState("")
    const [password, setPassword] = useState("")

    const onSubmitForm = async e => {
        e.preventDefault();
        //console.log("jay shree krishna");
        try {
            const body = {restaurant_id, email_id, password};
            //console.log("body:", body)

            var emailid = email_id;
            localStorage.setItem("emailID", emailid);
            var res_id = restaurant_id;
            localStorage.setItem("resID", res_id);

            // proxy
            const submitLogin = await fetch("/inventorymanager/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(res => {
                return res.json()
            })

            //console.log(submitLogin.msg);

            if(submitLogin.msg === "Successfully logged in!"){
                Swal.fire("Congrats!", submitLogin.msg, "success")
                props.history.push("/inventorymanager/invhome")

                console.log("IN InvLogin file: ", submitLogin);
                localStorage.setItem("user_image", submitLogin.user_image);

            }
            else{
                Swal.fire("Sorry!", submitLogin.msg, "error")
            }

        } catch (err) {
           // console.warn(xhr.responseText)
            console.log(err.message);
        }
    }
    const classes = useStyles();
    return (
  
  <Fragment>

    <div id="resloginpage">
      <Grid container component="main" className={classes.root123}>
        <CssBaseline />
          <Grid item xs={false} sm={4} md={7}  >
            <Carousel >
                  <div  >
                  <img src={i1}  className={classes.image123}/>
                  </div> 
                  <div >
                  <img src={i2} className={classes.image123}/>
                  </div> 
                  <div >
                  <img src={i3} className={classes.image123}/>
                  </div> 
            </Carousel>
          </Grid>
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square style={{height:"100%"}}>
            <h1 class="" style={{textAlign:"center"}}><strong>Inventory Manager</strong></h1>
            <div className={classes.paper123}>
              <Avatar className={classes.orange123}><LockOutlinedIcon /></Avatar>
              <Typography component="h2" variant="h5">LOGIN</Typography>

              <form  action="POST" onSubmit={onSubmitForm} className={classes.form123}>
              <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="id"
                  label="Restaurant ID"
                  name="id"
                  type="id"
                  autoFocus
                  required value = {restaurant_id}
                  onChange={e => setRestaurant_id(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    required value = {email_id}
                    onChange={e => setUid(e.target.value)}
                  />
                    
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    required value = {password} 
                    onChange={e => setPassword(e.target.value)}
                  />
                  <Box textAlign='center'>
                    <Button
                      type="submit"
                      //fullWidth
                      variant="contained"
                      color="primary"
                      endIcon={<LockOpenIcon />}
                      className={classes.submit123}
                      style={{width:"45%"}}
                    >
                      LOGIN
                    </Button>
                  </Box>           
                
              </form>

              <Box textAlign='center'>
                  <Link to={"/"}>
                    <ThemeProvider theme={theme}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        color="secondary"
                        startIcon={<HomeIcon />}
                        className={classes.submit123}
                      >
                        GO TO MAIN PAGE
                      </Button>
                    </ThemeProvider>
                  </Link>
              </Box>
            </div>
          </Grid>
      </Grid>
             
    </div>
  </Fragment>
  )

}

export default ResLogin;
