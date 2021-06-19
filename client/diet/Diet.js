import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from "@material-ui/core/IconButton";
import Edit from "@material-ui/icons/Edit";
import PeopleIcon from "@material-ui/icons/Group";
import CompletedIcon from "@material-ui/icons/VerifiedUser";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Avatar from "@material-ui/core/Avatar";
import { read, update } from "./api-diet.js";
import { enrollmentStats } from "../enrollment/api-enrollment";
import { Link, Redirect } from "react-router-dom";
import auth from "../auth/auth-helper";
import DeleteDiet from "./DeleteDiet";
import Divider from "@material-ui/core/Divider";
import NewDay from "./NewDay";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Enroll from "../enrollment/Enroll";
import Grid from '@material-ui/core/Grid'


const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    flexGrow: 1,
    margin: 30,
    marginTop: theme.spacing(10)
  }),
  flex: {
    display: "flex",
    marginBottom: 20,
  },
  card: {
    padding: "24px 40px 40px",
    backgroundColor: "#cfd8dc",
    boxShadow: "#00264d 0px 0px 20px 0px",
    border: "1px solid #2d668e",
    marginBottom: theme.spacing(2),
  },
  subheading: {
    margin: "10px",
    color: theme.palette.openTitle,
  },
  details: {
    margin: "16px",
  },
  sub: {
    display: "block",
    margin: "3px 0px 5px 0px",
    fontSize: "0.9em",
  },
  media: {
    height: 450,
    display: "inline-block",
    width: "100%",
    marginLeft: "16px",
    border: "1px solid #2d668e",
    boxShadow: "#00264d 0px 0px 20px 0px",
  },
  icon: {
    verticalAlign: "sub",
    color: "black",
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
    margin: "10px 0px",
    display: "flex",
    justifyContent: "flex-end",
  },
  statSpan: {
    margin: "7px 10px 0 10px",
    alignItems: "center",
    color: "#616161",
    display: "inline-flex",
    "& svg": {
      marginRight: 10,
      color: "#b6ab9a",
    },
  },
  enroll: {
    float: "right",
  },
  dayIcon: {
    color: "black",
  },
  paper: {
    position: "fixed",
    overflow: "scroll",
    maxWidth: 850,
    maxHeight: 600,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1),
  },
  buttonModal: {
    margin: theme.spacing(2),
    alignItems: "center",
  },
  rootAccordion: {
    width: '100%',
  },
  heading: {
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(1),
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  acordion: {
    backgroundColor: "#cfd8dc",
    boxShadow: "#00264d 0px 0px 20px 0px",
    border: "1px solid #2d668e",
  },
  details1: {
    backgroundColor: "#b2dfdb",
    boxShadow: "#00264d 0px 0px 10px 0px",
    border: "1px solid #2d668e",
  },
  para: {
    whiteSpace: "pre-wrap"
  }
}));

export default function Diet({ match }) {
  const classes = useStyles();
  const [stats, setStats] = useState({});
  const [diet, setDiet] = useState({ instructor: {} });
  const [values, setValues] = useState({
    redirect: false,
    error: "",
  });
  const [open, setOpen] = useState(false);
  const jwt = auth.isAuthenticated();
  const [enrolled, setEnrolled] = useState([])
  
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ dietId: match.params.dietId }, signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setDiet(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.dietId]);
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    enrollmentStats(
      { dietId: match.params.dietId },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setStats(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.dietId]);
  const removeDiet = (diet) => {
    setValues({ ...values, redirect: true });
  };
  const addDay = (diet) => {
    setDiet(diet);
  };
  const clickPublish = () => {
    if (diet.days.length > 0) {
      setOpen(true);
    }
  };
  const publish = () => {
    let dietData = new FormData();
    dietData.append("published", true);
    update(
      {
        dietId: match.params.dietId,
      },
      {
        t: jwt.token,
      },
      dietData
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setDiet({ ...diet, published: true });
        setOpen(false);
      }
    });
  };


  
  const handleClose = () => {
    setOpen(false);
  };

  if (values.redirect) {
    return <Redirect to={"/creating/diets"} />;
  }
  const imageUrl = diet._id
    ? `/api/diets/photo/${diet._id}?${new Date().getTime()}`
    : "/api/diets/defaultphoto";
  return (
    <div className={classes.root}>
            <Grid container spacing={8}>
        <Grid item xs={6} sm={6}>
      <Card className={classes.card}>
        <CardHeader
          title={"Creating  - "+diet.name}
          subheader={
            <div>
              <Avatar src={"/api/users/photo/" + diet.instructor._id} />
              <Link to={"/user/" + diet.instructor._id} className={classes.sub}>
                by {diet.instructor.name}
              </Link>
              <span className={classes.category}>{diet.category}</span>
            </div>
          }
          action={
            <>
              {auth.isAuthenticated().user &&
                auth.isAuthenticated().user._id == diet.instructor._id && (
                  <span className={classes.action}>
                    <Link to={"/creating/diet/edit/" + diet._id}>
                      <IconButton aria-label="Edit" color="secondary">
                        <Edit />
                      </IconButton>
                    </Link>
                    {!diet.published ? (
                      <>
                        <Button
                          color="secondary"
                          variant="outlined"
                          onClick={clickPublish}
                        >
                          {diet.days.length == 0
                            ? "Add atleast 1 Day to publish"
                            : "Publish"}
                        </Button>
                        <DeleteDiet diet={diet} onRemove={removeDiet} />
                      </>
                    ) : (
                      <Button color="primary" variant="outlined">
                        Published
                      </Button>
                    )}
                  </span>
                )}
              {diet.published && (
                <div>
                  <span className={classes.statSpan}>
                    <PeopleIcon /> {stats.totalEnrolled} Enrolled{" "}
                  </span>
                  <span className={classes.statSpan}>
                    <CompletedIcon /> {stats.totalCompleted} Complited{" "}
                  </span>
                </div>
              )}
            </>
          }
        />
        <div className={classes.flex}>
          <CardMedia
            className={classes.media}
            image={imageUrl}
            title={diet.name}
          />
          
        </div>
        <div className={classes.details}>
            <Typography variant="body1" className={classes.subheading}>
              {diet.description}
              <br />
            </Typography>

            {diet.published && (
              <div className={classes.enroll}>
                <Enroll dietId={diet._id} />
              </div>
            )}
          </div>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Publish Diet</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Publishing your diet will make it live to users for enrollment
          </Typography>
          <Typography variant="body1">
            "Make sure all days are added and ready for publishing.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Cancel
          </Button>
          <Button onClick={publish} color="secondary" variant="contained">
            Publish
          </Button>
        </DialogActions>
      </Dialog>
      </Grid >
      <Grid item xs={6} sm={6}>
      <Card className={classes.card}>
      <div>
          <CardHeader
            title={
              <Typography variant="h6" className={classes.subheading}>
                Diet days
              </Typography>
            }
            subheader={
              <Typography variant="body1" className={classes.subheading}>
                {diet.days && diet.days.length} days
              </Typography>
            }
            action={
              auth.isAuthenticated().user &&
              auth.isAuthenticated().user._id == diet.instructor._id &&
              !diet.published && (
                <span className={classes.action}>
                  <NewDay dietId={diet._id} addDay={addDay} />
                </span>
              )
            }
          />
        </div>
      <List>
            {diet.days &&
              diet.days.map((day, index) => {
                return (
                  <span key={index}>
                    <div className={classes.rootAcordion}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className={classes.acordion}
        >
          <Avatar className={classes.dayIcon}>{index + 1}</Avatar>
          <Typography className={classes.heading}>{day.title}</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details1}>
  
          <Typography variant="body1" className={classes.para}>
                  {day.content}
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>
                  </span>
                );
              })}
          </List>
          </Card>
        </Grid>
        </Grid>
    </div>
  );
}
