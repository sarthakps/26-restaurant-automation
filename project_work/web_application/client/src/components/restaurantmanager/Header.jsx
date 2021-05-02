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
import Button from '@material-ui/core/Button';

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
 

export default function HideAppBar(props) {
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
      <HideOnScroll {...props} style={{color: "black"}}>
        <AppBar  style={{backgroundColor: "#F2F4F8", height:"70px"}}>
          <Toolbar>
          <Typography variant="h6" className={classes.title} style={{color: "black"}}>
            LOGO
          </Typography>
            <Button color="inherit" style={{color: "black"}}>Login</Button>
            <Button color="inherit" style={{color: "black"}} onCLick={handleScroll}>Subsription</Button>
            {/* <Button
                    Button color="inherit" 
                    style={{color: "black"}}
                    onClick={() => {
                    divRefmid.current.scrollIntoView({ behavior: "smooth" });
                    }}
                >MID</Button> */}
            <Button color="inherit" style={{color: "black"}} onClick={handleScroll}>About us</Button>     
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Container>
      </Container>
      {/* <div ref={divRefmid}>BELLLOOOOO</div> */}
    </React.Fragment>
  );
}