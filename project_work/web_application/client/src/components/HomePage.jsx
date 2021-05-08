import React,{Fragment, useState , useRef} from "react";
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom";
import Header from './restaurantmanager/Header'
import img1 from '../images/main8.jpg'
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Card from './restaurantmanager/Card'
import Footer from './restaurantmanager/Footer'
import Grid from '@material-ui/core/Grid';
// import ImageCard from './restaurantmanager/ImageCard'
import ScrollButton from 'react-scroll-button'
import Button from '@material-ui/core/Button'
import Carousel from 'react-material-ui-carousel';
import { deepPurple } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import PropTypes from 'prop-types';
import Slide from '@material-ui/core/Slide';
//#CBAF6D
import i1 from './h1.jpg'
import choose_role from './choose_role.jpg'
import about from './about4.jpg'
import waiter from './waiter.svg'
import manager from './manager3.svg'
import chef from './chef.svg'
import inv from './inv.svg'
import sub1 from './sub1.jpg'
import sub2 from './sub2.jpg'
import sub3 from './sub3.jpg'
import sample from './sample5.jfif'

import DoneAllRoundedIcon from '@material-ui/icons/DoneAllRounded';


// import { ParallaxProvider, Parallax  } from 'react-scroll-parallax';

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
      // backgroundColor: deepPurple[500],
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
    root: {
      flexGrow: 1,
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    image1: {
      backgroundRepeat: 'no-repeat',
      backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: "550px",
      height: "560px",
    }
}));

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

const HomePage = () => {
    
    function handleScroll() {
        window.scroll({
          top: document.body.offsetHeight,
          left: 0, 
          behavior: 'smooth',
        });
      }

      const refAbout = useRef();
      const refRole = useRef();
      const refSub = useRef();
      const refTeam = useRef();
      const divRef = useRef();

      const classes = useStyles();

    return (
        <Fragment>
            <div className="mainpage" style={{backgroundColor: "white"}}>



                {/* <Header login={"login"} subscription={"subscription"} height={"62px"} color={"white"} color2={"black"} /> */}



                <React.Fragment>
      <CssBaseline />
      <HideOnScroll style={{color: "white"}}>
        <AppBar  style={{backgroundColor: "white", height:"62px"}}>
          <Toolbar>
          <Typography variant="h6" className={classes.title} style={{color: "black"}}>
            <img src={sample} style={{height: "50px", width: "180px", float: "left"}}/>
          </Typography>


            <div className="row">
                <Button
                    Button color="inherit" 
                    style={{color: "black"}}
                    onClick={() => {
                      refRole.current.scrollIntoView({ behavior: "smooth" });
                    }}
                >Login</Button>

                <Button
                    Button color="inherit" 
                    style={{color: "black"}}
                    onClick={() => {
                      refAbout.current.scrollIntoView({ behavior: "smooth" });
                    }}
                >About us</Button>

                <Button
                    Button color="inherit" 
                    style={{color: "black"}}
                    onClick={() => {
                      refSub.current.scrollIntoView({ behavior: "smooth" });
                    }}
                >Subscription</Button>

                <Button
                    Button color="inherit" 
                    style={{color: "black"}}
                    onClick={() => {
                      refTeam.current.scrollIntoView({ behavior: "smooth" });
                    }}
                >Team</Button>
                </div>

               
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Container>
      </Container>
    </React.Fragment>
                
                
                <div className="row" style={{height: "650px", backgroundColor: "#0a0908", marginTop: "0px", paddingTop: "0px"}}>

          <div style={{width: "100%", height: "2px", marginTop:"0px", paddingTop:"0px"}}>
                  <img className="darkened-image" src={i1} style={{width: "100%", height: "670px", background:"no repeat center fixed", backgroundSize: "cover"}} />
                  </div>
              

              <div class="w3-container w3-tangerine">
                  <h1 class="w3-jumbo_three" style={{textAlign: "center", marginTop: "-250px", fontFamily: "Open Sans Condensed", fontSize: "100px !important", color: "white"}}>Restaurant Automation</h1>
                  <h3 style={{textAlign: "center", marginTop: "30px", fontFamily: "Open Sans Condensed", fontSize: "100px !important", color: "#f2f4f3", filter: "brightness(90%)"}}>Convenience is what we believe in 
                  </h3>
              </div>
                       
          </div>
          
       <div ref={refRole} className="row" style={{textAlign: "right", marginRight: "0px", marginTop:"50px", marginLeft: "0px", backgroundColor: "white", paddingBottom : "100px", marginBottom:"0px"}}>

       <img src={choose_role} style={{width: "470px", height: "490px", marginTop: "100px", marginLeft: "130px"}}/>

               
                          
                    
                      <div style={{ paddingRight: "100px", marginLeft: "200px", marginTop: "100px", width: "33%"}}> 

                      <div className="row">
                        <h2 style={{color: "black",marginRight: "0px",fontFamily: "proxima-nova", letterSpacing: "-.03em", lineHeight: "1.3", fontWeight: "400", fontSize: "27px"}}>Choose a role : </h2> 

                            {/* <h5 style={{fontFamily: "Rubik", color: "#a9927d", filter: "brightness(100%)"}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an .</h5> */}
                      
                        </div>
                        <br />
                        <br />

                        <div className="container text-center">
                          <Link to="/restaurantmanager/login"><button type="button" class="btn btn-outline-dark" style={{letterSpacing: "0.24rem"}}>Restaurant Manager</button></Link>
                          <br />
                          <br />
                          <Link to="/inventorymanager/login"><button type="button" class="btn btn-outline-dark">Inventory Manager</button></Link>
                        <br />
                        <br />
                        <Link to="/kitchenpersonnel/login"><button type="button" class="btn btn-outline-dark">Kitchen Personnel</button></Link>
                        </div>
                        </div>
                    </div>
                

                <div style={{height: "850px", backgroundColor:"white", marginBottom:"0px", paddingTop:"0px"}}>
            
                    <div ref={refAbout}>


                    <div style={{width: "100%", height: "2px", marginTop:"0px", paddingTop:"0px"}}>
                      <img className="darkened-image" src={about} style={{width: "100%", height: "850px", background:"no repeat center fixed", backgroundSize: "cover", filter: "brightness(90%)"}} />
                      </div>
                  

                  <div className="container" style={{width: "30%", marginLeft: "850px", paddingTop: "80px"}}>
                    <h1 className="w3-jumbo" style={{ marginTop:"100px", fontFamily: "Open Sans Condensed", color: "white", filter: "brightness(100%)"}}>About Us</h1>
                      <p className="w3-jumbo_one" style={{ marginTop: "80px", fontFamily: "Open Sans Condensed", fontSize: "2.5rem !important", color: "white", filter: "brightness(100%)"}}>From automating the mundane task of placing an order to organising business related statistics, we’ve got you covered. <br /> With four different profile accesses for Manager, Waiter, Kitchen personnel and Inventory manager, our software helps increase the efficiency of your space.</p>

                      <div className="row" style={{marginTop:"40px"}}>
                      <div style={{filter: "brightness(100%)", marginRight:"40px"}}>
                          <img src={manager} style={{height:"63px", width:"57px"}} />
                        </div>
                      <div style={{filter: "brightness(100%)", marginRight:"30px"}}>
                          <img src={waiter} style={{height:"60px", width:"60px"}} />
                        </div>
                        <div style={{filter: "brightness(100%)", marginRight:"25px"}}>
                          <img src={chef} style={{height:"60px", width:"60px"}} />
                        </div>
                        <div style={{filter: "brightness(100%)", marginRight:"10px"}}>
                          <img src={inv} style={{height:"60px", width:"60px"}} />
                        </div>

                      </div>

                      <p className="w3-jumbo_one" style={{ marginTop: "30px", fontFamily: "Open Sans Condensed", fontSize: "2.5rem !important", color: "white", filter: "brightness(100%)"}}>To know more, check out the subscriptions below. Join our family today!</p>

                  </div>
                    

                    </div>

                </div>       


                <div ref={refSub} style={{height: "1800px", backgroundColor:"white", marginBottom:"20px", paddingTop:"0px", marginTop: "0px"}}>

                    {/* subscription */}

                  <div className="row" style={{marginTop: "150px"}}>
                    <img src={sub1} style={{width: "470px", height: "490px", marginTop: "0px", marginLeft: "-10px", marginBottom: "0px"}}/>
                    <div className="contaier text-center">
                        <h1 className="w3-jumbo_two" style={{marginLeft: "150px", marginTop: "70px"}}>Silver Subscription</h1>
                        <h3 style={{marginLeft : "-170px", marginTop: "20px", fontSize:"20px"}}>5000 Rs.</h3>
                        <h3 style={{marginLeft : "70px", marginTop: "20px", fontSize:"20px"}}>This package includes services to:</h3>
                        <div className="row">
                            <DoneAllRoundedIcon style={{marginLeft: "-60px", marginTop: "15px"}}/>
                            <h3 style={{marginLeft: "10px", fontSize:"18px"}}>1 Restaurant Manager</h3>
                        </div>
                        <div className="row">
                            <DoneAllRoundedIcon style={{ marginLeft: "-120px",marginTop: "15px"}}/>
                            <h3 style={{marginLeft: "10px", fontSize:"18px"}}>Upto 3 waiters</h3>
                        </div>
                        <div className="row">
                            <DoneAllRoundedIcon style={{ marginLeft: "-70px",marginTop: "15px"}}/>
                            <h3 style={{marginLeft: "10px", fontSize:"18px"}}>1 Inventory Manager</h3>
                        </div>
                        <div className="row">
                            <DoneAllRoundedIcon style={{marginLeft: "-70px", marginTop: "15px"}}/>
                            <h3 style={{marginLeft: "10px", fontSize:"18px"}}>1 Kitchen Personnel</h3>
                        </div>
      
                    </div>
                   

                   </div>

                   <div className="row" style={{marginTop: "0px"}}>

                   <div className="contaier">
                        <h1 className="w3-jumbo_two" style={{marginRight: "150px", marginTop: "150px"}}>Gold Subscription</h1>
                        <h3 style={{marginLeft: "0px", marginTop: "20px", fontSize:"18px"}}>8000 Rs.</h3>
                        <h3 style={{marginLeft: "0px", marginTop: "20px", fontSize:"18px"}}>This package includes services to:</h3>
                        <div className="row">
                            <DoneAllRoundedIcon style={{marginLeft: "-360px", marginTop: "15px"}}/>
                            <h3 style={{marginLeft: "10px", fontSize:"18px"}}>1 Restaurant Manager</h3>
                        </div>
                        <div className="row">
                            <DoneAllRoundedIcon style={{marginLeft: "-410px", marginTop: "15px"}}/>
                            <h3 style={{marginLeft: "10px", fontSize:"18px"}}>Upto 10 waiters</h3>
                        </div>
                        <div className="row">
                            <DoneAllRoundedIcon style={{marginLeft: "-370px", marginTop: "15px"}}/>
                            <h3 style={{marginLeft: "10px", fontSize:"18px"}}>2 Inventory Manager</h3>
                        </div>
                        <div className="row">
                            <DoneAllRoundedIcon style={{marginLeft: "-370px", marginTop: "15px"}}/>
                            <h3 style={{marginLeft: "10px", fontSize:"18px"}}>1 Kitchen Personnel</h3>
                        </div>
      
                    </div>

                    <img src={sub2} style={{width: "470px", height: "490px", marginTop: "100px", marginLeft: "10px"}}/>
                  </div>

                  <div className="row" style={{marginTop: "100px"}}>
                    <img src={sub3} style={{width: "470px", height: "490px", marginTop: "0px", marginLeft: "-10px", marginBottom: "0px"}}/>
                    <div className="contaier">
                        <h1 className="w3-jumbo_two" style={{marginLeft: "150px", marginTop: "70px"}}>Platinum Subscription</h1>
                        <h3 style={{marginLeft: "150px", marginTop: "20px", fontSize:"18px"}}>10,000 Rs.</h3>
                        <h3 style={{marginLeft: "150px", marginTop: "20px", fontSize:"18px"}}>This package includes services to:</h3>
                        <div className="row">
                            <DoneAllRoundedIcon style={{marginLeft: "-130px", marginTop: "15px"}}/>
                            <h3 style={{marginLeft: "10px", fontSize:"18px"}}>1 Restaurant Manager</h3>
                        </div>
                        <div className="row">
                            <DoneAllRoundedIcon style={{marginLeft: "-180px", marginTop: "15px"}}/>
                            <h3 style={{marginLeft: "10px", fontSize:"18px"}}>Upto 10 waiters</h3>
                        </div>
                        <div className="row">
                            <DoneAllRoundedIcon style={{marginLeft: "-140px", marginTop: "15px"}}/>
                            <h3 style={{marginLeft: "10px", fontSize:"18px"}}>2 Inventory Manager</h3>
                        </div>
                        <div className="row">
                            <DoneAllRoundedIcon style={{marginLeft: "-145px", marginTop: "15px"}}/>
                            <h3 style={{marginLeft: "10px", fontSize:"18px"}}>1 Kitchen Personnel</h3>
                        </div>
                        <h3 style={{marginLeft: "150px", marginTop: "20px", fontSize:"18px"}}>24x7 Maintenance Support:</h3>
                    </div>
                   </div>

                  </div>

                  <div ref={refTeam} style={{height: "fit-content", backgroundColor:"#f2f4f3", marginBottom:"10px", paddingTop:"100px", marginTop: "0px", paddingBottom: "100px"}}>

                    <div className="container text-center" style={{marginBottom:"70px"}}>
                      <h1>Team Members</h1>
                    </div>

                  <div className="row" style={{ width: "100%", marginTop: "20px"}}>
                    <Card cardwidth={"25%"} backcolor={"white"} fontcolor={"#ffffff"} cardheight={"120px"} borderradius={2} h3={"Maulina Raina"} p={"201801186"} marginRight={"3%"} marginLeft={"5%"}/>
                    <Card cardwidth={"25%"} cardheight={"120px"} borderradius={2} h3={"Shreya Joshi"} p={"201801174"} marginRight={"3%"} marginLeft={"5%"}/>
                    <Card cardwidth={"25%"} cardheight={"120px"} borderradius={2} h3={"Aaditi Roy"} p={"201801103"} marginRight={"3%"} marginLeft={"5%"}/>
                  </div>

                  <div className="row" style={{ width: "100%", marginTop: "50px"}}>
                    <Card cardwidth={"25%"} backcolor={"white"} fontcolor={"#ffffff"} cardheight={"120px"} borderradius={2} h3={"Student name"} p={"Student ID"} marginRight={"3%"} marginLeft={"5%"}/>
                    <Card cardwidth={"25%"} cardheight={"120px"} borderradius={2} h3={"Student name"} p={"Student ID"} marginRight={"3%"} marginLeft={"5%"}/>
                    <Card cardwidth={"25%"} cardheight={"120px"} borderradius={2} h3={"Student name"} p={"Student ID"} marginRight={"3%"} marginLeft={"5%"}/>
                  </div>

                  <div className="row" style={{ width: "100%", marginTop: "50px"}}>
                    <Card cardwidth={"25%"} backcolor={"white"} fontcolor={"#ffffff"} cardheight={"120px"} borderradius={2} h3={"Student name"} p={"Student ID"} marginRight={"3%"} marginLeft={"5%"}/>
                    <Card cardwidth={"25%"} cardheight={"120px"} borderradius={2} h3={"Student name"} p={"Student ID"} marginRight={"3%"} marginLeft={"5%"}/>
                    <Card cardwidth={"25%"} cardheight={"120px"} borderradius={2} h3={"Student name"} p={"Student ID"} marginRight={"3%"} marginLeft={"5%"}/>
                  </div>

                  <div className="row" style={{ width: "100%", marginTop: "50px"}}>
                    <Card cardwidth={"25%"} backcolor={"white"} fontcolor={"#ffffff"} cardheight={"120px"} borderradius={2} h3={"Student name"} p={"Student ID"} marginRight={"3%"} marginLeft={"5%"}/>
                  </div>

                  </div>


                <div ref={divRef} >
                    <Footer />
                </div>
                
            </div>

            <a href="#"><ScrollButton 
                behavior={'smooth'} 
                buttonBackgroundColor={'black'}
                iconType={'arrow-up'}
                style= {{fontSize: '24px'}}
                onClick = {handleScroll}
            /></a>
         
        </Fragment>
    )
}

export default HomePage
