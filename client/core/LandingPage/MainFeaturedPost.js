import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Link } from "react-router-dom";
import Image from "../../assets/images/logo23.jpg"

const useStyles = makeStyles((theme) => ({
  mainFeaturedPost: {
    position: 'relative',
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(12),
    backgroundImage: `url(${Image})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    boxShadow: '#00264d 0px 0px 20px 0px',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  mainFeaturedPostContent: {
    position: 'relative',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
  },
  link: {
    fontSize: "50px",
    color: "#c7e9fc",
    textShadow: "2px 1px black",
    '&:hover': {
      textShadow: "2px 1px red",
    }
  },
  text: {
    textShadow: "2px 1px 2px black",
    color: "#c7e9fc"
  }
}));


export default function MainFeaturedPost(props) {
  const classes = useStyles();
  const { post } = props;

  return (
    <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(${Image})` }}>
      {/* Increase the priority of the hero background image */}
      {<img style={{ display: 'none' }} src={Image} alt="imageText" />}
      <div className={classes.overlay} />
      <Grid container>
        <Grid item md={6}>
          <div className={classes.mainFeaturedPostContent}>
            <Typography component="h1" variant="h3" color="inherit" className={classes.text}>
              {post.title}
            </Typography>
            <Typography variant="h5" color="inherit" paragraph className={classes.text}> 
              {post.description}
            </Typography>
            <Link className={classes.link} to="/signin" >
              Click Here To Start TyDiet
            </Link>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}

MainFeaturedPost.propTypes = {
  post: PropTypes.object,
};