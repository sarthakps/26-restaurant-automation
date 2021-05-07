import React, {Fragment, useEffect, useState, useRef, PureComponent} from "react"
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
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from '@material-ui/core/Button';

import Footer from './Footer'
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
// import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import blueGrey from "@material-ui/core/colors/blueGrey";
import lightGreen from "@material-ui/core/colors/lightGreen";

import EnhancedTableToolbar from './EnhancedTableToolBar'
import EnhancedTableHead from './EnhancedTableHead'
import Header from './Header'

  
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
  
  const headCells = [
    { id: 'feedback_id', numeric: true, disablePadding: true, label: 'ID' },
    { id: 'bill_id', numeric: false, disablePadding: false, label: 'Bill ID' },
    { id: 'question', numeric: false, disablePadding: false, label: 'Question' },
    { id: 'score', numeric: false, disablePadding: false, label: 'Score' }
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

const FeedbackAnalysis = () => {
    const [feedback, setFeedback] = useState([]);
    const [avgfeedback, setAvgFeedback] = useState([]);
     const divRef = useRef();
     const info = useRef();

    const getFeedback = async() => {
        try {
            const restaurant_id = localStorage.getItem("resID");
            const body = {restaurant_id};
            //console.log("HELLOOOO");
            const resFeedback = await fetch('/restaurantmanager/feedback', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }).then(res => {
                return res.json();
            });

            console.log("OUTPUT : ", resFeedback.final_ans);
            if(resFeedback.final_ans.length > 0){
                setFeedback(resFeedback.final_ans)
                //setAvgfeed(resFeedback.length)
            }
            else{
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'No feedbacks for your restaurant yet!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }

        } catch (err) {
            console.error(err)
        }
    }


    const getAvgFeedback = async() => {
        try {
            const restaurant_id = localStorage.getItem("resID");
            const body = {restaurant_id};
            //console.log("HELLOOOO");
            const resFeedback = await fetch('/restaurantmanager/avg_feedback', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }).then(res => {
                return res.json();
            });

            console.log("AVG FEEDBACK : ", resFeedback);
            if(resFeedback.length > 0){
                setAvgFeedback(resFeedback)
                //setAvgfeed(resFeedback.length)
            }
            else{
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'No feedbacks for your restaurant yet!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }

        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getAvgFeedback(); 
        getFeedback();
    }, [])

  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('category1');
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

  const handleFeedbackChange = (e) => {
      setFilter(e.target.value);
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, feedback.length - page * rowsPerPage);


    return (
        <div className="container text-center">
            <br />
            <h1>Feedback Analysis Page</h1>
            <br />

<div className={classes.root}>
      <Paper className={classes.paper}>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={feedback.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <EnhancedTableToolbar
            filter={filter}
            onFilterChange={handleFeedbackChange}
        />
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
              rowCount={feedback.length}
            />
            <TableBody>
              {stableSort(feedback, getComparator(order, orderBy, filter))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => { 
                    
                  //const isItemSelected = isSelected(row.feedback_id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (

                    (row.category1.includes(filter) || row.category2.includes(filter) || row.category3.includes(filter) || row.category4.includes(filter)) && 

                    <TableRow
                      hover
                      role="checkbox"
                    //   aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.feedback_id}
                    //   selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        {/* <Checkbox
                        //   checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        /> */}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {row.feedback_id}
                      </TableCell>
                      <TableCell align="right">{row.category1}</TableCell>
                      <TableCell align="right">{row.category2}</TableCell>
                      <TableCell align="right">{row.category3}</TableCell>
                      <TableCell align="right">{row.category4}</TableCell>
                    </TableRow>
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
    
        <Link to="/restaurantmanager/reshome"><button type="button" class="btn btn-outline-dark">Go to Home Page</button></Link>

        <br />
        <br />
        </div>
    )
}

export default FeedbackAnalysis
