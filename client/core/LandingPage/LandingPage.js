import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import GitHubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import MainFeaturedPost from './MainFeaturedPost';
import Main from './Main';
import Sidebar from './Sidebar';



const useStyles = makeStyles((theme) => ({

  mainGrid: {
    marginTop: theme.spacing(12),
  },
}));

const mainFeaturedPost = {
  title: 'TyDiet',
  description:
    "We are comes packed with more weight loss diet plans, innovative meal reminders and complete grocery lists. Plan your diet with us.",
  linkText: 'Continue reading…',
};

const sidebar = {
  title: 'Want to Know, Who we Are!?',
  description:
    'Click Here ',
  social: [
    { name: 'GitHub', icon: GitHubIcon,link: "https://github.com/JonikStyleProd" },
    { name: 'Twitter', icon: TwitterIcon, link: "https://twitter.com/?lang=en" },
    { name: 'Facebook', icon: FacebookIcon, link: "https://www.facebook.com/" },
  ],
};

export default function LandingPage() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" >
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={5} className={classes.mainGrid}>
            <Main title="About Our Project" />
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            />
          </Grid>
        </main>
      </Container>
    </React.Fragment>
  );
}