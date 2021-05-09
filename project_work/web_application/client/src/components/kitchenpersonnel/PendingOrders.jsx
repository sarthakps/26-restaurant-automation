import React, {Fragment, useEffect, useState, useRef} from "react"
import {BrowserRouter as Router, Route, Link, Redirect, useRouteMatch } from "react-router-dom"
import Swal from "sweetalert2";
import clsx from 'clsx';
import { MuiThemeProvider, createMuiTheme, fade, lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Row, Col } from 'reactstrap';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';


// import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Header from '../restaurantmanager/Header'
import Footer from '../restaurantmanager/Footer'
import animationData from '../../images/pendord.json'
import Card from '../restaurantmanager/Card'
import '../stylebutton.css'
import Button from '@material-ui/core/Button';

import EnhancedTableToolbar from '../restaurantmanager/EnhancedTableToolBar'
import EnhancedTableHead from '../restaurantmanager/EnhancedTableHead'

// import { Messaging } from './Messaging';

// import { requestFirebaseNotificationPermission } from './firebaseInit'

// axios.defaults.baseURL = 'http://localhost:3001/v1';
  
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  
//   dish_id, dish_name, description, dish_price, status, jain_availability

  const headCells = [
    { id: 'order_id', numeric: true, disablePadding: true, label: 'ID' },
    { id: 'dish_name', numeric: false, disablePadding: true, label: 'Dish Name' },
    { id: 'dish_qty', numeric: false, disablePadding: false, label: 'Dish Quantity' },
    { id: 'table_no', numeric: false, disablePadding: false, label: 'Table No.' },
    { id: 'time', numeric: false, disablePadding: false, label: 'Time of Order' },
    { id: 'jain', numeric: false, disablePadding: false, label: 'Jain Requirement'},
    { id: 'ready', numeric: false, disablePadding: false, label: 'Ready!' }
  ];

  
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2)
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 5,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }));

const Menu = () => {
    const [resmenu, setResmenu] = useState([]);
     const divRef = useRef();

    const getMenu = async() => {
        try {

          console.log("in getmenu")

            const res_id = localStorage.getItem("resIDK");
            const email_id = localStorage.getItem("emailIDK");
            //console.log("In Menu file : ", res_id);
            const body = {restaurant_id:res_id, email_id};  // send email_id by localStorage method

            const menuDishes = await fetch('/kitchenpersonnel/ordered_dishes', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(res => {
                return res.json()
            })
            //console.log(menuDishes.ans);
            if(!menuDishes.ans){
                // Swal.fire({
                //     position: 'top-end',
                //     icon: 'error',
                //     title: 'No pending orders as of now!',
                //     showConfirmButton: false,
                //     timer: 1500
                // })
            }
            else{
                // Swal.fire({
                //     position: 'top-end',
                //     icon: 'success',
                //     title: 'Here are the pending orders',
                //     showConfirmButton: false,
                //     timer: 1500
                // })
                setResmenu(menuDishes.ans);
                console.log("ordered dishes", menuDishes.ans)
            }
            

        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getMenu();
    }, [])


      setInterval(getMenu(), 30000);


    const deliveredFun = async(e) => {
      try {

          const res_id = localStorage.getItem("resID");
          const email_id = localStorage.getItem("emailID");
          var order_id = e.currentTarget.value;
          console.log("order_id : ", order_id);
          const body = {restaurant_id:res_id, email_id, order_id};  // send email_id by localStorage method
          console.log("BoDY : ", body)

          const deliverOrder = await fetch('/kitchenpersonnel/delivered', {
              method: "PUT",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify(body)
          }).then(res => {
              return res.json()
          })
          //console.log(menuDishes.ans);
          if(deliverOrder.msg == "Updated status successfully!"){
              Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Pending orders!',
                  showConfirmButton: false,
                  timer: 1500
              })
              getMenu()
          }
          else{
              Swal.fire({
                  position: 'top-end',
                  icon: 'error',
                  title: 'An error occured',
                  showConfirmButton: false,
                  timer: 1500
              })
              
            }
      } catch (err) {
          console.error(err)
      }
  }



  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filter, setFilter] = useState("")

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterChange = (e) => {
      setFilter(e.target.value.toLowerCase());
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

//   const isSelected = (feedback_id) => selected.indexOf(feedback_id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, resmenu.length - page * rowsPerPage);
  const user_image = localStorage.getItem("user_imageK")

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

// FIREBASE
// requestFirebaseNotificationPermission()
//   .then((firebaseToken) => {
//     // eslint-disable-next-line no-console
//     console.log(firebaseToken);
//   })
//   .catch((err) => {
//     return err;
//   });


//toastify

// const notify = () => toast("Wow so easy!");

    return (
      <body style={{background:"#F2F4F3"}}>

      <Header logout={"log out"} avatar={user_image} logoutpath={"/kitchenpersonnel/login"} height={"65px"} color={"white"} color2={"#0A0908"}/> 

      <div className="row" style={{height: "200px"}}>

<div className="container text-center" style={{marginTop: "100px", marginBottom: "0px", width:"40%"}}>
      <h1 class="w3-jumbo" style={{textAlign: "center", marginTop: "0px", marginBottom: "50px", fontFamily: "Open Sans Condensed", fontSize: "100px !important", color: "#0a0908", filter: "brightness(100%)"}}>Pending Orders</h1>
      
      <h5 style={{fontFamily: "Rubik", color: "#a9927d", filter: "brightness(100%)", fontSize: "20px"}}>They say food made with love tastes the best. We say food made with a relaxed mind beats that. Welcome to your personal organiser for the day’s orders! Hope you have a great time at work.</h5>
      
</div> 
</div>

        <div className="container text-center">

<div className={classes.root}>
      <Paper className={classes.paper} style={{background:"white", fontSize:"22px", boxShadow:"0px", marginTop: "200px"}}>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={resmenu.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          style={{color:"#5e503f" ,  fontSize:"22px"}}
        />
        <EnhancedTableToolbar
            filter={filter}
            onFilterChange={handleFilterChange}
            style={{fontSize:"22px"}}
        />
        <h4 style={{color: "white"}}>{filter}</h4>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              headCells={headCells}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={resmenu.length}
              style={{color:"#DAA520" ,  fontSize:"22px"}}
            />
            <TableBody>
              {stableSort(resmenu, getComparator(order, orderBy, filter))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => { 
                    
                  //const isItemSelected = isSelected(row.feedback_id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  

                  return (
                    
                    // (row.dish_name.toLowerCase().includes(filter) || row.description.toLowerCase().includes(filter) || row.status.toLowerCase().includes(filter)) && 
        
                    <Fragment>
                        
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.order_id}
                    >
                      <TableCell padding="checkbox">
                      </TableCell>

                      <TableCell component="th" scope="row" padding="none" style={{color:"#5e503f"}}>
                        {row.order_id}
                      </TableCell>
                      <TableCell align="center" component="th" scope="row" padding="none" style={{color:"#5e503f"}}>
                        {row.dish_name}
                      </TableCell>
                      <TableCell align="center" style={{color:"#5e503f"}}>{row.dish_qty}</TableCell>
                   
                        <TableCell align="center" style={{color:"#5e503f"}}>{row.table_no}</TableCell>
                        <TableCell align="center" style={{color:"#5e503f"}}>{row.time_stamp}</TableCell>
                        <TableCell align="center" style={{color:"#5e503f"}}>{row.is_jain_wanted ? "yes" : "no"}</TableCell>
                      <TableCell align="center" > <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{width: "130px"}}
                  value = {row.order_id}
                  onClick={(e) => deliveredFun(e)}
                >Ready!</Button></TableCell>
                    </TableRow>

                    {/* <Card cardwidth={"800px"} borderradius={"5px"} h2={row.dish_qty} h3={row.time_stamp} p={row.no_of_occupants} />
                    <br/> */}
                    
                    </Fragment>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
        style={{color: "#0a0908"}}
      />
    </div>

            
        <br />
        <br />
        <br />

        <br />
        <br />
        </div>

      {/* TOAST */}
            {/* <div>
              <button onClick={notify}>Notify!</button>
              <ToastContainer />
            </div> */}

        <div ref={divRef} >
                    <Footer />
          </div>


            {/* <ToastContainer autoClose={2000} position="top-center" />
              <Navbar bg="primary" variant="dark">
                <Navbar.Brand href="#home">Firebase notifictations with React and Express</Navbar.Brand>
              </Navbar>
              <Container className="center-column">
                <Row>
                  <Col>
                    <Messaging />
                  </Col>
                </Row>
            </Container> */}


        </body>
    )
}

export default Menu
