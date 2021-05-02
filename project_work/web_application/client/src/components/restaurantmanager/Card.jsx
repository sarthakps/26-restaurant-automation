import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    border: `1px solid whitesmoke`,
    background : 'white',
    boxShadow: '0 3px 5px 2px grey',
    transition: '0.6s',
    '&:hover': {
      transform: 'translateY(-10px)'
    }
  },
  media: {
    height: 200,
  },
  
});

export default function MediaCard() {
  const classes = useStyles();

  const [shadow, setShadow] = useState(1);

  const onMouseOver = () => setShadow({ shadow: 3 });
  const onMouseOut = () => setShadow({ shadow: 1 });


  return (
    <Card className={classes.root} style={{width : "50%", marginRight: "50px", marginLeft: "50px", borderRadius: "50px"}}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    zDepth={shadow}
    >
      <CardActionArea >
        {/* <CardMedia
          className={classes.media}
          image="/static/images/cards/contemplative-reptile.jpg"
          title="Contemplative Reptile"
        /> */}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            <h2>Automation</h2>
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
          {/* <p>We give you the tools you need to manage your orders, inventory,statistical data and much more - all in one place.</p>
          <h3>Join our family today!</h3>
          <h3><sup>$</sup>49<span class="small">/mo</span></h3> */}

          <h3><sup>$</sup>49<span class="small">/mo</span></h3>
          <p>Upto 50 Employees</p>
          <ul>
            <li style={{fontSize: "18px"}}>Limited Email Support</li>
            <li>Single Admin Only</li>
            <li>Value Offer</li>
          </ul>
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        
        {/* <Button size="small" color="primary" style={{textAlign: "center"}}>
          Learn More
        </Button> */}
      </CardActions>
    </Card>
  );
}
