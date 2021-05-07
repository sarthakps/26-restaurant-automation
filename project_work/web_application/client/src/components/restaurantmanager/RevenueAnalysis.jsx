import React, {Fragment, useEffect, useState, useRef} from "react"
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
import Footer from './Footer'


import { PureComponent } from 'react';
import {  CartesianGrid, Legend, BarChart, Bar, Cell, XAxis, YAxis, Tooltip,PieChart, Pie, Sector } from 'recharts';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Header from './Header'

import EnhancedTableToolbar from './EnhancedTableToolBar'
import EnhancedTableHead from './EnhancedTableHead'

import { Chart } from 'react-charts'

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
    { id: 'time_stamp', numeric: false, disablePadding: false, label: 'Date' },
    { id: 'final_bill', numeric: false, disablePadding: false, label: 'Bill amount' }
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
        const [date1, setDate1] = useState('');
        const [date2, setDate2] = useState('');
        const divRef = useRef();
        const info = useRef();
        var date1N = '';
        var date2N = '';

        const changeDateToISO = (marked_date) => {
          var ans = marked_date.toString();   
          var result = ans.split(" ");
          var day = result[2];
          var year = result[3];
          var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          var intMonth = parseInt(months.indexOf(result[1])) + 1;
          var month = intMonth < 10 ? '0' + intMonth.toString() : intMonth.toString();
          var result = year + '-' + month + '-' + day;

          return result;
        }
      
        const onClickHandle = () => {

          if(date1==null || date2==null){
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Please enter a proper date range',
                showConfirmButton: false,
                timer: 1500
            })
          }

          if(date1!=null && date2!=null){
            date1N = changeDateToISO(date1);
            date2N = changeDateToISO(date2);
            getRevenue();
          }
        }
        
        
    
        const getRevenue = async() => {
            try {
                const res_id = localStorage.getItem("resID");
                const body = {restaurant_id:res_id, date1N, date2N}
    
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
                console.log("revenue : ", resRevenue.ans);
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: 'Revenue Record',
                      showConfirmButton: false,
                      timer: 1500
                  })
               }  
    
            } catch (err) {
                console.error(err)
            }
        }
    
        // useEffect(() => {
        //     getRevenue();
        // }, [date1N, date2N])


  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filter, setFilter] = useState("");


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


  // const data = revenue;
  // console.log("DATA : ", revenue)


    return (
<body style={{background:"#F2F4F3"}}>
        {/* <div className="container text-center"> */}
         <Header logout={"log out"} avatar={user_image} logoutpath={"/restaurantmanager/login"} homepath={"/restaurantmanager/reshome"} height={"65px"} color={"white"} color2={"#0A0908"}/> 
            
         <div className="row">

              <div className="container text-center" style={{marginTop: "100px", marginBottom: "100px", width:"40%"}}>
                    <h1 class="w3-jumbo" style={{textAlign: "center", marginTop: "0px", marginBottom: "50px", fontFamily: "Open Sans Condensed", fontSize: "100px !important", color: "#0a0908", filter: "brightness(100%)"}}>Revenue Analysis</h1>
                    
                    <h5 style={{fontFamily: "Rubik", color: "#a9927d", filter: "brightness(100%)"}}>Analize the customer satisfaction by analyzing the feedback given by different user, organized in a form of graph, sorted by the different questions, to increase readability.</h5>
                    
              </div> 

              <div className="row" style={{textAlign: "center", marginTop: "50px", width: "50%"}}>
                <h4>From : &nbsp; &nbsp; </h4>
                      <div style={{marginTop: "15px"}}>
                        <DatePicker 
                        selected={date1} 
                        onChange={date => setDate1(date)} 
                        dateFormat='yyyy-MM-dd'
                        maxDate={new Date()}
                        isClearable
                        showYearDropdown
                        showMonthDropdown
                        scrollableMonthYearDropdown
                        /> 
                      </div>    
                      <h4> &nbsp; &nbsp; To :  &nbsp; &nbsp;</h4>
                      <div style={{marginTop: "15px", marginRight: "110px"}}>
                      <DatePicker 
                      selected={date2} 
                      onChange={date => setDate2(date)} 
                      dateFormat='yyyy-MM-dd'
                      maxDate={new Date()}
                      isClearable
                      showYearDropdown
                      showMonthDropdown
                      scrollableMonthYearDropdown
                      />
                      </div>

                    <div className="container text-center">
                      <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit123}
                  style={{width:"50px",height: "15px"}}
                  onClick={onClickHandle}
                  style={{ marginTop: "30px", marginBottom: "50px"}}
                >Apply</Button>
                </div>

                      <div>

                        {revenue ? 
                            <div>
                            <BarChart
                              width={500}
                              height={300}
                              data={revenue}
                              margin={{
                                top: 5,
                                right: 90,
                                left: -5,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time_stamp" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="final_bill" fill="#8884d8" />
                            </BarChart>      
                        </div>

                        : <h2>Please choose a date range to view the revenue</h2>

                        }
                          
                        </div>
                     
             </div>

             
       
          </div>
<br/>
<br/>
<br/>

<div className="container text-center" style={{marginBottom: "100px"}}>
              <h5>For detailed information...</h5>
              <div className="container text-center" style={{textAlign : "center"}}>
              <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={classes.submit123}
                      style={{width:"10%",height: "20px"}}
                      onClick={() => {
                        info.current.scrollIntoView({ behavior: "smooth" });
                        }}
                      style={{ marginTop: "20px"}}
                    >More Info</Button>
                </div>
            </div>


      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

        <div className="container text-center" >

<div className={classes.root} ref={info}>
      <Paper className={classes.paper}  style={{background:"white", fontSize:"22px", borderColor:"yellow"}}>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={revenue.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          style={{color:"#5e503f" ,  fontSize:"18px"}}
          
          // classes={{ul: classes.ul}}
        />
        {/* <EnhancedTableToolbar
            // onDateChange={(startDate, endDate) => onHanldeDateChange(startDate, endDate)}
            style={{color:"white", fontSize:"18px"}}
        />
        <h4>{filter}</h4> */}
        <br/>
        <br/>
  
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
            style={{color:"#DAA520", fontSize:"18px"}}
          >
            <EnhancedTableHead
              classes={classes}
              headCells={headCells}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={revenue.length}
              style={{color:"white", fontSize:"18px"}}
              
            />

            

            <TableBody style={{color:"white", fontSize:"18px"}}>
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
                      style={{color:"white", fontSize:"15px"}}
                    >
                      <TableCell padding="checkbox" style={{color:"white", fontSize:"15px"}}>
                      </TableCell>
                     
                      {/* <TableCell component="th" scope="row" padding="none align={headCell.numeric ? 'center' : 'right'}" style={{color:"#5e503f", fontSize:"15px"}}>
                        {row.bill_id}
                      </TableCell> */}
                      <TableCell align="center" style={{color:"#5e503f", fontSize:"15px"}}>{row.time_stamp}</TableCell>
                      <TableCell align="center" style={{color:"#5e503f", fontSize:"15px"}}>{row.final_bill}</TableCell>
                      
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

        <br />
        <br />
        </div>
        <div ref={divRef} >
                    <Footer />
          </div>
        </body>
    )
}

export default RevenueAnalysis;