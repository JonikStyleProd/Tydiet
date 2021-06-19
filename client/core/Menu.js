import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import Button from "@material-ui/core/Button";
import auth from "./../auth/auth-helper";
import { Link, withRouter } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";

const isActive = (history, path) => {
  if (history.location.pathname == path) return { color: "#2196f3" };
  else return { color: "#fffde7" };
};
const isPartActive = (history, path) => {
  if (history.location.pathname.includes(path))
    return { color: "#fffde7", backgroundColor: "#2196f3", marginRight: 0 };
  else
    return {
      color: "#fffde7",
      backgroundColor: "transparent",
      marginRight: 0,
    };
};

const Menu = withRouter(({ history }) => {
  const [values, setValues] = useState({
    user: {},
  });
  useEffect(() => {
    if (!auth.isAuthenticated()) {
      console.log("NoT-Logged");
    } else {
      setValues({ ...values, user: auth.isAuthenticated().user });
    }
  }, []);

  const photoURL = values.user._id
    ? "/api/users/photo/" + values.user._id
    : "/api/users/defaultphoto";
  return (
    <AppBar position="fixed" style={{ zIndex: 12343455, flexGrow: 1 }}>
      <Toolbar>
        <Typography variant="h6" color="inherit">
          TyDiet
        </Typography>
        <div>
          <Link to="/">
            <IconButton aria-label="Home" style={isActive(history, "/")}>
              <HomeIcon />
            </IconButton>
          </Link>
        </div>
        <div style={{ position: "absolute", right: "10px" }}>
          <span style={{ float: "right" }}>
            {!auth.isAuthenticated() && (
              <span>
                <Link to="/about">
                  <Button style={isActive(history, "/about")}>About</Button>
                </Link>
                <Link to="/signup">
                  <Button style={isActive(history, "/signup")}>Sign up</Button>
                </Link>
                <Link to="/signin">
                  <Button style={isActive(history, "/signin")}>Sign In</Button>
                </Link>
              </span>
            )}
            {auth.isAuthenticated() && (
              <span>
                         {auth.isAuthenticated().user.creator && (
                  <Link to="/creating/diets">
                    <Button style={isPartActive(history, "/creating/")}>
                      My Diet's
                    </Button>
                  </Link>
                )}
                <Link to={"/user/" + auth.isAuthenticated().user._id}>
                  <Button
                    style={isActive(
                      history,
                      "/user/" + auth.isAuthenticated().user._id
                    )}
                  >
                    <Avatar src={photoURL} alt="profile" />
                  </Button>
                </Link>
       
                <Link to="/about">
                  <Button style={isActive(history, "/about")}>About</Button>
                </Link>
                <Button
                  color="inherit"
                  onClick={() => {
                    auth.clearJWT(() => history.push("/"));
                  }}
                >
                  Sign out
                </Button>
              </span>
            )}
          </span>
        </div>
      </Toolbar>
    </AppBar>
  );
});

export default Menu;
