import React, {Fragment, useState, useRef} from "react"
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom"
import './reshome.css'
import img1 from '../../images/reshome4.jpg'
import backimg from './backimg.jpg'

import menu from './menu.jpg'
import revenue2 from './revenue.jpg'
import rush from './rush.jpg'
import feedback from './feedback.jpg'
import remove from './remove.jpg'
//pic left
import register1 from './register.jpg'
import markatten from './markatten.jpg'
import viewatten from './viewatten.jpg'


import Card from './Card'
import Header from './Header'
import Footer from './Footer'
import "@fontsource/open-sans-condensed"

const ResHome = () => {

    const divRef = useRef();
    
  const user_image = localStorage.getItem("user_image");

    return (    

        <Fragment>

            <body style={{backgroundColor:"#f2f4f3"}}>

        {/* <div>
        <img className="darkened-image" src={backimg} style={{height:"800px", width:"100%" }}/>
        </div> */}

<div style={{width: "100%", height: "2px", marginTop:"0px", paddingTop:"0px"}}>
        <img className="darkened-image" src={backimg} style={{width: "100%", height: "670px", background:"no repeat center fixed", backgroundSize: "cover"}} />
        </div>
    

    <div class="w3-container w3-tangerine">
        <h1 class="w3-jumbo" style={{textAlign: "center", marginTop: "300px", fontFamily: "Open Sans Condensed", fontSize: "100px !important", color: "white"}}>Restaurant Manager</h1>
    </div>

    <div style={{height: "360px", backgroundColor:"#0a0908"}}>
        <h6 style={{color: "#f2f4f3", paddingTop: "303px", textAlign: "center"}}>Menu &nbsp; &nbsp; &nbsp; &nbsp; Revenue &nbsp; &nbsp; &nbsp; &nbsp; Register User &nbsp; &nbsp; &nbsp; &nbsp; View/Mark Attendance &nbsp; &nbsp; &nbsp; &nbsp; Analyze Feedback &nbsp; &nbsp; &nbsp; &nbsp; Rush Hour Prediction &nbsp; &nbsp; &nbsp; &nbsp; Remove a User </h6>
    </div>
       


    <Header logout={"log out"} avatar={user_image}  logoutpath={"/restaurantmanager/login"} height={"65px"} color={"white"} color2={"#0A0908"}/>
    <br />
    <br />   

    <div className="row" style={{ width: "100%", marginTop: "20px"}}>
            <Card cardimg={menu} borderradius={"0px"} url={"/restaurantmanager/menu"} cardwidth={"25%"} borderradius={2} h3={"Menu"} marginRight={"3%"} marginLeft={"5%"}/>
            <Card cardimg={revenue2} url={"/restaurantmanager/revenue"} cardwidth={"25%"} borderradius={2} h3={"Revenue"} marginRight={"3%"} marginLeft={"5%"}/>
            <Card cardimg={rush} url={"/restaurantmanager/rush-hour-prediction"} cardwidth={"25%"} borderradius={2} h3={"Rush Hour Analysis"} marginRight={"3%"} marginLeft={"5%"}/>
            
    </div>

    <div className="row" style={{marginTop: "150px", width: "100%"}}>
            <Card cardimg={viewatten} url={"/restaurantmanager/attendance"} cardwidth={"25%"} borderradius={2} h3={"View Attendance"} marginRight={"3%"} marginLeft={"5%"}/>
            <Card cardimg={markatten} url={"/restaurantmanager/mark-attendance"} cardwidth={"25%"} borderradius={2} h3={"Mark Attendance"} marginRight={"3%"} marginLeft={"5%"}/>
            <Card cardimg={feedback} url={"/restaurantmanager/feedback-analysis"} cardwidth={"25%"} borderradius={2} h3={"Feedback Analysis"} marginRight={"3%"} marginLeft={"5%"}/>
    </div>

    <div className="row" style={{marginTop: "150px", paddingBottom: "200px", width: "100%"}}>
    <Card cardimg={register1} url={"/restaurantmanager/register-user"} cardwidth={"25%"} borderradius={2} h3={"Register User"} marginRight={"3%"} marginLeft={"5%"}/>
            <Card cardimg={remove} url={"/restaurantmanager/remove-user"} cardwidth={"25%"} borderradius={2} h3={"Remove a User"} marginRight={"3%"} marginLeft={"5%"}/>
    </div>

    <div ref={divRef} >
                    <Footer />
                </div>
    
    </body>
    </Fragment>


    )
}

export default ResHome
