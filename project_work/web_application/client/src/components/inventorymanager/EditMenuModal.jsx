import { Container } from "@material-ui/core";
import React, { useState } from "react";
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';
import Swal from "sweetalert2";

function EditInvModal({row}) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    console.log("ROW : ", row.dish_name)
    const dish_id = row.dish_id;

    // const [inventory_id, setInventory_id] = useState(row.inventory_id)
    const [dish_name, setDish_name] = useState(row.dish_name)
    const [dish_price, setDish_price] = useState(row.dish_price)
    const [jain_availability, setJain_availability] = useState(row.jain_availability);
    const [status, setStatus] = useState(row.status)
    const [description, setDescription] = useState(row.description)
    //restaurant_id

    const updateInventory = async(e) => {
      e.preventDefault();
      try {
          const res_id = localStorage.getItem("resID");
          const email_id = localStorage.getItem("emailID");
          //console.log("In Update Inventory file EMAIL ID : ", email_id);
          const body = {restaurant_id:res_id, email_id, dish_id, dish_name, dish_price, jain_availability, status, description};  // send email_id by localStorage method
          console.log("BODY : ", body)

          const menuDishes = await fetch('/inventorymanager/menu', {
              method: "PUT",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify(body)
          })
          console.log(menuDishes.status);
          if(menuDishes.status != 200){
              Swal.fire({
                  position: 'top-end',
                  icon: 'error',
                  title: 'Error!',
                  showConfirmButton: false,
                  timer: 1500
              })
          }
          //console.log(menuDishes);
          else{
              Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Updated Successfully!',
                  showConfirmButton: false,
                  timer: 1500
              })
              window.location.reload();
          }        
      } catch (err) {
          console.error(err)
      }
  }
  
    return (
      <>
        <Button variant="primary" onClick={handleShow} style={{fontColor:"black"}}>
          Update Item
        </Button>
  
        <Modal id={`id$(row.dish_id)`} show={show} onHide={handleClose} style={{opacity:1, backgroundColor: "black !important"}}>
          <Modal.Header closeButton style={{backgroundColor: "black"}}>
            <Modal.Title style={{backgroundColor: "black", color: "white"}}>Update Menu Item</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{backgroundColor: "black"}}>
              <h5 className="container text-center" style={{color: "white"}}>ID : {row.dish_id}</h5>
              <label for="ucpi" style = {{float: "left", color: "white" }}>Dish Name : </label>
              <input type="text" className="form-control" value={dish_name} onChange={e => setDish_name(e.target.value)} />
              <label for="ucpi" style = {{float: "left", color: "white" }}>Dish Price : </label>
              <input type="text" className="form-control" value={dish_price} onChange={e => setDish_price(e.target.value)} />
              <label for="ucpi" style = {{float: "left", color: "white" }}>Status : </label>
              <input type="text" className="form-control" value={status} onChange={e => setStatus(e.target.value)} />
              <label for="ucpi" style = {{float: "left", color: "white" }}>Jain Availability : </label>
              <input type="text" className="form-control" value={jain_availability} onChange={e => setJain_availability(e.target.value)} />
              <label for="ucpi" style = {{float: "left", color: "white" }}>Description : </label>
              <input type="text" className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
          </Modal.Body>
          <Modal.Footer style={{backgroundColor: "black"}}>
          <Button variant="primary" onClick={e => updateInventory(e)}>
              Save Changes
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
  //render(<Example />);

  export default EditInvModal;