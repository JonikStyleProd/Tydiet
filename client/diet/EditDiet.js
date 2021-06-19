import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import FileUpload from "@material-ui/icons/AddPhotoAlternate";
import ArrowUp from "@material-ui/icons/ArrowUpward";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { read, update } from "./api-diet.js";
import { Link, Redirect } from "react-router-dom";
import auth from "../auth/auth-helper";
import Divider from "@material-ui/core/Divider";
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
  },
  subheading: {
    margin: "10px",
    color: theme.palette.openTitle,
  },
  details: {
    margin: "16px",
  },
  upArrow: {
    border: "2px solid #f57c00",
    marginLeft: 3,
    marginTop: 10,
    padding: 4,
    color: "black"
  },
  sub: {
    display: "block",
    margin: "3px 0px 5px 0px",
    fontSize: "0.9em",
  },
  media: {
    height: 350,
    display: "inline-block",
    width: "70%",
    marginLeft: "16px",
    border: "1px solid #2d668e",
    boxShadow: "#00264d 0px 0px 20px 0px",
  },
  icon: {
    verticalAlign: "sub",
  },
  textfield: {
    width: 350,
  },
  action: {
    margin: "8px 24px",
    display: "inline-block",
  },
  input: {
    display: "none",
  },
  filename: {
    marginLeft: "10px",
  },
  list: {
    backgroundColor: "#cfd8dc",
  },
  iconNumber: {
    color: "black"
  },
  gridDays: {
    marginTop: theme.spacing(4),
    backgroundColor: "#cfd8dc",
    boxShadow: "#00264d 0px 0px 20px 0px",
    border: "1px solid #2d668e",
  }
}));

export default function EditDiet({ match }) {


  const classes = useStyles();
  const [diet, setDiet] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    instructor: {},
    days: [],
  });
  const [values, setValues] = useState({
    redirect: false,
    error: "",
  });
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ dietId: match.params.dietId }, signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        data.image = "";
        setDiet(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.dietId]);
  const jwt = auth.isAuthenticated();
  const handleChange = (name) => (event) => {
    const value = name === "image" ? event.target.files[0] : event.target.value;
    setDiet({ ...diet, [name]: value });
  };
  const handleDayChange = (name, index) => (event) => {
    const days = diet.days;
    days[index][name] = event.target.value;
    setDiet({ ...diet, days: days });
  };
  const deleteDay = (index) => (event) => {
    const days = diet.days;
    days.splice(index, 1);
    setDiet({ ...diet, days: days });
  };
  const moveUp = (index) => (event) => {
    const days = diet.days;
    const moveUp = days[index];
    days[index] = days[index - 1];
    days[index - 1] = moveUp;
    setDiet({ ...diet, days: days });
  };
  const clickSubmit = () => {
    let dietData = new FormData();
    diet.name && dietData.append("name", diet.name);
    diet.description && dietData.append("description", diet.description);
    diet.image && dietData.append("image", diet.image);
    diet.category && dietData.append("category", diet.category);
    dietData.append("days", JSON.stringify(diet.days));
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
        console.log(data.error);
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, redirect: true });
      }
    });
  };
  if (values.redirect) {
    return <Redirect to={"/creating/diet/" + diet._id} />;
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
          title={
            <TextField
              margin="dense"
              label="title"
              type="text"
              fullWidth
              value={diet.name}
              onChange={handleChange("name")}
              variant="outlined"
            />
          }
          subheader={
            <div>
              <Link to={"/user/" + diet.instructor._id} className={classes.sub}>
                By {diet.instructor.name}
              </Link>
              {
                <TextField
                  margin="dense"
                  label="Category"
                  type="text"
                  fullWidth
                  value={diet.category}
                  variant="outlined"
                  onChange={handleChange("category")}
                />
              }
            </div>
          }
          action={
            auth.isAuthenticated().user &&
            auth.isAuthenticated().user._id == diet.instructor._id && (
              <span className={classes.action}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={clickSubmit}
                >
                  Save
                </Button>
              </span>
            )
          }
        />
        <div className={classes.flex}>
          <CardMedia
            className={classes.media}
            image={imageUrl}
            title={diet.name}
          />
          <div className={classes.details}>
            <TextField
              margin="dense"
              multiline
              rows="5"
              label="description"
              type="text"
              className={classes.textfield}
              value={diet.description}
              onChange={handleChange("description")}
              variant="outlined"
            />
            <br />
            <br />
            <input
              accept="image/*"
              onChange={handleChange("image")}
              className={classes.input}
              id="icon-button-file"
              type="file"
              variant="outlined"
            />
            <label htmlFor="icon-button-file">
              <Button variant="outlined" color="secondary" component="span">
                Change Photo
                <FileUpload />
              </Button>
            </label>{" "}
            <span className={classes.filename}>
              {diet.image ? diet.image.name : ""}
            </span>
            <br />
          </div>
        </div>
        <Divider />
        
      </Card>
      </Grid>
      <Grid item xs={6} sm={6} className={classes.gridDays}>
      <div>
          <CardHeader
            title={
              <Typography variant="h6" className={classes.subheading}>
                Days - Edit and Rearrange
              </Typography>
            }
            subheader={
              <Typography variant="body1" className={classes.subheading}>
                {diet.days && diet.days.length} Days
              </Typography>
            }
          />
          <List>
            {diet.days &&
              diet.days.map((day, index) => {
                return (
                  <span key={index}>
                    <ListItem className={classes.list}>
                      <ListItemAvatar>
                        <>
                          <Avatar className={classes.iconNumber} >{index + 1}</Avatar>
                          {index != 0 && (
                            <IconButton
                              aria-label="up"
                              color="primary"
                              onClick={moveUp(index)}
                              className={classes.upArrow}
                            >
                              <ArrowUp />
                            </IconButton>
                          )}
                        </>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <>
                            <TextField
                              margin="dense"
                              label="title"
                              type="text"
                              fullWidth
                              value={day.title}
                              onChange={handleDayChange("title", index)}
                              variant="outlined"
                            />
                            <br />
                            <TextField
                              margin="dense"
                              multiline
                              rows="5"
                              label="Content"
                              type="text"
                              fullWidth
                              value={day.content}
                              onChange={handleDayChange("content", index)}
                              variant="outlined"
                            />
                            <br />
                          </>
                        }
                      />
                      {!diet.published && (
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="up"
                            color="primary"
                            onClick={deleteDay(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                    <Divider
                      style={{ backgroundColor: "rgb(106, 106, 106)" }}
                      component="li"
                    />
                  </span>
                );
              })}
          </List>
        </div>
      </Grid>
      </Grid>
    </div>
  );
}
