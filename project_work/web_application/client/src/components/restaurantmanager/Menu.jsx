import React, {Fragment, useState, useEffect} from "react"
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom"

const Menu = () => {

    const [resmenu, setResmenu] = useState([]);

    const getMenu = async() => {
        try {
            const body = {restaurant_id: 1};

            const menuDishes = await fetch('/restaurantmanager/viewmenu', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(res => {
                return res.json()
            })
            //console.log(menuDishes);
            setResmenu(menuDishes.dishes);

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
