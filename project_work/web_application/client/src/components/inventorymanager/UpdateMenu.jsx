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
// import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import EditMenuModal from './EditMenuModal'
import Lottie from 'react-lottie';
import animationData from '../../images/updatemenu.json'
import Header from '../restaurantmanager/Header'
import Footer from '../restaurantmanager/Footer'
import '../stylebutton.css'
import Button from '@material-ui/core/Button';
import menuimg2 from './menu.jpg'

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
    { id: 'dish_id', numeric: true, disablePadding: true, label: 'ID' },
    { id: 'dish_name', numeric: false, disablePadding: false, label: 'Name' },
    // { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
    { id: 'dish_price', numeric: false, disablePadding: false, label: 'Price' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    // { id: 'jain_availability', numeric: false, disablePadding: false, label: 'Jain Availability' },
    { id: 'update', numeric: false, disablePadding: false, label: 'Update Item' },
    { id: 'delete', numeric: false, disablePadding: false, label: 'Delete Item' }
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

const UpdateMenu = () => {
    const [resmenu, setResmenu] = useState([]);
      const divRef = useRef();

    const getMenu = async() => {
        try {

            const res_id = localStorage.getItem("resIDI");
            const email_id = localStorage.getItem("emailIDI");
            //console.log("In Update Menu file EMAIL ID : ", email_id);
            const body = {restaurant_id:res_id, email_id};  // send email_id by localStorage method

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
                //console.log("RESMENU", resmenu)
            }
            

        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getMenu();
    }, [])


    const deleteDish = async(e) => {
      try {

          const res_id = localStorage.getItem("resID");
          const email_id = localStorage.getItem("emailID");
          var dish_id = e.currentTarget.value;
          console.log("DISH ID : ", dish_id);
          const body = {restaurant_id:res_id, email_id, dish_id};  // send email_id by localStorage method

          const menuDishes = await fetch('/inventorymanager/menu_item', {
              method: "DELETE",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify(body)
          }).then(res => {
              return res.json()
          })
          console.log(menuDishes.msg);
          if(menuDishes.msg == "Delete successful!"){
              Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Deleted successfully!',
                  showConfirmButton: false,
                  timer: 1500
              })
              getMenu();
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
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
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

  const user_image = localStorage.getItem("user_imageI")

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


      <Header logout={"log out"} avatar={user_image} logoutpath={"/inventorymanager/login"} homepath={"/inventorymanager/invhome"} height={"65px"} color={"white"} color2={"#0A0908"}/> 
      
      
      <div className="row">
              <img src={menuimg2} style={{width: "58%", float: "left", height: "500px", background:"no repeat center fixed", backgroundSize: "cover", filter: "brightness(70%)"}} />
                    <div className="container text-center" style={{marginTop: "100px", marginBottom: "100px", width:"40%"}}>
                          <h1 class="w3-jumbo" style={{textAlign: "center", marginTop: "0px", marginBottom: "50px", fontFamily: "Open Sans Condensed", fontSize: "100px !important", color: "#0a0908", filter: "brightness(100%)"}}>Update Menu</h1>
                          
                          <h5 style={{fontFamily: "Rubik", color: "#a9927d", filter: "brightness(100%)", fontSize: "20px"}}>Out of ingredients and can???t serve a particular dish? Fear not! Keep your Menu updated without any hassle and never let your customers down.
                          </h5>
                          
                      </div>   
      </div>



        <div className="container text-center">     
           
<div className={classes.root}>
      <Paper className={classes.paper} style={{background:"white", fontSize:"22px", boxShadow:"0px", marginTop: "200px"}}>
      <TablePagination
          rowsPerPageOptions={[25, 50, 75]}
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
                    
                    (row.dish_name.toLowerCase().includes(filter) || row.description.toLowerCase().includes(filter) || row.status.toLowerCase().includes(filter)) && 
        
                    <Fragment>
                        
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.dish_id}
                      style={{color:"#F2F4F8"}}
                    >
                      <TableCell padding="checkbox">
                      </TableCell>

                      <TableCell component="th" scope="row" padding="none" style={{color:"#5e503f"}}>
                        {row.dish_id}
                      </TableCell>
                      <TableCell align="center" style={{color:"#5e503f", fontSize: "16px"}}>{row.dish_name}</TableCell>
{/*                    
                        <TableCell align="center" style={{color:"#5e503f", fontSize: "16px"}}>{row.description}</TableCell>
                    */}
                      <TableCell align="center" style={{color:"#5e503f", fontSize: "16px"}}>${row.dish_price}</TableCell>
                      <TableCell align="center" style={{color:"#5e503f", fontSinze: "16px"}}>{row.status}</TableCell>
                      {/* <TableCell align="center" style={{color:"#5e503f", fontSize: "16px"}}>{row.jain_availability ? 'yes' : 'no'}</TableCell> */}
                      <TableCell><EditMenuModal row={row}/></TableCell>
                      <TableCell>
                        <Button
                          type="submit"
                          variant="outlined" color="secondary"
                          style={{width: "130px"}}
                          value={row.dish_id}
                          onClick={(e) => deleteDish(e)}
                        >Delete</Button>
                      </TableCell>
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
        style={{color: "#0a0908"}}
      />
    </div>

            
        <br />
        <br />
        <br />
        <br/>
        <br />
  
        <br />
        <br />
        </div>

                <div ref={divRef} >
                    <Footer />
                </div>

        </body>
    )
}

export default UpdateMenu
