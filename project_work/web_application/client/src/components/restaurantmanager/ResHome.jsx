import React, {Fragment, useState} from "react"
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom"

const ResHome = () => {
    return (
        <div className="container text-center">
            <br />
            <br />
            <h1>Restaurant Home Page</h1>
            <br />
            <br />
             <Link to="/restaurantmanager/menu"><button className="btn btn-dark">Menu</button></Link>
             <br />
            <br />
             <Link to="/restaurantmanager/revenue"><button className="btn btn-dark">Revenue Analysis</button></Link>
             <br />
            <br />
             <Link to="/restaurantmanager/register-user"><button className="btn btn-dark">Register User</button></Link>
             <br />
            <br />
             <Link to="/restaurantmanager/rush-hour-prediction"><button className="btn btn-dark">Rush Hour Prediction</button></Link>
             <br />
            <br />
             <Link to="/restaurantmanager/attendance"><button className="btn btn-dark">Attendance</button></Link>
             <br />
            <br />
             <Link to="/restaurantmanager/feedback-analysis"><button className="btn btn-dark">Feedback Analysis</button></Link>
             <br />
            <br />
            <br />
            <br />
            <Link to="/"><button className="btn btn-primary">Go to Main Page</button></Link>
        </div>
    )
}

export default ResHome
