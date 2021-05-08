import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import {Button, Avatar} from '@material-ui/core';
import {BrowserRouter as Router, Route, Link, Redirect, useRouteMatch } from "react-router-dom"

import sample from '../sample5.jfif'


function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));
 

export default function HideAppBar({props, login, logout, avatar, subscription, logoutpath, homepath, height, color, color2}) {
    const classes = useStyles();

    const divRefmid = useRef();

    function handleScroll() {
      window.scroll({
        top: document.body.offsetHeight,
        left: 0, 
        behavior: 'smooth',
      });
    }

  return (

    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props} style={{color: color}}>
        <AppBar  style={{backgroundColor: color, height:height}}>
          <Toolbar>
          <Typography variant="h6" className={classes.title} style={{color: color2}}>
            <img src={sample} style={{height: "50px", width: "180px", float: "left"}}/>
          </Typography>

          

          {homepath ? <Link to={homepath}><Button color="inherit" style={{color: color2}}>Home</Button></Link> : ""}

          <Button color="inherit" style={{color: color2}} onClick={handleScroll}>About us</Button> 

            {logout? <Link to={logoutpath}><Button color="inherit" style={{color: color2, marginRight: "20px"}}>{logout}</Button></Link> : ""}
            
            {subscription ? <Button color="inherit" style={{color: color2, marginRight: "20px"}} onCLick={handleScroll}>{subscription}</Button>  : ""}

            {avatar ? <Avatar 
                alt = "USER"
                src={avatar} 
                style={{
                  width: "50px",
                  height: "50px",
                }} 
              /> : ""}

               
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Container>
      </Container>
    </React.Fragment>
  );
}