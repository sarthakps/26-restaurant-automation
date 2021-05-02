import React,{Fragment, useState } from "react";
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom";
import Swal from "sweetalert2";

const ResLogin = (props) => {
    const [email_id, setUid] = useState("")
    const [password, setPassword] = useState("")

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = {email_id, password};

            var emailid = email_id;
            localStorage.setItem("emailID", emailid);

            // proxy
            const submitLogin = await fetch("/inventorymanager/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(res => {
                return res.json()
            })

            //console.log(submitLogin.msg);

            if(submitLogin.msg === "Successfully logged in!"){
                Swal.fire("Congrats!", submitLogin.msg, "success")
                props.history.push("/inventorymanager/invhome")

                var res_id = submitLogin.restaurant_id;
                localStorage.setItem("resID", res_id);
                //console.log("IN ResLogin file: ", res_id);

            }
            else{
                Swal.fire("Sorry!", submitLogin.msg, "error")
            }

        } catch (err) {
           // console.warn(xhr.responseText)
            console.log(err.message);
        }
    }

    return (
  
<Fragment>

     <div id="resloginpage">
        
              <div class="title">
                  <br />
              <h1 class="container text-center"><strong>Inventory Manager</strong></h1>
        
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
                      <label for="uid">Email ID:</label>
                      <input type="text" className="form-control" id="uid" placeholder="Enter username" name="uid" required value = {email_id} onChange={e => setUid(e.target.value)} />
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
