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

// import './revenue.css'
import Lottie from 'react-lottie';
import animationData from '../../images/updatemenu.json'
import Header from './Header'
import Footer from './Footer'
import menuimg2 from './res_menu6.jpg'
import nonveg from './nonveg.png'
import veg from './veg.png'

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
  
//   dish_id, dish_name, description, dish_price, status, jain_availability

  const headCells = [
    { id: 'dish_id', numeric: true, disablePadding: true, label: 'ID' },
    { id: 'dish_name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
    { id: 'dish_price', numeric: false, disablePadding: false, label: 'Price' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'jain_availability', numeric: false, disablePadding: false, label: 'Jain Availability' }
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
     const divRef = useRef();

    const getMenu = async() => {
        try {

            const res_id = localStorage.getItem("resID");
            const email_id = localStorage.getItem("emailID");
            //console.log("In Menu file : ", res_id);
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
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
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


<Header logout={"log out"} avatar={user_image} logoutpath={"/restaurantmanager/login"} homepath={"/restaurantmanager/reshome"} height={"65px"} color={"white"} color2={"#0A0908"}/> 


<div className="row">
        <img src={menuimg2} style={{width: "58%", float: "left", height: "500px", background:"no repeat center fixed", backgroundSize: "cover", filter: "brightness(70%)"}} />
              <div className="container text-center" style={{marginTop: "100px", marginBottom: "100px", width:"40%"}}>
                    <h1 class="w3-jumbo" style={{textAlign: "center", marginTop: "0px", marginBottom: "50px", fontFamily: "Open Sans Condensed", fontSize: "100px !important", color: "#0a0908", filter: "brightness(100%)"}}>MENU</h1>
                    
                    <h5 style={{fontFamily: "Rubik", color: "#a9927d", filter: "brightness(100%)", fontSize: "20px"}}>An instant snapshot of a restaurant and the one piece of advertising every guest will read. Access and ensure you have an appealing, clean menu which is essential in communicating your brand. </h5>
                    
                </div>   
</div>
    
            <div className="row" style={{justifyContent: "center", marginTop: "20px"}}>
                    <i class="fas fa-ellipsis-h" style={{marginTop: "20px", filter: "brightness(90%)"}}></i>
                    <i class="fas fa-ellipsis-h" style={{marginTop: "20px", filter: "brightness(90%)"}}></i>
                    <i class="fas fa-ellipsis-h" style={{marginTop: "20px", filter: "brightness(90%)"}}></i>
                    <i class="fas fa-ellipsis-h" style={{marginTop: "20px", filter: "brightness(90%)"}}></i>
                    <i class="fas fa-ellipsis-h" style={{marginTop: "20px", filter: "brightness(90%)"}}></i>
                    <i class="fas fa-ellipsis-h" style={{marginTop: "20px", marginRight: "10px", filter: "brightness(90%)"}}></i>
                        <h2><i class="fas fa-utensils" style={{filter: "brightness(90%)", color: "#49111c"}}></i></h2>
                    <i class="fas fa-ellipsis-h" style={{marginTop: "20px", marginLeft: "10px", filter: "brightness(90%)"}}></i>
                    <i class="fas fa-ellipsis-h" style={{marginTop: "20px", filter: "brightness(90%)"}}></i>
                    <i class="fas fa-ellipsis-h" style={{marginTop: "20px", filter: "brightness(90%)"}}></i>
                    <i class="fas fa-ellipsis-h" style={{marginTop: "20px", filter: "brightness(90%)"}}></i>
                    <i class="fas fa-ellipsis-h" style={{marginTop: "20px", filter: "brightness(90%)"}}></i>
                    <i class="fas fa-ellipsis-h" style={{marginTop: "20px", filter: "brightness(90%)"}}></i>
          </div>
    
<br/>
<br/>
<br/>

        <div className="container text-center">

<div className={classes.root}>
  <br />
  <br />
  <br />


     <EnhancedTableToolbar
            filter={filter}
            onFilterChange={handleFilterChange}
        />
        <h4>{filter}</h4>           

<TablePagination
          rowsPerPageOptions={[20, 30, 50]}
          component="div"
          count={resmenu.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          style={{color:"#5e503f" ,  fontSize:"22px"}}
        />

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>



            <div className="row" style={{textAlign: "center"}}>
            <div className="col" style={{width: "40% !important", marginLeft: "20px", marginRight: "50px"}}>

                {resmenu.slice(page * (rowsPerPage), page * (rowsPerPage) + (rowsPerPage/2)).map(menu => (
                  (menu.dish_name.toLowerCase().includes(filter)) && 
               
                    <>
                        <h5 style={{textAlign: "left", letterSpacing: "0.16em", fontFamily: "Open Sans Condensed", fontSize: "30px !important", color: "#5e503f", overflow: "hidden"}}>
                            <strong>
                                {menu.dish_name} {menu.veg ? <img src={veg} style={{width: "40px", height: "40px"}} /> : <img src={nonveg} style={{width: "40px", height: "40px"}} />} ..........................................................................
                            </strong>
                        </h5>
                   
                    <h5>${menu.dish_price}</h5>
                   
                    <h6 style={{textAlign: "left", fontFamily: 'Lato, sans-serif', color: "#5e503f"}}>
                         {menu.description}
                    </h6>
                    
                    <h6 style={{textAlign: "left", fontFamily: 'Oswald,sans-serif', color: "#5e503f"}}>
                        Status : {menu.status}
                    </h6>
                    <h6 style={{textAlign: "left", fontFamily: 'Oswald,sans-serif', color: "#5e503f"}}>
                        Jain Availability : {menu.jain_availability ? 'yes' : 'no'}
                    </h6>
                    <br />
                    <br />
                    <br />
                    <br />
                    </>
                ))
            }
            </div>


                        <div className="col" style={{width: "40%"}}>

                {resmenu.slice(page * (rowsPerPage) + (rowsPerPage/2), page*(rowsPerPage) + (rowsPerPage) ).map(menu => (
               
                    (menu.dish_name.toLowerCase().includes(filter)) && 

                    <>
                        <h5 style={{textAlign: "left", letterSpacing: "0.16em", fontFamily: "Open Sans Condensed", fontSize: "30px !important", color: "#5e503f", overflow: "hidden"}}>
                            <strong>
                                {menu.dish_name} {menu.veg ? <img src={veg} style={{width: "40px", height: "40px"}} /> : <img src={nonveg} style={{width: "40px", height: "40px"}} />} ..........................................................................
                            </strong>
                        </h5>
                   
                    <h5 > ${menu.dish_price}</h5>
                    <br />
                    <h6 style={{textAlign: "left", fontFamily: 'Lato, sans-serif', color: "#5e503f"}}>
                         {menu.description}
                    </h6>
                    
                    <h6 style={{textAlign: "left", fontFamily: 'Oswald,sans-serif', color: "#5e503f"}}>
                        Status : {menu.status}
                    </h6>
                    <h6 style={{ textAlign: "left",fontFamily: 'Oswald,sans-serif', color: "#5e503f"}}>
                        Jain Availability : {menu.jain_availability ? 'yes' : 'no'}
                    </h6>
                    <br />
                    <br />
                    <br />
                    <br />
                    </>
                ))
            }
            </div>




            </div>





                {/* </tbody>
            </table> */}

    </div>

            
        <br />
        <br />
        <br />
    
          {/* <div className="container text-center">      
        <Link to="/restaurantmanager/reshome"><button type="button" id="inventory" class="btn btn-outline-dark btn-lg">Go to Home Page</button></Link>
        </div> */}

        

        <br />
        <br />
        </div>
        <div ref={divRef} >
                    <Footer />
                </div>
        </body>
    )
}

export default Menu
