import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import evgeny from "../../assets/images/evgeny.jpg"
import beny from "../../assets/images/beny.jpg"

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
    marginTop: theme.spacing(6)
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: "#cfd8dc",
    boxShadow: "#00264d 0px 0px 20px 0px",
    border: "1px solid #2d668e",

  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const cards = [1, 2];

export default function AboutPage() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />

      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              About TyDiet
            </Typography>
            <Typography variant="h1" align="center" color="textSecondary" paragraph>
              <Typography variant="body1" gutterBottom >
                TyDiet are new company founded in 2021 ,
                we using the most common technology in our time ,
                we using MERN (MongoDB ,Express, React, Node.js)
                four key technologies that make up the stack .
              </Typography>

              <Typography variant="body2" gutterBottom>
                we created TyDiet with MERN in order to learn more and to expend our expertise about software programmer ,
                TyDiet created for Educational goals only.
                  </Typography>

            </Typography>

          </Container>
        </div>


        <Container className={classes.cardGrid} maxWidth="md">
          <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
            Our Software Engineers
            </Typography>
          <Grid container spacing={4}>

            <Grid item xs={6} sm={6} md={6}>

              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={evgeny}
 

                />

                <CardContent className={classes.cardContent}>
                  <Typography component="h1">
                    Evgeny Kisilgof
                    </Typography>
                    <Typography variant="button" display="block" gutterBottom >Founder, Engineering .</Typography>
                    <Typography variant="body1" gutterBottom >
                  Leveraging his deep understanding of engineering and culture-fit,
                  Passionate about change and improving design .
                    </Typography>
                </CardContent>

              </Card>
            </Grid>




            <Grid item xs={6} sm={6} md={6}>

              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={beny}

                />

                <CardContent className={classes.cardContent}>
                  <Typography component="h2">
                    Beny Zarba
                   </Typography>
                   <Typography variant="button" display="block" gutterBottom>Founder, Engineering .</Typography>
                   <Typography variant="body1" gutterBottom >
                 Entrepreneur, product minded.
                 Likes to build things that make life easier,
                 remove complexity and free people's time.
                   </Typography>
                </CardContent>



              </Card>
            </Grid>




          </Grid>
        </Container>
      </main>

    </React.Fragment>
  );
}