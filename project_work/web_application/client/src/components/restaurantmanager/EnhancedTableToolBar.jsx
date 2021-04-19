import React, {Fragment, useEffect, useState} from "react"
import { MuiThemeProvider, createMuiTheme, fade, lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';

const useToolbarStyles = makeStyles((theme, theme2) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
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
      },
  }));

const EnhancedTableToolbar = (props) => {
    const {onFilterChange, filter } = props;
    const classes = useToolbarStyles();
    

// const handleSearchChange = (e) => {
//         setFilter(e.target.value);
//     };
    // const { numSelected } = props;
  
    return (
        <Fragment>
        <Toolbar>
            <div className={classes.searchContainer}>
                <SearchIcon className={classes.searchIcon}/>
                <TextField className={classes.searchInput}
                    onChange={onFilterChange}
                    label="search"
                    varient="standard"
                />
            </div>
        </Toolbar>
      <Toolbar>
          {/* <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          </Typography>      */}
      </Toolbar>
      </Fragment>
    );
  };

  export default EnhancedTableToolbar;