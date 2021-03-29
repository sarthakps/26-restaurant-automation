import React, {Fragment, useEffect, useState} from "react"
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom"
import Swal from "sweetalert2";

const FeedbackAnalysis = () => {
    
    const [feedback, setFeedback] = useState([]);
   // const [avgfeed, setAvgfeed] = useState();

    const getFeedback = async() => {
        try {
            const restaurant_id = localStorage.getItem("resID");
            const body = {restaurant_id};
            //console.log("HELLOOOO");
            const resFeedback = await fetch('/restaurantmanager/feedback', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }).then(res => {
                return res.json();
            });

            //console.log(res.json());
            //console.log("OUTPUT : ", resFeedback.length);
            if(resFeedback.length > 0){
                setFeedback(resFeedback)
                //setAvgfeed(resFeedback.length)
            }
            else{
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'No feedbacks for your restaurant yet!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }

        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getFeedback();
    }, [])

    return (
        <div className="container text-center">
            <br />
            <h1>Feedback Analysis Page</h1>
            <br />
            <br />
            <br />

            <div className="container">
            <table class="table table-bordered table-white">
                <thead class="thead-dark">
                <tr>
                    <th>ID</th>
                    <th>Category1</th>
                    <th>Category2</th>
                    <th>Category3</th>
                    <th>Category4</th>                 
                </tr>
                </thead>
                <br />
                <tbody>
    
                {feedback.map( feedbacks => (
                    <tr>
                    <td>
                        {feedbacks.feedback_id}
                    </td>
                    <td>
                        {feedbacks.category1}
                    </td>
                    <td>
                        {feedbacks.category2}
                    </td>
                    <td>
                        {feedbacks.category3}
                    </td>
                    <td>
                        {feedbacks.category4}
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
    )
}

export default FeedbackAnalysis
