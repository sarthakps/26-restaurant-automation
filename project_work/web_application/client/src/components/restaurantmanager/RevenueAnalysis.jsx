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
import './revenue.css'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { RangeDatePicker } from 'react-google-flight-datepicker';
import 'react-google-flight-datepicker/dist/main.css';


// const WhiteBorderTextField = styled(TextField)`
//   & label.Mui-focused {
//     color: white;
//   }
//   & .MuiOutlinedInput-root {
//     &.Mui-focused fieldset {
//       border-color: white;
//     }
//   }
// `;

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
  
  function EnhancedTableHead(props) {
    const { classes, order, orderBy, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow style={{color:"white"}}>
          <TableCell padding="checkbox" style={{color:"white", fontSize:"20px"}}>
            {/* <Checkbox
            //   indeterminate={numSelected > 0 && numSelected < rowCount}
            //   checked={rowCount > 0 && numSelected === rowCount}
            //   onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all feedbacks' }}
            /> */}
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'center' : 'right'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{color:"white", fontSize:"18px", paddingTop: "80px"}}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                style={{color:"white"}}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  
  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    // numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    // onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  

  // const theme2 = createMuiTheme({
  //   palette: {
  //     primary: {
  //       light: lightGreen[300],
  //       main: lightGreen[500],
  //       dark: lightGreen[700]
  //     },
  //     secondary: {
  //       light: blueGrey[300],
  //       main: blueGrey[500],
  //       dark: blueGrey[700]
  //     }
  //   }
  // });


  const useToolbarStyles = makeStyles((theme, theme2) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
      border: 'solid 3px #0ff',
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
    searchContainer: {
        display: "flex",
        backgroundColor: fade(theme.palette.secondary.light, 0.05),
        paddingLeft: "20px",
        paddingRight: "20px",
        marginTop: "5px",
        marginBottom: "5px",
      },
      searchIcon: {
        alignSelf: "flex-end",
        marginBottom: "15px",
      },
      searchInput: {
        width: "200px",
        margin: "15px",
        color: "white"
      },
  }));
  
 

  const EnhancedTableToolbar = (props) => {
    const {onFilterChange, filter, date1, date2, setDate1, setDate2, onDateChange } = props;
    const classes = useToolbarStyles();
    //const [value, onChange] = useState([new Date(), new Date()]);
    
    

// const handleSearchChange = (e) => {
//         setFilter(e.target.value);
//     };
    // const { numSelected } = props;
  
    return (
        <Fragment>
        <Toolbar style={{color:"white"}}>
            {/* <div className={classes.searchContainer} style={{color:"white"}}>
                <SearchIcon className={classes.searchIcon} style={{color:"white"}}/>
                <TextField className={classes.searchInput}
                    onChange={onFilterChange}
                    label="search revenue"
                    varient="standard"
                    InputProps={{
                      classes: {
                          input: classes.multilineColor
                      }
                  }}
                />
            </div> */}
            <p style={{paddingRight:"20px"}}>choose a range : - </p>
            {/* <DateRangePicker
              onChange={onChange}
              value={value}
              style={{color: "white"}}
            /> */}
            <RangeDatePicker
              startDate={new Date()}
              endDate={new Date()}
              onChange={(startDate, endDate) => onDateChange(startDate, endDate)}
              // onChange={onDateChange}
              minDate={new Date(1900, 0, 1)}
              maxDate={new Date(2100, 0, 1)}
              dateFormat="D"
              monthFormat="MMM YYYY"
              startDatePlaceholder="Start Date"
              endDatePlaceholder="End Date"
              disabled={false}
              className="my-own-class-name"
              startWeekDay="monday"
            />
        </Toolbar>
      <Toolbar>
        
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div" style={{color:"white", fontSize:"30px", marginTop:"50px"}}>
            Revenue Analysis
          </Typography>     
      </Toolbar>
      </Fragment>
    );
  };
  
//   EnhancedTableToolbar.propTypes = {
//     // numSelected: PropTypes.number.isRequired,
//   };
  
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

  // const handleFilterChange = (e) => {
  //     setFilter(e.target.value.toLowerCase());
  // };

  const handleClick = (event, feedback_id) => {
    const selectedIndex = selected.indexOf(feedback_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, feedback_id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
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


    return (
      <body  style={{background:"#0a0908"}}>
        <div className="container text-center" >
            <br />
            <div class="w3-container w3-tangerine">
              <p class="w3-jumbo">Revenue Analysis</p>
            </div>
            
            <br />

<div className={classes.root} >
      <Paper className={classes.paper}  style={{background:"#0a0908", fontSize:"22px"}}>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={revenue.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          style={{color:"white" ,  fontSize:"22px"}}
          
          // classes={{ul: classes.ul}}
        />
        <EnhancedTableToolbar
            // filter={filter}
            // onFilterChange={handleFilterChange}
            // startDate={new Date()}
            // endDate={new Date()}
            onDateChange={(startDate, endDate) => onHanldeDateChange(startDate, endDate)}
            style={{color:"white", fontSize:"22px"}}
        />
        {/* <h4>{filter}</h4> */}
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
            style={{color:"white", fontSize:"22px"}}
          >
            <EnhancedTableHead
              classes={classes}
            //   numSelected={selected.length}
              order={order}
              orderBy={orderBy}
            //   onSelectAllClick={handleSelectAllClick}
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
                      onClick={(event) => handleClick(event, row.bill_id)}
                      role="checkbox"
                    //   aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.bill_id}
                      style={{color:"white", fontSize:"22px"}}
                    //   selected={isItemSelected}
                    >
                      <TableCell padding="checkbox" style={{color:"white", fontSize:"22px"}}>
                        {/* <Checkbox
                        //   checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        /> */}
                        
                      </TableCell>
                     
                      <TableCell component="th" scope="row" padding="none align={headCell.numeric ? 'center' : 'right'}" style={{color:"white", fontSize:"20px"}}>
                        {row.bill_id}
                      </TableCell>
                      <TableCell align="right" style={{color:"white", fontSize:"20px"}}>{row.table_no}</TableCell>
                      <TableCell align="right" style={{color:"white", fontSize:"20px"}}>{row.no_of_occupants}</TableCell>
                      <TableCell align="right" style={{color:"white", fontSize:"20px"}}>{row.final_bill}</TableCell>
                      <TableCell align="right" style={{color:"white", fontSize:"20px"}}>{row.time_stamp}</TableCell>
                    </TableRow>
                    
                    </Fragment>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows , color: "white"}}>
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
    
        <Link to="/restaurantmanager/reshome"><button type="button" class="btn btn-outline-dark">Go to Home Page</button></Link>
        {/* <button className="goback"><span>Go to Main page</span></button> */}

        <br />
        <br />
        </div>
        </body>
    )
}

export default RevenueAnalysis;
