import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Edit from "@material-ui/icons/Edit";
import Divider from "@material-ui/core/Divider";
import DeleteUser from "./DeleteUser";
import auth from "./../auth/auth-helper";
import { read } from "./api-user.js";
import { Redirect, Link } from "react-router-dom";
import Enrollments from '../enrollment/Enrollments';
import Card from '@material-ui/core/Card'
import {listEnrolled} from './../enrollment/api-enrollment'

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 800,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(20),
    backgroundColor: '#cfd8dc',
    boxShadow: '#00264d 0px 0px 20px 0px',
    border: "1px solid #2d668e",
  }),
  title: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.secondary,
    fontSize: "3em",

  },
  bigAvatar: {
    width: 160,
    height: 160,
    margin: 18,
    boxShadow: '#00264d 0px 0px 20px 0px',
    border: "1px solid #2d668e",
    transition: "transform 0.10s ease-in-out",
    '&:hover': {
      transform: "scale3d(1.05, 1.05, 1)"
    },
    noTitle: {
      color: 'lightgrey',
      marginBottom: 12,
      marginLeft: 8,
      backgroundColor: '#cfd8dc',
    },
    enrolledCard: {
      backgroundColor: '#cfd8dc',
    },
    enrolledTitle: {
      color:'#efefef',
      marginBottom: 5,
      backgroundColor: '#cfd8dc',

    },
    card: {
      width:'90%',
      margin: 'auto',
      marginTop: 20,
      marginBottom: theme.spacing(2),
      padding: 20,
      backgroundColor: '#cfd8dc',
    },
  },

}));

export default function Profile({ match }) {
  const classes = useStyles();
  const [values, setValues] = useState({
    user: "",
    redirectToSignin: false,

  });
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, redirectToSignin: true });
      } else {
        setValues({ ...values, user: data, });

      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);
  const [enrolled, setEnrolled] = useState([])
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listEnrolled({t: jwt.token}, signal).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setEnrolled(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])

  const photoUrl = values.user._id
    ? `/api/users/photo/${values.user._id}?${new Date().getTime()}`
    : "/api/users/defaultphoto";
  if (values.redirectToSignin) {
    return <Redirect to="/signin" />;
  }
  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={photoUrl} className={classes.bigAvatar} />
          </ListItemAvatar>
          <ListItemText
            primary={<Typography variant="h4" display="block" gutterBottom>{values.user.name}</Typography>}
            secondary={<Typography variant="h5" gutterBottom>{values.user.email}</Typography>}
          />{" "}
          {auth.isAuthenticated().user &&
          auth.isAuthenticated().user._id == values.user._id && (
            <ListItemSecondaryAction>
              <Link to={"/user/edit/" + values.user._id}>
                <IconButton aria-label="Edit" color="primary">
                  <Edit />
                </IconButton>
              </Link>
              <DeleteUser userId={values.user._id} />
            </ListItemSecondaryAction>
          ) }
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={<Typography variant="h5" gutterBottom>{values.user.about}</Typography>}
            secondary={
              "Added: " + new Date(values.user.created).toDateString()
            }
          />
        </ListItem>
      </List>
      {auth.isAuthenticated().user && (
      <Card className={`${classes.card} ${classes.enrolledCard}`}>
        <Typography component="h2" className={classes.enrolledTitle} >
            Diets you are Enrolled in
        </Typography>
        {enrolled.length != 0 ? (<Enrollments enrollments={enrolled}/>)
                             : (<Typography variant="body1" className={classes.noTitle}>No diets.</Typography>)
        }
      </Card>
      )}
    </Paper>
    
  );
}
