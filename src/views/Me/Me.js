import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
// import { Notifications, Password, UserData } from './components';
import { UserData } from './components';
import { Main as MainLayout } from '../../layouts';
import withAuth from '../../hoc/withAuth';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Me = ({ user }) => {
  const classes = useStyles();

  return (
    <MainLayout user={user}>
      <div className={classes.root}>
        <Grid
          container
          spacing={4}
        >
          <UserData data={user} /> 
        </Grid>
      </div>
    </MainLayout>
  );
};

export default withAuth(Me);
