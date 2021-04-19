import React,{Fragment, useState , useRef} from "react";
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom";
import Header from './restaurantmanager/Header'
import img1 from '../images/main8.jpg'

import Card from './restaurantmanager/Card'
import Footer from './restaurantmanager/Footer'
import Grid from './restaurantmanager/Grid'
import ImageCard from './restaurantmanager/ImageCard'
import ScrollButton from 'react-scroll-button'
import Button from '@material-ui/core/Button'

import { ParallaxProvider, Parallax  } from 'react-scroll-parallax';


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

    return (
        <Fragment>
            <div className="mainpage">
                <Header/>

                {/* <Button
                    Button color="inherit" 
                    style={{color: "red"}}
                    onClick={() => {
                    divRef.current.scrollIntoView({ behavior: "smooth" });
                    }}
                >BOTTOM</Button> */}

                
                <div style={{height: "650px", backgroundColor: "#060300"}}>

                    <div style={{width: "49%", height: "2px", marginTop:"0px", paddingTop:"0px", align:"right"}}>
                    <img src={img1} style={{width: "100%", marginTop: "30px", height: "620px", background:"no repeat center fixed"}} />
                    </div>
               
                    {/* <Parallax bgImage={img1} className="custom-class" y={[-20, 20]} tagOuter="figure">
                        <div>HIII</div>
                    </Parallax> */}

                    {/* <Parallax bgImage={ img1 } strength={500}>
                        <div style={{ height: 500 }}>
                        <div >HTML inside the parallax</div>
                        </div>
                    </Parallax> */}
          
                        <div style={{marginLeft: "600px", marginTop:"100px"}}>
                            <h1 className="container" style={{fontFamily: "Playfair Display,serif", color: "white", letterSpacing: "3px", fontSize: "45px"}}>Restaurant Automation System</h1>
                       
                            <div style={{marginLeft: "100px", marginTop: "60px"}}>
                            <p style={{color: "#F2F4F8", marginLeft: "100px"}}>choose a role : </p>
                            </div>
                        </div>


                    <div style={{textAlign: "right", marginRight: "17%", marginTop:"0px", marginLeft: "100px"}}>
                        
                        
                    <Link to="/restaurantmanager/login"><button type="button" class="btn btn-outline-dark" style={{letterSpacing: "0.24rem"}}>Restaurant Manager</button></Link>
                    <br />
                    <br />
                    <Link to="/inventorymanager/login"><button type="button" class="btn btn-outline-dark">Inventory Manager</button></Link>
                        <br />
                        <br />
                        <Link to="/kitchenpersonnel/login"><button type="button" class="btn btn-outline-dark">Kitchen Personnel</button></Link>
                    </div>
                </div>

                <div style={{height: "1250px", backgroundColor:"#F2F4F8"}}>
            
                <div ref={divRefmid} style={{marginTop: "150px"}}>
                <ImageCard/>
                </div>

        <div>
        <div className="row" style={{marginTop: "170px", width: "100%"}}>
            <Card />
            <Card />
        </div>
        <div className="row" style={{marginTop: "50px", marginBottom: "80px", width: "100%"}}>
            <Card />
            <Card />
        </div>
        <div style={{ marginLeft:"60%", width: "50%"}}>
            
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
