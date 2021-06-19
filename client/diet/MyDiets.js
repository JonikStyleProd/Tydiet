import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import auth from '../auth/auth-helper'
import {listByInstructor} from './api-diet.js'
import {Redirect, Link} from 'react-router-dom'
//import {useTranslation} from "react-i18next";


const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 800,
    margin: 'auto',
    padding: theme.spacing(4),
    alignItems: "center",
    marginTop: 80,
    backgroundColor: '#cfd8dc',
    boxShadow: '#00264d 0px 0px 20px 0px',
    border: "1px solid #2d668e",
    marginBottom: theme.spacing(25)
  },
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px` ,
    color: theme.palette.secondary,
    fontSize: '1.8em'
  },
  addButton:{
    float:'right'
  },
  leftIcon: {
    marginRight: "8px"
  },
  avatar: {
    borderRadius: 0,
    width:105,
    height: 80
  },
  listText: {
    marginLeft: 16,


  },
  linklist: {
    border: "1px solid #2d668e",
    boxShadow: '#00264d 0px 0px 5px 0px',
    marginBottom: theme.spacing(2)
  }
}))

export default function MyDiets(){
  

  const classes = useStyles();
  const [diets, setDiets] = useState([])
  const [redirectToSignin, setRedirectToSignin] = useState(false)
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listByInstructor({
      userId: jwt.user._id
    }, {t: jwt.token}, signal).then((data) => {
      if (data.error) {
        setRedirectToSignin(true)
      } else {
        setDiets(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])

  if (redirectToSignin) {
    return <Redirect to='/signin'/>
  }
  return (

      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          My Diet's
          <span className={classes.addButton}>
            <Link to="/creating/diet/new">
              <Button color="primary" variant="contained">
                <Icon className={classes.leftIcon}>add_box</Icon> New Diet
              </Button>
            </Link>
          </span>
        </Typography>
        <List dense>
        {diets.map((diet, i) => {
            return   <Link to={"/creating/diet/"+diet._id} key={i} >
              <ListItem button className={classes.linklist}>
                <ListItemAvatar>
                  <Avatar src={'/api/diets/photo/'+diet._id+"?" + new Date().getTime()} className={classes.avatar}/>
                </ListItemAvatar>
                <ListItemText primary={<Typography variant="h6" gutterBottom>{diet.name}</Typography>} secondary={diet.description} className={classes.listText} />
              </ListItem>
              <Divider/>
            </Link>})}
        </List>
      </Paper>
)
}