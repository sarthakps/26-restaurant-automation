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
// import FilterListIcon from '@material-ui/icons/FilterList';
// import SearchIcon from '@material-ui/icons/Search';
// import TextField from '@material-ui/core/TextField';
// import blueGrey from "@material-ui/core/colors/blueGrey";
// import lightGreen from "@material-ui/core/colors/lightGreen";
// import Button from '@material-ui/core/Button';

import EnhancedTableHead from './EnhancedTableHead'
import EnhancedTableToolbar from './EnhancedTableToolBar'
  
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
  

  // function EnhancedTableHead(props) {
  //   const { classes, order, orderBy, rowCount, onRequestSort } = props;
  //   const createSortHandler = (property) => (event) => {
  //     onRequestSort(event, property);
  //   };
  
  //   return (
  //     <TableHead>
  //       <TableRow>
  //         <TableCell padding="checkbox">
  //         </TableCell>
  //         {headCells.map((headCell) => (
  //           <TableCell
  //             key={headCell.id}
  //             align={headCell.numeric ? 'left' : 'right'}
  //             padding={headCell.disablePadding ? 'none' : 'default'}
  //             sortDirection={orderBy === headCell.id ? order : false}
  //           >
  //             <TableSortLabel
  //               active={orderBy === headCell.id}
  //               direction={orderBy === headCell.id ? order : 'asc'}
  //               onClick={createSortHandler(headCell.id)}
  //             >
  //               {headCell.label}
  //               {orderBy === headCell.id ? (
  //                 <span className={classes.visuallyHidden}>
  //                   {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
  //                 </span>
  //               ) : null}
  //             </TableSortLabel>
  //           </TableCell>
  //         ))}
  //       </TableRow>
  //     </TableHead>
  //   );
  // }
  
  // EnhancedTableHead.propTypes = {
  //   classes: PropTypes.object.isRequired,
  //   // numSelected: PropTypes.number.isRequired,
  //   onRequestSort: PropTypes.func.isRequired,
  //   // onSelectAllClick: PropTypes.func.isRequired,
  //   order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  //   orderBy: PropTypes.string.isRequired,
  //   rowCount: PropTypes.number.isRequired,
  // };


  // const useToolbarStyles = makeStyles((theme, theme2) => ({
  //   root: {
  //     paddingLeft: theme.spacing(2),
  //     paddingRight: theme.spacing(1),
  //   },
  //   highlight:
  //     theme.palette.type === 'light'
  //       ? {
  //           color: theme.palette.secondary.main,
  //           backgroundColor: lighten(theme.palette.secondary.light, 0.85),
  //         }
  //       : {
  //           color: theme.palette.text.primary,
  //           backgroundColor: theme.palette.secondary.dark,
  //         },
  //   title: {
  //     flex: '1 1 100%',
  //   },
  //   searchContainer: {
  //       display: "flex",
  //       backgroundColor: fade(theme.palette.secondary.light, 0.05),
  //       paddingLeft: "20px",
  //       paddingRight: "20px",
  //       marginTop: "5px",
  //       marginBottom: "5px",
  //     },
  //     searchIcon: {
  //       alignSelf: "flex-end",
  //       marginBottom: "15px",
  //     },
  //     searchInput: {
  //       width: "200px",
  //       margin: "15px",
  //     },
  // }));
   

//   const EnhancedTableToolbar = (props) => {
//     const {onFilterChange, filter } = props;
//     const classes = useToolbarStyles();
    

// // const handleSearchChange = (e) => {
// //         setFilter(e.target.value);
// //     };
//     // const { numSelected } = props;
  
//     return (
//         <Fragment>
//         <Toolbar>
//             <div className={classes.searchContainer}>
//                 <SearchIcon className={classes.searchIcon}/>
//                 <TextField className={classes.searchInput}
//                     onChange={onFilterChange}
//                     label="search menu"
//                     varient="standard"
//                 />
//             </div>
//         </Toolbar>
//       <Toolbar>
        
//           <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
//             Menu
//           </Typography>     
//       </Toolbar>
//       </Fragment>
//     );
//   };
  
//   EnhancedTableToolbar.propTypes = {
//     // numSelected: PropTypes.number.isRequired,
//   };
  
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

    const getAttendance = async () => {
        try {
            const restaurant_id = localStorage.getItem("resID");
            const body = {restaurant_id};

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

        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        getAttendance();
    }, [])


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

  // const handleClick = (event, feedback_id) => {
  //   const selectedIndex = selected.indexOf(feedback_id);
  //   let newSelected = [];

  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, feedback_id);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1),
  //     );
  //   }

  //   setSelected(newSelected);
  // };

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


    return (
        <div className="container text-center">
            <br />
            <h1>Employees' Attendance</h1>
            <br />

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
                      <TableCell align="right">{row.user_name}</TableCell>
                   
                        <TableCell align="right">{row.time_stamp}</TableCell>
                   
                      <TableCell align="right">{row.attendance_status ? 'present' : 'absent'}</TableCell>
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
    
        <Link to="/restaurantmanager/reshome"><button type="button" class="btn btn-outline-dark">Go to Home Page</button></Link>

        <br />
        <br />
        </div>
    )
}

export default Attendance
