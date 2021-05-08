import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {BrowserRouter as Router, Route, Switch, Link, Redirect, useRouteMatch } from "react-router-dom"

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    border: `1px solid whitesmoke`,
    // background : 'black',
    boxShadow: '0',
    transition: '0.6s',
    '&:hover': {
      transform: 'translateY(-10px)'
    }
  },
  media: {
    height: 200,
  },
  
});

export default function MediaCard({cardimg, cardwidth, cardheight, url, backcolor, fontcolor, borderradius, h2, h3, p, marginRight, marginLeft}) {
  const classes = useStyles();

  const [shadow, setShadow] = useState(1);

  const onMouseOver = () => setShadow({ shadow: 0 });
  const onMouseOut = () => setShadow({ shadow: 0 });


  return (
 <Card component={Link} to={url} className={classes.root} style={{width : cardwidth, height: cardheight, marginRight: marginRight, marginLeft: marginLeft, borderRadius: borderradius}}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    zDepth={shadow}
    >
      <CardActionArea >
        {cardimg ? <CardMedia
          className={classes.media}
          
          image={cardimg}
          title="Contemplative Reptile"
        /> : ""}
        <CardContent style={{backgroundColor: backcolor}}>
          <Typography gutterBottom variant="h5" component="h2">
            {h2 ? <h2 style={{textAlign:"center"}}>{h2}</h2> : ""}
          </Typography>
          <Typography gutterBottom variant="h5" component="h2">

          {h3 ? <h3 style={{textAlign:"center", fontSize: "24px"}}>{h3}</h3> : ""}
          {p ?  <p style={{textAlign:"center", fontSize: "20px", color: "#6c6c6c"}}>{p}</p> : "" }
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>

      </CardActions>
    </Card> 
  );
}

