import React, {Fragment, useEffect, useState} from "react"
import {BrowserRouter as Router, Route, Link, Redirect, useRouteMatch } from "react-router-dom"
import Swal from "sweetalert2";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { MuiThemeProvider, createMuiTheme, fade, lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
// import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
// import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
// import styled from "styled-components";
import TextField from '@material-ui/core/TextField';
import blueGrey from "@material-ui/core/colors/blueGrey";
import lightGreen from "@material-ui/core/colors/lightGreen";
import Button from '@material-ui/core/Button';
// import './revenue.css'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { RangeDatePicker } from 'react-google-flight-datepicker';
import 'react-google-flight-datepicker/dist/main.css';

import Lottie from 'react-lottie';
import animationData from '../../images/updatemenu.json'
import Header from './Header'

import EnhancedTableToolbar from './EnhancedTableToolBar'
import EnhancedTableHead from './EnhancedTableHead'

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
  
//   bill_id, table_no, no_of_occupants, final_bill, time_stamp

  const headCells = [
    { id: 'bill_id', numeric: true, disablePadding: true, label: 'ID' },
    { id: 'table_no', numeric: false, disablePadding: false, label: 'Table Number' },
    { id: 'no_of_occupants', numeric: false, disablePadding: false, label: 'Number of occupants' },
    { id: 'final_bill', numeric: false, disablePadding: false, label: 'Bill amount' },
    { id: 'time_stamp', numeric: true, disablePadding: false, label: 'Date' }
  ];
  
  
  const useStyles = makeStyles((theme) => ({
    multilineColor:{
      color:'red'
  },
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
    ul: {
      "& .MuiPaginationItem-root": {
        color: '#ffffff !important'
      }
    }
  }));

const RevenueAnalysis = () => {
        const [revenue, setRevenue] = useState([]);
        
    
        const getRevenue = async() => {
            try {
                const res_id = localStorage.getItem("resID");
                const body = {restaurant_id:res_id}
    
                const resRevenue = await fetch('/restaurantmanager/revenue', {
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body)
                }).then(res => {
                    return res.json();
                })

               if(resRevenue.msg == "some error"){
                    Swal.fire({
                      position: 'top-end',
                      icon: 'error',
                      title: 'No revenue record for today!',
                      showConfirmButton: false,
                      timer: 1500
                  })
               }

               else{
                //console.log("resRevenue.ans", resRevenue.ans);
                setRevenue(resRevenue.ans);
                //console.log("state revenue : ", revenue);
               }  
    
            } catch (err) {
                console.error(err)
            }
        }
    
        useEffect(() => {
            getRevenue();
        }, [])


  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filter, setFilter] = useState("");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");


        const onHanldeDateChange = async (startDate, endDate) => { 
          var one = new Date(startDate).toISOString();
          var one1 = one.split("T");
          var two = new Date(endDate).toISOString();
          var two1 = two.split("T");
          setDate1(one1[0]);
          setDate2(two1[0]);
          console.log(one1[0]);
          console.log(two1[0]);
          //console.log("DATE1 : ", date1);
          //console.log("DATE2 : ", date2);
        }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, revenue.length - page * rowsPerPage);

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
      <body  style={{background:"#F2F4F3"}}>

<Header logout={"log out"} avatar={user_image} logoutpath={"/inventorymanager/login"} height={"65px"} color={"white"} color2={"#0A0908"}/> 

<div style={{height: "250px", backgroundColor: "#0A0908", paddingTop: "1px"}}>
        <Lottie 
                options={defaultOptions}
                  height={310}
                  width={310}
                  style={{float: "left", marginLeft: "5%", marginTop: "3%"}}
                />

<h1 style={{fontFamily: "font-family:Georgia, 'Times New Roman', Times, serif", letterSpacing: "0.10em", color: "#F2F4F8", fontSize: "50px", paddingTop: "10%", paddingLeft: "40%"}}>Revenue Analysis</h1>
</div>

        <div className="container text-center" >
           
<br/>
<br/>
<br/>
<div className={classes.root} >
      <Paper className={classes.paper}  style={{background:"white", fontSize:"22px", borderColor:"yellow"}}>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={revenue.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          style={{color:"#5e503f" ,  fontSize:"22px"}}
          
          // classes={{ul: classes.ul}}
        />
        <EnhancedTableToolbar
            onDateChange={(startDate, endDate) => onHanldeDateChange(startDate, endDate)}
            style={{color:"white", fontSize:"22px"}}
        />
        <h4>{filter}</h4>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
            style={{color:"#DAA520", fontSize:"22px"}}
          >
            <EnhancedTableHead
              classes={classes}
              headCells={headCells}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={revenue.length}
              style={{color:"white", fontSize:"22px"}}
              
            />
            <TableBody style={{color:"white", fontSize:"22px"}}>
              {stableSort(revenue, getComparator(order, orderBy, filter))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => { 
                    
                  //const isItemSelected = isSelected(row.feedback_id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  

                  return (
        
                    <Fragment>
                        
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.bill_id}
                      style={{color:"white", fontSize:"22px"}}
                    >
                      <TableCell padding="checkbox" style={{color:"white", fontSize:"22px"}}>
                      </TableCell>
                     
                      <TableCell component="th" scope="row" padding="none align={headCell.numeric ? 'center' : 'right'}" style={{color:"#5e503f", fontSize:"20px"}}>
                        {row.bill_id}
                      </TableCell>
                      <TableCell align="right" style={{color:"#5e503f", fontSize:"20px"}}>{row.table_no}</TableCell>
                      <TableCell align="right" style={{color:"#5e503f", fontSize:"20px"}}>{row.no_of_occupants}</TableCell>
                      <TableCell align="right" style={{color:"#5e503f", fontSize:"20px"}}>{row.final_bill}</TableCell>
                      <TableCell align="right" style={{color:"#5e503f", fontSize:"20px"}}>{row.time_stamp}</TableCell>
                    </TableRow>
                    
                    </Fragment>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows , color: "#5e503f"}}>
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
      />
    </div>

            
        <br />
        <br />
        <br />
        <br/>
        <br/>
    
        <div className="container text-center">      
        <Link to="/restaurantmanager/reshome"><button type="button" id="inventory" class="btn btn-outline-dark btn-lg">Go to Home Page</button></Link>
        </div>
        {/* <button className="goback"><span>Go to Main page</span></button> */}

        <br />
        <br />
        </div>
        </body>
    )
}

export default RevenueAnalysis;
