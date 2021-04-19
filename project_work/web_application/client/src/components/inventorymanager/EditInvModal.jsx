import { Container } from "@material-ui/core";
import React, { useState } from "react";
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';
import Swal from "sweetalert2";

function EditInvModal({row}) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    console.log("ROW : ", row.item_name)
    const inventory_id = row.inventory_id;

    // const [inventory_id, setInventory_id] = useState(row.inventory_id)
    const [item_name, setItem_name] = useState(row.item_name)
    const [available_qty, setAvailable_qty] = useState(row.available_qty)
    //restaurant_id

    const updateInventory = async(e) => {
      e.preventDefault();
      try {
          const res_id = localStorage.getItem("resID");
          const email_id = localStorage.getItem("emailID");
          //console.log("In Update Inventory file EMAIL ID : ", email_id);
          const body = {restaurant_id:res_id, email_id, inventory_id, item_name, available_qty};  // send email_id by localStorage method
          console.log("BODY : ", body)

          const menuDishes = await fetch('/inventorymanager/inventory', {
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
        <Button variant="primary" onClick={handleShow} style={{color:"white"}}>
          Update Item
        </Button>
  
        <Modal id={`id$(row.inventory_id)`} show={show} onHide={handleClose} style={{opacity:1, backgroundColor: "black !important"}}>
          <Modal.Header closeButton style={{backgroundColor: "black", color: "white"}}>
            <Modal.Title style={{backgroundColor: "black", color: "white"}}>Update Inventory Item</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{backgroundColor: "black", color: "white"}}>
              <h5 className="container text-center">ID : {row.inventory_id}</h5>
              <label for="ucpi" style = {{float: "left", color: "white" }}>Item Name : </label>
              <input type="text" className="form-control" value={item_name} onChange={e => setItem_name(e.target.value)} />
              <label for="ucpi" style = {{float: "left", color: "white" }}>Available Quantity : </label>
              <input type="text" className="form-control" value={available_qty} onChange={e => setAvailable_qty(e.target.value)} />
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