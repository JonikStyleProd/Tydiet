import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Add from '@material-ui/icons/AddBox'
import {makeStyles} from '@material-ui/core/styles'
import {newDay} from './api-diet'
import auth from '../auth/auth-helper'
//import {useTranslation} from "react-i18next";


const useStyles = makeStyles(theme => ({
    form: {
        minWidth: 500,
        backgroundColor: '#cfd8dc',
    boxShadow: '#00264d 0px 0px 20px 0px',
    border: "1px solid #2d668e",
    }
}))

export default function NewDay(props) {
  

  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState({
    title: '',
    content: '',
    resource_url: ''
  })
  
  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }
  const clickSubmit = () => {
    const jwt = auth.isAuthenticated()
    const day = {
      title: values.title || undefined,
      content: values.content || undefined,
      resource_url: values.resource_url || undefined
    }
    newDay({
      dietId: props.dietId
    }, {
      t: jwt.token
    }, day).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
          props.addDay(data)
          setValues({...values, title: '',
          content: '',
          resource_url: ''})
          setOpen(false)
      }
    })
  }
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button aria-label="Add Day" color="primary" variant="contained" onClick={handleClickOpen}>
        <Add/> &nbsp; New Day
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <div className={classes.form}>
        <DialogTitle id="form-dialog-title">Add New Day</DialogTitle>
        <DialogContent>
          
          <TextField
            margin="dense"
            label="title"
            type="text"
            fullWidth
            variant="outlined"
            value={values.title} onChange={handleChange('title')}
          /><br/>
          <TextField
            margin="dense"
            label="Content"
            type="text"
            multiline
            rows="5"
            fullWidth
            variant="outlined"
            value={values.content} onChange={handleChange('content')}
          /><br/>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Cancel
          </Button>
          <Button onClick={clickSubmit} color="secondary" variant="contained">
            Add
          </Button>
        </DialogActions>
        </div>
      </Dialog>
    </div>
  )
}
newDay.propTypes = {
    dietId: PropTypes.string.isRequired,
    addDay: PropTypes.func.isRequired
  }