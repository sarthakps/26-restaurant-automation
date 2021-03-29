import React, {Fragment, useState, useEffect} from "react"
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom"
import Swal from "sweetalert2";

const Menu = () => {

    const [resmenu, setResmenu] = useState([]);

    const getMenu = async() => {
        try {

            const res_id = localStorage.getItem("resID");
            const email_id = localStorage.getItem("emailID");
            //console.log("In Menu file : ", res_id);
            const body = {restaurant_id:res_id, email_id: "m1@gmail.com"};  // send email_id by localStorage method

            const menuDishes = await fetch('/restaurantmanager/viewmenu', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(res => {
                return res.json()
            })
            //console.log(menuDishes.dishes);
            if(!menuDishes.dishes){
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'No Menu for your restaurant!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            //console.log(menuDishes);
            else{
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Here is the menu',
                    showConfirmButton: false,
                    timer: 1500
                })
                setResmenu(menuDishes.dishes);
            }
            

        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getMenu();
    }, [])

    return (
        <Fragment>
            <div className="container text-center">
                <br />
                <h1>Menu Page</h1>
                <br />


                {/* dish_id, dish_name, description, dish_price, status, jain_availability */}

                <div className="container">
            <table class="table table-bordered table-white">
                <thead class="thead-dark">
                <tr>
                    <th>ID</th>
                    <th>Dish Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Jain</th>                  
                </tr>
                </thead>
                <br />
                <tbody>
    
                {resmenu.map( dishes => (
                    <tr>
                    <td>
                        {dishes.dish_id}
                    </td>
                    <td>
                        {dishes.dish_name}
                    </td>
                    <td>
                        {dishes.description}
                    </td>
                    <td>
                        {dishes.dish_price}
                    </td>
                    <td>
                        {dishes.status}
                    </td>
                    <td>
                        {dishes.jain_availability ? 'yes' : 'no'}
                    </td>     
                </tr>
                ))
            }
                </tbody>
            </table>
            </div>

                <br />
                <br />
                <Link to="/restaurantmanager/reshome"><button className="btn btn-primary">Go to Home Page</button></Link>
            </div>


        </Fragment>
    )
}

export default Menu
