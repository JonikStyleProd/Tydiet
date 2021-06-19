import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://localhost:3000/">
        TyDiet
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: "transparent",
    // marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),

  },
}));

export default function FooterAll() {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" >
        TyDiet
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
        We are working for you.
        </Typography>
        <Copyright />
      </Container>
    </footer>
  );
}

