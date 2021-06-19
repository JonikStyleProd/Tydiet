import React, {useState} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import { Link } from "react-router-dom";
import Enroll from "../enrollment/Enroll";
import Button from '@material-ui/core/Button'
import {create} from '../enrollment/api-enrollment'
import auth from './../auth/auth-helper'
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    background: theme.palette.background.paper,
    textAlign: "left",
    padding: "0 8px",
    backgroundColor: '#cfd8dc',
  },
  container: {
    minWidth: "100%",
    paddingBottom: "14px",
  },
  gridList: {
    width: "150%",
    minHeight: 150,
    padding: "10px 0 10px",
 
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
    width: "100%",
  },
  tile: {
    textAlign: "center",
    backgroundColor: "#373434",
    marginLeft: "2px",
    marginTop: "3px"
    
  },
  image: {
    height: "130%",
  },
  tileBar: {
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    textAlign: "left",
  },
  tileTitle: {
    fontSize: "1.1em",
    marginBottom: "5px",
    color: "rgb(189, 222, 219)",
    display: "block",
  },
  action:{
    margin: '0 10px',
    backgroundColor: "green"
  }, 
  bart: {
    textShadow: "2px 1px black",
    fontSize: "12px"
  },
  titleName: {
    fontSize: "23px",
    textShadow: "2px 1px black",
  },
  categoryName: {
    fontSize: "15px",
    textShadow: "2px 1px black",
  }
}));

export default function DietsSearch(props) {
  const classes = useStyles();
  const [enrolled, setEnrolled] = useState([])
  return (
    <div className={classes.root}>
      {props.diets.length != 0 && props.diets.length != enrolled.length ? (
        <div className={classes.container}>
          <GridList cellHeight={400} className={classes.gridList} cols={3}>
            {props.diets.map((diet, kf) => (
              <GridListTile key={kf} className={classes.tile}>
              <img
                className={classes.image}
                src={"/api/diets/photo/" + diet._id}
                alt={diet.name}

              />
                 <GridListTileBar
                 className={classes.bart}
                  title={<div className={classes.titleName} >{diet.name}</div>}
                  subtitle={<span className={classes.categoryName}>Category: {diet.category}</span>}
                  actionIcon={
                    <div className={classes.action}>
                      {auth.isAuthenticated() ? (
                        <Enroll dietId={diet._id} />
                      ) : (
                        <Link to="/signin">Sign in to Enroll</Link>
                      )}
                    </div>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      ) : (
        props.searched && (
          <Typography
            variant="subheading"
            component="h4"
            className={classes.title}
          >
            No diets found! :(
          </Typography>
        )
      )}
    </div>
  );
}
DietsSearch.propTypes = {
  diets: PropTypes.array.isRequired,
  searched: PropTypes.bool.isRequired,
};
