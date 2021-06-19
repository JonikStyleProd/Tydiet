import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AboutPage from "./AboutPage/AboutPage"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "auto",
    minHeight: '100vh',
  },
}))

export default function About({history}){
    const classes = useStyles()
    return (
        <div className={classes.root}>
          <AboutPage />
      </div>
    )
}
