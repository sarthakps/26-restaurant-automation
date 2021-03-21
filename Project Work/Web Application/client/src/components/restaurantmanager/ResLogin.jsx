import React,{Fragment, useState } from "react";
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom";
import Swal from "sweetalert2";


const ResLogin = (props) => {
    const [user_id, setUid] = useState("")
    const [password, setPassword] = useState("")

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = {user_id, password};
            const submitLogin = await fetch("http://localhost:5000/restaurantmanager/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(res => {
                return res.json()
            })

            console.log(submitLogin.user_id);

            if(submitLogin.user_id){
                Swal.fire("Congrats!", "Successful Login", "success")
                props.history.push("/restaurantmanager/reshome")

                var res_manager_id = submitLogin.user_id;
                localStorage.setItem("resManID", res_manager_id);
            }
            else{
                Swal.fire("Sorry!", "Incorrect credentials", "error")
            }

        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <Fragment>

        <div id="resloginpage">
        
              <div class="title">
                  <br />
              <h1 class="container text-center"><strong>Restaurant Manager</strong></h1>
        
              <div class="second">
              </div>
              </div>
              <br />
                
                <br/>
                
                <div className="container text-center">
                  <h2 class="login-hone">Login : </h2>
                  <small class="login-hone">Enter The appropriate credentials</small>
                </div>
             <div className="container">
             <form action="POST" onSubmit={onSubmitForm}>
                    <div >
                      <label for="uid">User ID:</label>
                      <input type="text" className="form-control" id="uid" placeholder="Enter username" name="uid" required value = {user_id} onChange={e => setUid(e.target.value)} />
                    </div>
                    <div>
                    <label for="pwd">Password:</label>
                    <input type="password" className="form-control" id="pwd" placeholder="Enter password" name="pswd" required value = {password} onChange={e => setPassword(e.target.value)}/>
                  </div>
                  <br />
                  <button className="btn btn-primary">LOGIN</button>
                 
                </form>
            </div>
        
          <br /> 
          <br />
          <br />       
    
             <div className="container text-center">
                    <Link to={"/"}><button className="btn btn-warning"><span>Go to Main page</span></button></Link>
            </div>
            
            </div>
            
        </Fragment>
    )

}

export default ResLogin;
