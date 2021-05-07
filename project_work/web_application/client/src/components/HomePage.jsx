import React,{Fragment, useState , useRef} from "react";
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom";
import Header from './restaurantmanager/Header'
import img1 from '../images/main8.jpg'
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Card from './restaurantmanager/Card'
import Footer from './restaurantmanager/Footer'
import Grid from '@material-ui/core/Grid';
import ImageCard from './restaurantmanager/ImageCard'
import ScrollButton from 'react-scroll-button'
import Button from '@material-ui/core/Button'
import Carousel from 'react-material-ui-carousel';
import { deepPurple } from '@material-ui/core/colors';
//#CBAF6D
import i1 from './123.png'
import choose_role from './choose_role.jpg'
import about from './about4.jpg'
import waiter from './waiter.svg'
import manager from './manager3.svg'
import chef from './chef.svg'
import inv from './inv.svg'


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
    image1: {
      backgroundRepeat: 'no-repeat',
      backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: "550px",
      height: "600px",
    },
    image2: {
        backgroundRepeat: 'no-repeat',
        backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: "500px",
        height: "730px",
      }
  
}));

const HomePage = () => {
    
    function handleScroll() {
        window.scroll({
          top: document.body.offsetHeight,
          left: 0, 
          behavior: 'smooth',
        });
      }

      const divRefmid = useRef();
      const divRef = useRef();

      const cardwidth = "50%"
      const borderradius = "15px"
      const h2 = "Automation"
      const h3 = "100"
      const p = "Upto 100 Employees"
      const classes = useStyles();

    return (
        <Fragment>
            <div className="mainpage">
                <Header login={"login"} subscription={"subscription"} height={"62px"} color={"white"} color2={"black"} />

                {/* <Button
                    Button color="inherit" 
                    style={{color: "red"}}
                    onClick={() => {
                    divRefmid.current.scrollIntoView({ behavior: "smooth" });
                    }}
                >BOTTOM</Button> */}
                
                <div  style={{height: "650px", backgroundColor: "#0a0908", marginTop: "0px", paddingTop: "0px"}}>

                    {/* <div style={{width: "49%", height: "2px", marginTop:"0px", paddingTop:"0px", align:"right"}}>
                    <img src={img1} style={{width: "100%", marginTop: "30px", height: "620px", background:"no repeat center fixed"}} />
                    </div> */}

                    
                        <span class="w3-jumbo" style={{textAlign: "left", marginTop: "0px", fontFamily: "Open Sans Condensed", fontSize: "80px !important", color: "white", filter: "brightness(100%)", width: "100px"}}>RESTAURANT AUTOMATION</span>       
                      

<div style={{textAlign: "right !important", float: "right"}}>
<Grid item xs={false} sm={7} md={12}  >
            <Carousel >
                  <div  >
                  <img src={i1}  className={classes.image1}/>
                  </div> 
                  {/* <div >
                  <img src={i2} className={classes.image2}/>
                  </div>   */}
            </Carousel>
          </Grid>
          </div>
          </div>    
          
       <div className="row" style={{textAlign: "right", marginRight: "0px", marginTop:"50px", marginLeft: "0px", backgroundColor: "white", paddingBottom : "100px", marginBottom:"0px"}}>

       <img src={choose_role} style={{width: "470px", height: "490px", marginTop: "100px", marginLeft: "130px"}}/>

               
                          
                    
                      <div style={{ paddingRight: "100px", marginLeft: "200px", marginTop: "100px", width: "33%"}}> 

                      <div className="row">
                        <h2 style={{color: "black",marginRight: "0px",fontFamily: "proxima-nova", letterSpacing: "-.03em", lineHeight: "1.3", fontWeight: "400", fontSize: "34px"}}>Choose a role : </h2> 



                            <h5 style={{fontFamily: "Rubik", color: "#a9927d", filter: "brightness(100%)"}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an .</h5>
                      
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
                

                <div style={{height: "850px", backgroundColor:"yellow", marginBottom:"20px", paddingTop:"0px"}}>
            
                    <div ref={divRefmid}>


                    <div style={{width: "100%", height: "2px", marginTop:"0px", paddingTop:"0px"}}>
                      <img className="darkened-image" src={about} style={{width: "100%", height: "850px", background:"no repeat center fixed", backgroundSize: "cover", filter: "brightness(90%)"}} />
                      </div>
                  

                  <div className="container" style={{width: "30%", marginLeft: "850px", paddingTop: "80px"}}>
                    <h1 className="w3-jumbo" style={{ marginTop:"100px", fontFamily: "Open Sans Condensed", color: "white", filter: "brightness(100%)"}}>About Us</h1>
                      <p className="w3-jumbo_one" style={{ marginTop: "80px", fontFamily: "Open Sans Condensed", fontSize: "2.5rem !important", color: "white", filter: "brightness(100%)"}}>standard dummy text ever since the 1500s, when an unknown printer took a galley of type <br />and scrambled it to make a type specimen book. It has survived not only five centuries</p>

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

                      <p className="w3-jumbo_one" style={{ marginTop: "30px", fontFamily: "Open Sans Condensed", fontSize: "2.5rem !important", color: "white", filter: "brightness(100%)"}}>standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a types</p>

                  </div>
                    

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
