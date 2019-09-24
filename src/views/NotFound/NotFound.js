import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { Minimal as MinimalLayout } from '../../layouts';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    paddingTop: 150,
    textAlign: 'center'
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  }
}));

const NotFound = () => {
  const classes = useStyles();

  return (
    <MinimalLayout>
      <div className={classes.root}>
        <Grid
          container
          justify="center"
          spacing={4}
        >
          <Grid
            item
            lg={6}
            xs={12}
          >
            <div className={classes.content}>
              <img
                alt="404"
                className={classes.image}
                src="/images/undraw_page_not_found_su7k.svg"
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </MinimalLayout>
  );
};

export default NotFound;
