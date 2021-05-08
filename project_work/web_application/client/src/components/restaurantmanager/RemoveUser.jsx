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
import { Button, Avatar } from '@material-ui/core'
// import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import EnhancedTableHead from './EnhancedTableHead'
import EnhancedTableToolbar from './EnhancedTableToolBar'

import Header from './Header'
import Footer from './Footer'
  
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
    { id: 'user_image', numeric: true, disablePadding: true, label: 'user Image' },
    { id: 'user_id', numeric: false, disablePadding: true, label: 'ID' },
    { id: 'user_name', numeric: false, disablePadding: false, label: 'User Name' },
    { id: 'usertype_id', numeric: false, disablePadding: false, label: 'User Type' },
    { id: 'remove_user', numeric: false, disablePadding: false, label: 'Remove User' },
    // { id: 'attedance_status', numeric: false, disablePadding: false, label: 'Attendance Status' },
    // { id: 'mark_flag', numeric: false, disablePadding:false, label: 'Mark Attendance'}
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

const RemoveUser = () => {
    const [resatten, setResatten] = useState([]);
    const divRef = useRef();

    const getUsers = async () => {
        try {
            const restaurant_id = localStorage.getItem("resID");
            const email_id = localStorage.getItem("emailID");
            const body = {restaurant_id, email_id};
            console.log("BODY : ", body)

            const atten = await fetch("/restaurantmanager/allusers", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(res => {
                return res.json()
            })
            console.log(atten.users)
            setResatten(atten.users)

            console.log("statuss", atten)

        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        getUsers();
    }, [])


  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  // const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filter, setFilter] = useState("");


    const removeUserFun = async(e) => {
        try {
          console.log("USER ID", user_id)
            const restaurant_id = localStorage.getItem("resID");
            const email_id = localStorage.getItem("emailID")
            var user_id = e.currentTarget.value;
            
            const body = {user_id, restaurant_id, email_id};

            const mark = await fetch("/restaurantmanager/delete_staff", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            }).then(res => {
                return res.json()
            })
            //const jsonData = await atten.json();
            console.log(mark.msg)

            if(mark.msg == "Deleted successfully!"){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Deleted user successfully',
                showConfirmButton: false,
                timer: 1500
            })
            getUsers();
          }
                
            else{
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Something went wrong!',
                showConfirmButton: false,
                timer: 1500
            })
          }
            

        } catch (err) {
            console.error(err.message)
        }
    }

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
                 <h1 class="w3-jumbo" style={{textAlign: "center", marginTop: "0px", marginBottom: "50px", fontFamily: "Open Sans Condensed", fontSize: "100px !important", color: "#0a0908", filter: "brightness(100%)"}}>Remove a User</h1>
                 
                 <h5 style={{fontFamily: "Rubik", color: "#a9927d", filter: "brightness(100%)", fontSize: "20px"}}>We’re sorry to hear them leave. Nevertheless wishing them the best. Drop their details out from the list below.</h5>
                 
           </div> 
       </div>
        
        
        <div className="container text-center">
          

<div className={classes.root}>
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
                    
                    (row.user_name.toLowerCase().includes(filter)) && 
        
                    <Fragment>
                        
                    <TableRow
                      hover
                    //   onClick={(event) => handleClick(event, row.user_id)}
                      role="checkbox"
                      tabIndex={-1}
                      key={row.user_id}
                    >
                      <TableCell padding="checkbox">
                      </TableCell>

                      <TableCell component="th" scope="row" padding="10px">
                        <Avatar 
                          alt = "USER"
                          src={row.user_image} 
                          style={{
                              width: "80px",
                              height: "80px",
                          }} 
                          />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {row.user_id}
                      </TableCell>
                      <TableCell align="center">{row.user_name}</TableCell>
                   
                        <TableCell align="center">{row.usertype_id}</TableCell>

                       <TableCell align="center"><Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={classes.submit123} 
                      value={row.user_id} 
                      onClick={(e) => removeUserFun(e)}
                    >Remove</Button></TableCell>

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

export default RemoveUser
