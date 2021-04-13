import React, {Fragment, useState} from "react"
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom"
import './reshome.css'
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
        <p class="w3-jumbo" style={{textAlign: "center"}}><strong>Welcome Restaurant Manager</strong></p>
      </div>

    <div style={{float: "right", marginRight: "70px"}}><button type="button" class="btn btn-outline-dark btn-lg">LOGOUT</button></div>


    <div class="row" style={{marginTop: "200px"}}>
        <div class="col-sm-6" style={{marginLeft: "0%"}}>
        {/* <div class="card"> */}
            <div class="card-body">
                <div class="frame1">
                    <img src="https://laurent.qodeinteractive.com/wp-content/uploads/2020/01/Landing-home-img-1-scaled.jpg" />
                                
                </div>
                <br />
                <div class="title" >
                    <Link to="/restaurantmanager/menu"><button type="button" class="btn btn-outline-dark btn-lg" >Menu</button></Link>
                </div>     
            </div>
        {/* </div> */}
    </div>

    <div class="col-sm-6">
        {/* <div class="card"> */}
            <div class="card-body">
                <div class="frame1">
                    <img src="https://laurent.qodeinteractive.com/wp-content/uploads/2020/01/Landing-home-img-11-scaled.jpg"/>
                </div>
                <br />
                <div class="title" style={{textAlign: "center"}}>
                    <Link to="/restaurantmanager/revenue"><button type="button" class="btn btn-outline-dark btn-lg">Revenue Analysis</button></Link>
                </div>
                    
            </div>

        {/* </div> */}
    </div>
    <div class="col-sm-6">
        {/* <div class="card"> */}
            <div class="card-body">
                <div class="frame1">
                    <img src="https://laurent.qodeinteractive.com/wp-content/uploads/2020/01/Landing-home-img-3.jpg" />
                </div>
                <br />
                <div class="title" style={{textAlign: "center"}}>
                    <Link to="/restaurantmanager/register-user"><button type="button" class="btn btn-outline-dark btn-lg">Register User</button></Link>
                </div>
                    
            </div>

        {/* </div> */}
    </div>
</div>



<div class="row" style={{marginTop: "100px", align: "cenetr"}}>
        <div class="col-sm-6" style={{marginLeft: "0%"}}>
        {/* <div class="card"> */}
        <div class="card-body">
                    <div class="frame1">
                        <img
                            src="https://laurent.qodeinteractive.com/wp-content/uploads/2020/01/Landing-home-img-4.jpg" />
                    </div>
                    <br />
                    <div class="title" style={{textAlign: "center"}}>
                    <Link to="/restaurantmanager/rush-hour-prediction"><button type="button" class="btn btn-outline-dark btn-lg">Rush Hour Analysis</button></Link>
                    </div>
    
                </div>
        {/* </div> */}
    </div>

    <div class="col-sm-6">
        {/* <div class="card"> */}
            
        <div class="card-body">
                    <div class="frame1">
                        <img
                            src="https://laurent.qodeinteractive.com/wp-content/uploads/2020/01/Laurent-home-new-img-1.jpg" />
                    </div>
                    <br />
                    <div class="title" style={{textAlign: "center"}}>
                    <Link to="/restaurantmanager/attendance"><button type="button" class="btn btn-outline-dark btn-lg">Attendance</button></Link>
                    </div>
        
                </div>

        {/* </div> */}
    </div>
    <div class="col-sm-6">
        {/* <div class="card"> */}
        <div class="card-body">
                    <div class="frame1">
                        <img
                            src="https://laurent.qodeinteractive.com/wp-content/uploads/2020/01/Landing-home-img-10-scaled.jpg" />
                    </div>
                    <br />
                    <div class="title" style={{textAlign: "center"}}>
                    <Link to="/restaurantmanager/feedback-analysis"><button type="button" class="btn btn-outline-dark btn-lg">Feedback Analysis</button></Link>
                    </div>
              
                </div>

        {/* </div> */}
    </div>
</div>


    {/* <div class="container text-center">
        <div class="row">
            <div class="col-sm-6">

                <div class="card-body">
                    <div class="frame1">
                        <img
                            src="https://laurent.qodeinteractive.com/wp-content/uploads/2020/01/Landing-home-img-1-scaled.jpg" />
                            
                    </div>
                    <br />
                    <div class="title" style={{textAlign: "center"}}>
                    <Link to="/restaurantmanager/menu"><button type="button" class="btn btn-outline-dark btn-lg" >Menu</button></Link>
                    </div>

                    
                  
                </div>
            </div>


            <div class="col-sm-6">

                <div class="card-body">
                    <div class="frame1">
                        <img
                            src="https://laurent.qodeinteractive.com/wp-content/uploads/2020/01/Landing-home-img-11-scaled.jpg"/>
                    </div>
                    <br />
                    <div class="title" style={{textAlign: "center"}}>
                    <Link to="/restaurantmanager/revenue"><button type="button" class="btn btn-outline-dark btn-lg">Revenue Analysis</button></Link>
                    </div>
                   
                </div>

            </div>
            <div class="col-sm-6">

                <div class="card-body">
                    <div class="frame1">
                        <img
                            src="https://laurent.qodeinteractive.com/wp-content/uploads/2020/01/Landing-home-img-3.jpg" />
                    </div>
                    <br />
                    <div class="title" style={{textAlign: "center"}}>
                    <Link to="/restaurantmanager/register-user"><button type="button" class="btn btn-outline-dark btn-lg">Register User</button></Link>
                    </div>
                   
                </div>
            </div>
            <div class="col-sm-6">

                <div class="card-body">
                    <div class="frame1">
                        <img
                            src="https://laurent.qodeinteractive.com/wp-content/uploads/2020/01/Landing-home-img-4.jpg" />
                    </div>
                    <br />
                    <div class="title" style={{textAlign: "center"}}>
                    <Link to="/restaurantmanager/rush-hour-prediction"><button type="button" class="btn btn-outline-dark btn-lg">Rush Hour Analysis</button></Link>
                    </div>
    
                </div>
            </div>
            <div class="col-sm-6">

                <div class="card-body">
                    <div class="frame1">
                        <img
                            src="https://laurent.qodeinteractive.com/wp-content/uploads/2020/01/Laurent-home-new-img-1.jpg" />
                    </div>
                    <br />
                    <div class="title" style={{textAlign: "center"}}>
                    <Link to="/restaurantmanager/attendance"><button type="button" class="btn btn-outline-dark btn-lg">Attendance</button></Link>
                    </div>
        
                </div>
            </div>
            <div class="col-sm-6">

                <div class="card-body">
                    <div class="frame1">
                        <img
                            src="https://laurent.qodeinteractive.com/wp-content/uploads/2020/01/Landing-home-img-10-scaled.jpg" />
                    </div>
                    <br />
                    <div class="title" style={{textAlign: "center"}}>
                    <Link to="/restaurantmanager/feedback-analysis"><button type="button" class="btn btn-outline-dark btn-lg">Feedback Analysis</button></Link>
                    </div>
              
                </div>
            </div>
        </div>

    </div> */}
    </body>
    </Fragment>


    )
}

export default ResHome
