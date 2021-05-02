import React, {Fragment, useEffect, useState} from "react"
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
// import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Button } from '@material-ui/core'

import EditInvModal from './EditInvModal'
import Lottie from 'react-lottie';
import animationData from '../../images/updateinv.json'
import Header from '../restaurantmanager/Header'
import '../stylebutton.css'

import EnhancedTableToolbar from '../restaurantmanager/EnhancedTableToolBar'
import EnhancedTableHead from '../restaurantmanager/EnhancedTableHead'
  
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
  { id: 'inventory_id', numeric: true, disablePadding: true, label: 'ID' },
  { id: 'item_name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'available_qty', numeric: false, disablePadding: false, label: 'Available Quantity' },
  { id: 'update', numeric: false, disablePadding: false, label: 'Update' },
  { id: 'delete', numeric: true, disablePadding: false, label: 'Delete' }
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
      // color: '#000000',
      // fontColor: '#000000'
    },
  }));

const UpdateInventory = () => {
    const [resmenu, setResmenu] = useState([]);
     

    const getMenu = async() => {
        try {

            const res_id = localStorage.getItem("resID");
            const email_id = localStorage.getItem("emailID");
            console.log("In Update Inventory file EMAIL ID : ", email_id);
            const body = {restaurant_id:res_id, email_id};  // send email_id by localStorage method

            const menuDishes = await fetch('/inventorymanager/view_inventory', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(res => {
                return res.json()
            })
            console.log(menuDishes.dishes);
            if(!menuDishes.dishes){
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'No Inventory for your restaurant!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            //console.log(menuDishes);
            else{
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Here is the inventory',
                    showConfirmButton: false,
                    timer: 1500
                })
                setResmenu(menuDishes.dishes);
                console.log("RESMENU", resmenu)
            }        
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getMenu();
    }, [])



  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
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

  const user_image = localStorage.getItem("user_image")

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };


    return (
      <body style={{background:"#F2F4F3"}}>

        <Header logout={"log out"} avatar={user_image} logoutpath={"/inventorymanager/login"}/>

       {/* LOTTIFILES DIV TAG */}

       <h1>Inventory update page</h1>

        

        <div className="container text-center">
            <br />
           
            <br />

<div className={classes.root}>
      <Paper className={classes.paper} style={{background:"#F2F4F3", fontSize:"22px", boxShadow:"0px", marginTop: "200px"}}>
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
                    
                  const labelId = `enhanced-table-checkbox-${index}`;
                  

                  return (
                    
                    (row.item_name.toLowerCase().includes(filter)) && 
        
                    <Fragment>
                        
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.inventory_id}
                    >
                      <TableCell padding="checkbox">
                      </TableCell>

                      <TableCell component="th" scope="row" padding="none" style={{color: "5e503f"}}>
                        {row.inventory_id}
                      </TableCell>
                      <TableCell align="center" style={{color: "5e503f"}}>{row.item_name}</TableCell>
                   
                        <TableCell align="center" style={{color: "5e503f"}}>{row.available_qty}</TableCell>
                   
                      <TableCell  align="center" style={{color: "5e503f"}}><EditInvModal row={row}/></TableCell>
                      <TableCell><Button>Delete</Button></TableCell>
                    </TableRow>
                    
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
        style={{color: "#5e503f"}}
      />
    </div>

            
        <br />
        <br />
        <br />
        {/* <EditMenuModal /> */}
        <br/>
        <br />
    
          <div className="container text-center">      
        <Link to="/inventorymanager/invhome"><button type="button" id="inventory" class="btn btn-outline-dark btn-lg">Go to Home Page</button></Link>
        </div>

        <br />
        <br />
        </div>
        </body>
    )
}

export default UpdateInventory
