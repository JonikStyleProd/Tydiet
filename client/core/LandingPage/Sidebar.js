import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {Link as Linked} from "react-router-dom"
import ab from "../../assets/images/about-us1.jpg"

const useStyles = makeStyles((theme) => ({
  sidebarAboutBox: {
    marginLeft: theme.spacing(8),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[200],
    border: "1px solid black",
    boxShadow: '#00264d 0px 0px 20px 0px',
  },
  sidebarSection: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(8),
  },
  sidebarSection2: {
    marginLeft: theme.spacing(8),
  },
}));

export default function Sidebar(props) {
  const classes = useStyles();
  const { description, social, title } = props;

  return (
    <Grid item xs={12} md={4} >
      <Paper elevation={0} className={classes.sidebarAboutBox}>
        <Linked to="/about" >
        <Typography variant="h6" >
          {title}
        </Typography>
        <Typography>{description}</Typography>
        </Linked>
      </Paper>
      <Typography variant="h6"  className={classes.sidebarSection}>
        Social
      </Typography>
      {social.map((network,i) => (
        <Link display="block" variant="body1" href={network.link} key={i} className={classes.sidebarSection2}>
          <Grid container direction="row" spacing={1} alignItems="center">
            <Grid item>
              <network.icon />
            </Grid>
            <Grid item>{network.name}</Grid>
          </Grid>
        </Link>
      ))}
    </Grid>
  );
}

Sidebar.propTypes = {
  archives: PropTypes.array,
  description: PropTypes.string,
  social: PropTypes.array,
  title: PropTypes.string,
};