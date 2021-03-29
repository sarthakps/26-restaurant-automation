import React, {Fragment, useState} from "react";
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom";
import './App.css';
import HomePage from './components/HomePage';
import ResLogin from './components/restaurantmanager/ResLogin';
import ResHome from './components/restaurantmanager/ResHome'
import Menu from './components/restaurantmanager/Menu'
import ReveueAnalysis from './components/restaurantmanager/RevenueAnalysis'
import RegisterUser from './components/restaurantmanager/RegisterUser'
import RushHourPred from './components/restaurantmanager/RushHourPred'
import Attendance from './components/restaurantmanager/Attendance'
import FeedbackAnalysis from './components/restaurantmanager/FeedbackAnalysis'

function App() {
  return (
    <Fragment>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/restaurantmanager/login" component={ResLogin} />
          <Route exact path="/restaurantmanager/reshome" component={ResHome} />
          <Route exact path="/restaurantmanager/menu" component={Menu} />
          <Route exact path="/restaurantmanager/revenue" component={ReveueAnalysis} />
          <Route exact path="/restaurantmanager/register-user" component={RegisterUser} />
          <Route exact path="/restaurantmanager/rush-hour-prediction" component={RushHourPred} />
          <Route exact path="/restaurantmanager/attendance" component={Attendance} />
          <Route exact path="/restaurantmanager/feedback-analysis" component={FeedbackAnalysis} />
        </Switch>
      </Router>
    </Fragment>
  );
}

export default App;
