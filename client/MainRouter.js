import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Users from "./user/Users";
import Signup from "./user/Signup";
import Signin from "./auth/Signin";
import EditProfile from "./user/EditProfile";
import Profile from "./user/Profile";
import PrivateRoute from "./auth/PrivateRoute";
import Menu from "./core/Menu";
import NewDiet from "./diet/NewDiet";
import EnrollmentPdf from './enrollment/EnrollmentPdf'
import Diet from "./diet/Diet";
import EditDiet from "./diet/EditDiet";
import MyDiets from "./diet/MyDiets";
import Enrollment from "./enrollment/Enrollment";
import { makeStyles } from "@material-ui/core/styles";
import About from "./core/About";
import FooterAll from "./core/FooterAll";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    width: "auto",
    margin: "auto",
  },
}));

const MainRouter = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <Menu />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/users" component={Users} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
          <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
          <Route path="/user/:userId" component={Profile} />
          <Route path="/diet/:dietId" component={Diet} />
          <PrivateRoute path="/creating/diets" component={MyDiets} />
          <PrivateRoute path="/creating/diet/new" component={NewDiet} />
          <PrivateRoute path="/creating/diet/edit/:dietId" component={EditDiet} />
          <PrivateRoute path="/creating/diet/:dietId" component={Diet} />
          <PrivateRoute path="/learn/:enrollmentId" component={Enrollment} />
          <PrivateRoute path="/enrollment/:enrollmentId" component={EnrollmentPdf} />
          <Route path="/about" component={About} />
        </Switch>
        <FooterAll />
      </main>
    </div>
  );
};

export default MainRouter;
