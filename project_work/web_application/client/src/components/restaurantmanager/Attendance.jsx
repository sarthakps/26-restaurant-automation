import React, { Fragment, useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom"

const Attendance = () => {

    const [resatten, setResatten] = useState([]);


    const getAttendance = async () => {
        try {

            const atten = await fetch("/restaurantmanager/view_attendance")
            const jsonData = await atten.json();

            //console.log(jsonData)

            setResatten(jsonData)

        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        getAttendance();
    }, [])



    return (
        <Fragment>
            <div className="container text-center">
                <br />
                <h1>Show Attendance Page</h1>
                <br />
                {/* user_id,user_name,time_stamp,attendance_status */}

                <div className="container">
                    <table class="table table-bordered table-white">
                        <thead class="thead-dark">
                            <tr>
                                <th>Employee ID</th>
                                <th>Employee Name</th>
                                <th>Time</th>
                                <th>Attendance Status</th>
                            </tr>
                        </thead>
                        <br />
                        <tbody>

                            {resatten.map(attendance => (
                                <tr>
                                    <td>
                                        {attendance.user_id}
                                    </td>
                                    <td>
                                        {attendance.user_name}
                                    </td>
                                    <td>
                                        {attendance.time_stamp}
                                    </td>
                                    <td>
                                        {attendance.attendance_status ? 'present' : 'absent'}
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

export default Attendance
