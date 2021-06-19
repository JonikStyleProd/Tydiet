import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import auth from './../auth/auth-helper'
import DietPage from './DietPage'
import LandingPage from './LandingPage/LandingPage'
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "auto",
    minHeight: '100vh',
  },
  paper: {
    padding: theme.spacing(4),
		textAlign: 'left',
		color: theme.palette.text.secondary,
  },
	homeControl: {
    marginTop: "1rem",
		top: '4rem',
  }
}))

export default function Home({history}){
  

  const classes = useStyles()
  const [defaultPage, setDefaultPage] = useState(false)

  useEffect(()=> {
    setDefaultPage(auth.isAuthenticated())
    const unlisten = history.listen (() => {
      setDefaultPage(auth.isAuthenticated())
    })
    return () => {
      unlisten()
    }
  }, [])

    return (
        <div className={classes.root}>
        { !defaultPage &&
          <LandingPage />
        }
        {defaultPage && 
         <DietPage />
        }
      </div>
    )
}
