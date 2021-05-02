import React, {Fragment, useState} from "react"
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom"

import img1 from '../../images/reshome4.jpg'

const ResHome = () => {
    return (    

        <Fragment>

            <body style={{backgroundColor:"#000c0c"}}>
     <br />

        <div style={{width: "100%", height: "2px", marginTop:"0px", paddingTop:"0px"}}>
        <img src={img1} style={{width: "100%", height: "700px", background:"no repeat center fixed", backgroundSize: "cover"}} />
        </div>
    

    <div class="w3-container w3-tangerine">
        <p class="w3-jumbo" style={{textAlign: "center"}}><strong>Welcome Inventory Manager</strong></p>
      </div>

    <div style={{float: "right", marginRight: "70px"}}><button type="button" class="btn btn-outline-dark btn-lg">LOGOUT</button></div>


   

<div class="title" style={{textAlign: "center"}}>
    <Link to="/inventorymanager/update-menu"><button type="button" class="btn btn-outline-dark btn-lg">Update Menu</button></Link>
</div>

<div class="title" style={{textAlign: "center"}}>
    <Link to="/inventorymanager/update-inventory"><button type="button" class="btn btn-outline-dark btn-lg">Update Inventory</button></Link>
</div>

<Link to="/inventorymanager/login"><button type="button" class="btn btn-outline-dark btn-lg">Log Out</button></Link>

    </body>
    </Fragment>


    )
}

export default ResHome
