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
    { id: 'order_id', numeric: true, disablePadding: true, label: 'ID' },
    { id: 'dish_qty', numeric: false, disablePadding: false, label: 'Dish Quantity' },
    { id: 'table_no', numeric: false, disablePadding: false, label: 'Table No.' },
    { id: 'Time', numeric: false, disablePadding: false, label: 'Time of Order' },
    { id: 'no_of_occupants', numeric: false, disablePadding: false, label: 'No. of Occupants' }
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
     

    const getMenu = async() => {
        try {

            const res_id = localStorage.getItem("resID");
            const email_id = localStorage.getItem("emailID");
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
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'No pending orders as of now!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            else{
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Here are the pending orders',
                    showConfirmButton: false,
                    timer: 1500
                })
                setResmenu(menuDishes.ans);
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


    return (
      <body style={{background:"white"}}>
        <div className="container text-center">
            <br />
            <h1 style={{color:"black", fontFamily: "caviar_dreamsbold,sans-serif", letterSpacing: "0.16em", fontSize: "60px"}}>Pending Orders Page</h1>
            <br />

<div className={classes.root}>
      <Paper className={classes.paper} style={{background:"white", fontSize:"22px"}}>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={resmenu.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          style={{color:"black" ,  fontSize:"22px"}}
        />
        <EnhancedTableToolbar
            filter={filter}
            onFilterChange={handleFilterChange}
            style={{fontColor:"white" ,  fontSize:"22px"}}
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
              rowCount={resmenu.length}
              style={{color:"white" ,  fontSize:"22px"}}
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
                    //   aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.order_id}
                    //   selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        {/* <Checkbox
                        //   checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        /> */}
                      </TableCell>

                      <TableCell component="th" scope="row" padding="none">
                        {row.order_id}
                      </TableCell>
                      <TableCell align="center">{row.dish_qty}</TableCell>
                   
                        <TableCell align="center">{row.table_no}</TableCell>
                        <TableCell align="center">{row.time_stamp}</TableCell>
                      <TableCell align="center">{row.no_of_occupants}</TableCell>
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
    
          <div className="container text-center">      
        <Link to="/kitchenpersonnel/login"><button type="button" class="btn btn-outline-dark">LogOut</button></Link>
        </div>

        <br />
        <br />
        </div>
        </body>
    )
}

export default Menu
