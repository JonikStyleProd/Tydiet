import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListSubheader from "@material-ui/core/ListSubheader";
import Avatar from "@material-ui/core/Avatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { read, complete } from "./api-enrollment.js";
import { Link } from "react-router-dom";
import auth from "./../auth/auth-helper";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Info from "@material-ui/icons/Info";
import CheckCircle from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import { CardContent } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import GetAppIcon from '@material-ui/icons/GetApp';
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    flexGrow: 1,
    margin: 30,
    marginTop: theme.spacing(10),
    marginLeft: 250,
  }),
  heading: {
    marginBottom: theme.spacing(3),
    fontWeight: 200,
  },
  flex: {
    display: "flex",
    marginBottom: 0,
  },
  card: {
    padding: "24px 40px 20px",
    backgroundColor: "#cfd8dc",
    boxShadow: "#00264d 0px 0px 20px 0px",
    border: "1px solid #2d668e",
  },
  subheading: {
    margin: "10px",
    color: theme.palette.openTitle,
  },
  details: {
    margin: "16px",
    marginTop: theme.spacing(4)
  },
  sub: {
    display: "block",
    margin: "3px 0px 5px 0px",
    fontSize: "0.9em",
  },
  avatar: {
    color: "black",
    border: "1px solid black",
    background: "none",
  },
  media: {
    height: 300,
    display: "inline-block",
    width: "110%",
    marginLeft: "16px",
    border: "1px solid #2d668e",
    boxShadow: "#00264d 0px 0px 40px 0px",
  },
  icon: {
    verticalAlign: "sub",
  },
  category: {
    color: "#5c5c5c",
    fontSize: "0.9em",
    padding: "3px 5px",
    backgroundColor: "#dbdbdb",
    borderRadius: "0.2em",
    marginTop: 5,
  },
  action: {
    margin: "8px 24px",
    display: "inline-block",
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
    marginTop: theme.spacing(8),
    backgroundColor: "#616161",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  selectedDrawer: {
    backgroundColor: "#e9e3df",
  },
  unselected: {
    backgroundColor: "#cfd8dc",
    textShadow: "1px 0px",
  },
  check: {
    color: "#38cc38",
  },
  subhead: {
    fontSize: "1.2em",
  },
  progress: {
    textAlign: "center",
    color: "#dfdfdf",
    "& span": {
      color: "#fffde7",
      fontSize: "1.15em",
    },
  },
  para: {
    whiteSpace: "pre-wrap",
  },
  less: {
    backgroundColor: "#cfd8dc",
    boxShadow: "#00264d 0px 0px 10px 0px",
    border: "1px solid #2d668e",
    padding: "24px 40px 20px",
    margin: theme.spacing(1),
    cursor: "pointer",
    textShadow: "1px 0px",
  },
  lessContent: {
    backgroundColor: "#cfd8dc",
    boxShadow: "#00264d 0px 0px 5px 0px",
    border: "0px solid #2d668e",
    padding: "15px 30px 15px",
    margin: theme.spacing(1),
    cursor: "pointer",
    textShadow: "1px 0px",
  },
  buttonDownload: {
    margin: theme.spacing(3),
    color: "white"
  },
  sub1: {
    color: "white"
  }
}));

export default function Enrollment({ match }) {
  const classes = useStyles();
  const [enrollment, setEnrollment] = useState({
    diet: { instructor: [] },
    dayStatus: [],
  });
  const [values, setValues] = useState({
    error: "",
    drawer: -1,
  });
  const [totalComplete, setTotalComplete] = useState(0);
  const jwt = auth.isAuthenticated();
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      { enrollmentId: match.params.enrollmentId },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        totalCompleted(data.dayStatus);
        setEnrollment(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.enrollmentId]);
  const totalCompleted = (days) => {
    let count = days.reduce((total, dayStatus) => {
      return total + (dayStatus.complete ? 1 : 0);
    }, 0);
    setTotalComplete(count);
    return count;
  };
  const selectDrawer = (index) => (event) => {
    setValues({ ...values, drawer: index });
  };
  const markComplete = () => {
    if (!enrollment.dayStatus[values.drawer].complete) {
      const dayStatus = enrollment.dayStatus;
      dayStatus[values.drawer].complete = true;
      let count = totalCompleted(dayStatus);

      let updatedData = {};
      updatedData.dayStatusId = dayStatus[values.drawer]._id;
      updatedData.complete = true;

      if (count == dayStatus.length) {
        updatedData.dietCompleted = Date.now();
      }

      complete(
        {
          enrollmentId: match.params.enrollmentId,
        },
        {
          t: jwt.token,
        },
        updatedData
      ).then((data) => {
        if (data && data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setEnrollment({ ...enrollment, dayStatus: dayStatus });
        }
      });
    }
  };

  const imageUrl = enrollment.diet._id
    ? `/api/diets/photo/${enrollment.diet._id}?${new Date().getTime()}`
    : "/api/diets/defaultphoto";
  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <List>
          <ListItem
            button
            onClick={selectDrawer(-1)}
            className={
              values.drawer == -1 ? classes.selectedDrawer : classes.unselected
            }
          >
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary={"Diet Overview"} />
          </ListItem>
        </List>
        <Divider />
        <List className={classes.unselected}>
          <ListSubheader component="div" className={classes.subhead}>
            Days
          </ListSubheader>
          {enrollment.dayStatus.map((day, index) => (
            <ListItem
              button
              key={index}
              onClick={selectDrawer(index)}
              className={
                values.drawer == index
                  ? classes.selectedDrawer
                  : classes.unselected
              }
            >
              <ListItemAvatar>
                <Avatar className={classes.avatar}>{index + 1}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={enrollment.diet.days[index].title} />
              <ListItemSecondaryAction>
                {day.complete ? (
                  <CheckCircle className={classes.check} />
                ) : (
                  <RadioButtonUncheckedIcon />
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}


        </List>
        <Divider />
        <List>
          <ListItem>
            <ListItemText
              primary={
                <div className={classes.progress}>
                  <span>{totalComplete}</span> out of{" "}
                  <span>{enrollment.dayStatus.length}</span> completed
                </div>
              }
            />
          </ListItem>
          <Button
        variant="contained"
        color="secondary"
        size="large"
        className={classes.buttonDownload}
        startIcon={<GetAppIcon />}
      >
              <Link
                 variant="outlined"
                  color="secondary"
                      to={"/enrollment/" + enrollment._id}
                      className={classes.sub1}
                    >
                      Generate the PDF
                    </Link>
      </Button>
        </List>
      </Drawer>
      {values.drawer == -1 && (
        <Grid container spacing={8}>
          <Grid item xs={6} sm={6}>
            <Card className={classes.card}>
              <CardHeader
                title={enrollment.diet.name}
                subheader={
                  <div>
                    <Link
                      to={"/user/" + enrollment.diet.instructor._id}
                      className={classes.sub}
                    >
                      By {enrollment.diet.instructor.name}
                    </Link>
                    <span className={classes.category}>
                      {enrollment.diet.category}
                    </span>
                  </div>
                }
                action={
                  totalComplete == enrollment.dayStatus.length && (
                    <span className={classes.action}>
                      <Button variant="contained" color="secondary">
                        <CheckCircle /> &nbsp; Completed
                      </Button>
   
                    </span>
                  )
                }
              />
              <div className={classes.flex}>
                <CardMedia
                  className={classes.media}
                  image={imageUrl}
                  title={enrollment.diet.name}
                />
               
              </div>
              <div className={classes.details}>
                  <Typography variant="body1" className={classes.subheading}>
                    {enrollment.diet.description}
                    <br />
                  </Typography>
                </div>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6}>
          <Card className={classes.card}>
            <List>
              {enrollment.diet.days &&
                enrollment.diet.days.map((day, i) => {
                  return (
                    <span key={i}>
                      <ListItem
                        onClick={selectDrawer(i)}
                        className={classes.less}
                      >
                        <ListItemAvatar>
                          <Avatar className={classes.avatar}>{i + 1}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={day.title} />
                      </ListItem>
                      <ListItem className={classes.lessContent}>
                        <Typography variant="body1" className={classes.para}>{day.content}</Typography>
                      </ListItem>
                    </span>
                  );
                })}
            </List>
            </Card>
          </Grid>
        </Grid>
      )}
      {values.drawer != -1 && (
        <>
          <Typography variant="h5" className={classes.heading}>
            {enrollment.diet.name}
          </Typography>
          <Card className={classes.card}>
            <CardHeader
              title={enrollment.diet.days[values.drawer].title}
              action={
                <Button
                  onClick={markComplete}
                  variant={
                    enrollment.dayStatus[values.drawer].complete
                      ? "contained"
                      : "outlined"
                  }
                  color="secondary"
                >
                  {enrollment.dayStatus[values.drawer].complete
                    ? "Completed"
                    : "Mark as complete"}
                </Button>
              }
            />
            <CardContent>
              <Typography variant="body1" className={classes.para}>
                {enrollment.diet.days[values.drawer].content}
              </Typography>
            </CardContent>
            
          </Card>
        </>
      )}
    </div>
  );
}
