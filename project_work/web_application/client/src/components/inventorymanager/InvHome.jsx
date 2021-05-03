import React, {Fragment, useState, useRef} from "react"
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom"
import '../restaurantmanager/reshome.css'
import backimg from './invhome.jpg'
import updmenu from './updmenu.jpg'
import updinv from './updinv.jpeg'

import Card from '../restaurantmanager/Card'
import Header from '../restaurantmanager/Header'
import Footer from '../restaurantmanager/Footer'
import "@fontsource/open-sans-condensed"

const InvHome = () => {

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
        <h1 class="w3-jumbo" style={{textAlign: "center", marginTop: "300px", fontFamily: "Open Sans Condensed", fontSize: "100px !important", color: "white"}}>Inventory Manager</h1>
    </div>

    <div style={{height: "360px", backgroundColor:"#0a0908"}}>
        <h6 style={{color: "#f2f4f3", paddingTop: "303px", textAlign: "center"}}>Update Menu &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Update Inventory</h6>
    </div>
       


    <Header logout={"log out"} avatar={""}  logoutpath={"/inventorymanager/login"} height={"50px"} height={"65px"} color={"black"} color2={"white"}/>
    <br />
    <br /> 
    <br /> 
    <br />
    <br />   

    <div className="row" style={{ width: "100%", marginTop: "20px"}}>
            <Card cardimg={updmenu} borderradius={"0px"} url={"/inventorymanager/update-menu"} cardwidth={"35%"} borderradius={2} h3={"Update Menu"} marginRight={"3%"} marginLeft={"5%"}/>
            <Card cardimg={updinv} url={"/inventorymanager/update-inventory"} cardwidth={"35%"} borderradius={2} h3={"Update Inventory"} marginRight={"3%"} marginLeft={"5%"}/>          
    </div>

    <br />
    <br /> 
    <br />
    <br /> 
    <br />
    <br /> 
    <br /> 
    <br />
    <br /> 
    
   
    <div ref={divRef} >
                    <Footer />
                </div>
    
    </body>
    </Fragment>


    )
}

export default InvHome
