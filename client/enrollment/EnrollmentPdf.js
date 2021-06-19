import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import { read } from "./api-enrollment.js";
import { Link } from "react-router-dom";
import auth from "./../auth/auth-helper";
import Divider from "@material-ui/core/Divider";
import { PDFExport } from "@progress/kendo-react-pdf";
import { useRef } from "react";
import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 800,
    margin: "auto",
    marginTop: theme.spacing(6),
    marginLeft: 250,
  }),
  heading: {
    marginBottom: theme.spacing(3),
    fontWeight: 200,
  },
  flex: {
    display: "flex",
    marginBottom: 20,
  },
  card: {
    padding: "24px 40px 20px",
    backgroundColor: "#cfd8dc",
    boxShadow: "#00264d 0px 0px 20px 0px",
    border: "1px solid #2d668e",
    marginBottom: theme.spacing(3),
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
  avatar: {
    color: "black",
    border: "1px solid black",
    background: "none",
  },
  media: {
    height: 350,
    display: "flex",
    width: "150%",
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

  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,

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
  button: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(15),
    alignItems: "center",
    fontSize: theme.spacing(3),
  },
}));

export default function EnrollmentPdf({ match }) {
  const pdfExportComponent = useRef(null);
  const contentArea = useRef(null);

  const handleExportWithComponent = (event) => {
    pdfExportComponent.current.save();
  };

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

  return (
    <div className={classes.root}>
      <div className={classes.button}>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={handleExportWithComponent}
        >
          <GetAppIcon />
          Download PDF{" "}
        </Button>
      </div>

      <PDFExport ref={pdfExportComponent} paperSize="A4">
        <div ref={contentArea}>
          {values.drawer == -1 && (
            <Card className={classes.card}>
              <CardHeader
                title={enrollment.diet.name}
                subheader={
                  <div>
                    <br />
                    <Link
                      to={"/user/" + enrollment.diet.instructor._id}
                      className={classes.sub}
                    >
                      Created By : {enrollment.diet.instructor.name}
                    </Link>
                    <span className={classes.category}>
                      Category : {enrollment.diet.category}
                    </span>
                  </div>
                }
              />
              <div className={classes.flex}>
                <div className={classes.details}>
                  <Typography variant="body1" className={classes.subheading}>
                    Description :
                    <br />
                    {enrollment.diet.description}
                    <br />
                  </Typography>
                </div>
              </div>
              <Divider />
              <div>
                <CardHeader
                  title={
                    <Typography variant="h6" className={classes.subheading}>
                      Days
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body1" className={classes.subheading}>
                      {enrollment.diet.days && enrollment.diet.days.length} Day
                      Of Diet Plan
                    </Typography>
                  }
                  
                />
                <List>
                  {enrollment.diet.days &&
                    enrollment.diet.days.map((day, i) => {
                      return (
                        <span key={i}>
                          <ListItem className={classes.less}>
                            <ListItemAvatar>
                              <Avatar className={classes.avatar}>
                                {i + 1}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={day.title} />
                          </ListItem>
                          <ListItem className={classes.lessContent}>
                            <ListItemText primary={day.content} />
                          </ListItem>
                        </span>
                      );
                    })}
                </List>
              </div>
            </Card>
          )}
        </div>
      </PDFExport>
    </div>
  );
}
