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
import EnhancedTableHead from './EnhancedTableHead'
import EnhancedTableToolbar from './EnhancedTableToolBar'

import Button from '@material-ui/core/Button';
import Header from './Header'
import Footer from './Footer'
import { PureComponent } from 'react';
import {  CartesianGrid, Legend, BarChart, Bar, Cell, XAxis, YAxis, Tooltip,PieChart, Pie, Sector } from 'recharts';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

  
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
    { id: 'user_id', numeric: true, disablePadding: true, label: 'ID' },
    { id: 'user_name', numeric: false, disablePadding: false, label: 'User Name' },
    { id: 'time_stamp', numeric: false, disablePadding: false, label: 'TimeStamp' },
    { id: 'attedance_status', numeric: false, disablePadding: false, label: 'Attendance Status' },
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

const Attendance = () => {
    const [resatten, setResatten] = useState([]);
    const divRef = useRef();
    const info = useRef();
        const [date1, setDate1] = useState('');
        const [date2, setDate2] = useState('');
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
            getAttendance();
          }
        }


    const getAttendance = async () => {
        try {
            const restaurant_id = localStorage.getItem("resID");
            const email_id = localStorage.getItem("emailID");
            const body = {restaurant_id, date1N, date2N, email_id};
            //console.log("BODY : ", body)

            const atten = await fetch("/restaurantmanager/view_attendance", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(res => {
                return res.json()
            })
            //const jsonData = await atten.json();
            //console.log(jsonData)
            setResatten(atten)

            if(atten){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Attendance Record',
                showConfirmButton: false,
                timer: 1500
            });
            info.current.scrollIntoView({ behavior: "smooth" });
            }
          
            else{
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'No attendance record for this date range!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }

        } catch (err) {
            console.error(err.message)
        }
    }

    // useEffect(() => {
    //     getAttendance();
    // }, [])


  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  // const [selected, setSelected] = React.useState([]);
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, resatten.length - page * rowsPerPage);
  const user_image = localStorage.getItem("user_image")

    return (

      <body style={{background:"#F2F4F3"}}>
        
        <Header logout={"log out"} avatar={user_image} logoutpath={"/restaurantmanager/login"} homepath={"/restaurantmanager/reshome"} height={"65px"} color={"white"} color2={"#0A0908"}/> 
            
        <div className="row">

<div className="container text-center" style={{marginTop: "100px", marginBottom: "100px", width:"40%"}}>
      <h1 class="w3-jumbo" style={{textAlign: "center", marginTop: "0px", marginBottom: "50px", fontFamily: "Open Sans Condensed", fontSize: "100px !important", color: "#0a0908", filter: "brightness(100%)"}}>View Attendance Record</h1>
      
      <h5 style={{fontFamily: "Rubik", color: "#a9927d", filter: "brightness(100%)", fontSize: "20px"}}>Without proper records, it can be difficult, if not impossible, to effectively monitor performance and productivity levels. Analyse the attendance records of your team through this simple and effective functionality. </h5>
      
</div> 

<div className="row" style={{textAlign: "center", marginTop: "150px", width: "50%"}}>
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
    
    onClick={onClickHandle}
    // onClick={() => {
    //   info.current.scrollIntoView({ behavior: "smooth" });
    //   }}
    style={{ marginTop: "-130px", marginBottom: "50px"}}
  >Apply</Button>
  </div>

        <div>
            
          </div>
       
</div>



</div>

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

        <div className="container text-center">

<div className={classes.root} ref={info}>
      <Paper className={classes.paper}>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={resatten.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <EnhancedTableToolbar
            filter={filter}
            onFilterChange={handleFilterChange}
        />
        <h4>{filter}</h4>

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
              rowCount={resatten.length}
            />

            
            <TableBody>
              {stableSort(resatten, getComparator(order, orderBy, filter))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => { 
      
                  const labelId = `enhanced-table-checkbox-${index}`;
                  

                  return (
                    
                    (row.user_name.toLowerCase().includes(filter) || row.time_stamp.toLowerCase().includes(filter)) && 
        
                    <Fragment>
                        
                    <TableRow
                      hover
                      // onClick={(event) => handleClick(event, row.user_id)}
                      role="checkbox"
                      tabIndex={-1}
                      key={row.user_id}
                    >
                      <TableCell padding="checkbox">
                      </TableCell>

                      <TableCell component="th" scope="row" padding="none">
                        {row.user_id}
                      </TableCell>
                      <TableCell align="center">{row.user_name}</TableCell>
                   
                        <TableCell align="center">{row.time_stamp}</TableCell>
                   
                      <TableCell align="center">{row.attendance_status ? 'present' : 'absent'}</TableCell>
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
      />
    </div>         
        <br />
        <br />
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

export default Attendance
