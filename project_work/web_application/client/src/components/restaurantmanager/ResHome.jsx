import React, {Fragment, useState, useRef} from "react"
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom"
import './reshome.css'
import img1 from '../../images/reshome4.jpg'
import backimg from './reshome_img2.jpg'
import menu from './resmenu.jpg'
import revenue from './revenue.jpeg'
import revenue2 from './revenue2.jpeg'
import rush from './rush.jpeg'
import register1 from './register.jpg'
import markatten from './markatten.jpg'
import viewatten from './viewatten.jpg'
import feedback from './feedback.jpg'
import remove from './remove2.jpg'


import Card from './Card'
import Header from './Header'
import Footer from './Footer'
import "@fontsource/open-sans-condensed"

const ResHome = () => {

    const divRef = useRef();

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
       


    <Header logout={"log out"} avatar={""}  logoutpath={"/restaurantmanager/login"} height={"50px"} height={"65px"} color={"black"} color2={"white"}/>
    <br />
    <br />   
