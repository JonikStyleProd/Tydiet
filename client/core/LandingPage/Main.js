import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: theme.spacing(3),
  },
}));

export default function Main(props) {
  const classes = useStyles();
  const { title } = props;

  return (
    <Grid item xs={12} md={8}>
      <Typography variant="h4" display="block" gutterBottom size="large">
        {title}
      </Typography>
      <Divider />
      <Typography variant="h5" gutterBottom className={classes.main}>
        We know that it is difficult to lose weight so we give in our app the
        tools that will help you lose weight easily, efficiently and in the
        right way for you. Our site gives a huge variety of diets in different
        categories and allows you to sign up for a diet that suits you and track
        day after day and mark each day you went through a diet successfully. We
        hope that using our app will help you achieve the desired result and
        live a healthier life with the help of a better diet. We let you share
        your diets and help others as we hope to help you.
      </Typography>
    </Grid>
  );
}

Main.propTypes = {
  title: PropTypes.string,
};
