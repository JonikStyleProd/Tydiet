import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import auth from "../auth/auth-helper";
import Search from "../diet/Search";
import Grid from "@material-ui/core/Grid";
import {listCategories} from '../diet/api-diet.js'
import Card from '@material-ui/core/Card'
import {listPublished} from '../diet/api-diet'
import Typography from '@material-ui/core/Typography'
import Diets from './../diet/Diets'
import Categories from "../diet/Categories";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
    marginTop: 90
  },
  card: {
    width:'96%',
    margin: 'auto',
    marginTop: 20,
    marginBottom: theme.spacing(2),
    padding: 30,
    backgroundColor: '#cfd8dc',
    boxShadow: '#00264d 0px 0px 20px 0px',
    border: "1px solid #2d668e",
  },
}));

export default function Diet() {


  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const [categories, setCategories] = useState([])
  const [diets, setDiets] = useState([])
  const [enrolled, setEnrolled] = useState([])

  useEffect(() => {
  const abortController = new AbortController()
  const signal = abortController.signal
  listPublished(signal).then((data) => {
    if (data.error) {
      console.log(data.error)
    } else {
      setDiets(data)
    }
  })
  return function cleanup(){
    abortController.abort()
  }
}, [])


  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listCategories(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);
  return (
    <div className={classes.root}>
      {auth.isAuthenticated().user && (
        <div>
                  <Grid container spacing={1}>
        <Grid item xs={12} sm={12}>
          <Search categories={categories}/>
          <Categories categories={categories}/>
        </Grid>
        </Grid>
        </div>
      )}
    </div>
  );
}
