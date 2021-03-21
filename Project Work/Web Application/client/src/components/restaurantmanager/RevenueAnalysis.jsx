import React, {Fragment, useState} from "react"
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom"

const RevenueAnalysis = () => {
    return (
        <div className="container text-center">
            <h1>Revenue Analysis Page</h1>
            <br />
            <br />
            <br />
            <Link to="/restaurantmanager/reshome"><button className="btn btn-primary">Go to Home Page</button></Link>
        </div>
    )
}

export default RevenueAnalysis
