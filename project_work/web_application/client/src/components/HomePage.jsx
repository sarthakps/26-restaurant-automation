import React,{Fragment, useState } from "react";
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom";

const HomePage = () => {
    return (
        <Fragment>
            <div className="mainpage">
                <div className="container text-center">
                    <br />
                    <h1><strong>Restaurant Automation System</strong></h1>
                    <br />
                    <br />
                    <p>choose a role : </p>
                   <Link to="/restaurantmanager/login"><button className="btn btn-dark btn-lg">Restaurant Manager</button></Link>
                   <br />
                   <br />
                   <Link to="/restaurantmanager/login"><button className="btn btn-dark btn-lg">Inventory Manager</button></Link>
                    <br />
                    <br />
                    <Link to="/restaurantmanager/login"><button className="btn btn-dark btn-lg">Kitechen Manager</button></Link>
                </div>
            </div>
        </Fragment>
    )
}

export default HomePage
