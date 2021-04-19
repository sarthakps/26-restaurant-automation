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
import MarkAttendance from './components/restaurantmanager/MarkAttendance'
import RemoveUser from './components/restaurantmanager/RemoveUser'
import InvLogin from './components/inventorymanager/InvLogin'
import UpdateMenu from './components/inventorymanager/UpdateMenu'
import InvHome from './components/inventorymanager/InvHome'
import UpdateInventory from './components/inventorymanager/UpdateInventory'
import KitLogin from './components/kitchenpersonnel/KitLogin'
import PendingOrders from './components/kitchenpersonnel/PendingOrders'

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
          <Route exact path="/restaurantmanager/mark-attendance" component={MarkAttendance} />
          <Route exact path="/restaurantmanager/remove-user" component={RemoveUser} />
          <Route exact path="/inventorymanager/login" component={InvLogin} />
          <Route exact path="/inventorymanager/update-menu" component={UpdateMenu} />
          <Route exact path="/inventorymanager/invhome" component={InvHome} />
          <Route exact path="/inventorymanager/update-inventory" component={UpdateInventory} />
          <Route exact path="/kitchenpersonnel/login" component={KitLogin} />
          <Route exact path="/kitchenpersonnel/pending-orders" component={PendingOrders} />
        </Switch>
      </Router>
    </Fragment>
  );
}

export default App;
