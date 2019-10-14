import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { Main as MainLayout } from '../../layouts';
import QRScanner from './QRScanner';

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
          <QRScanner /> 
        </Grid>
      </div>
    </MainLayout>
  );
};

export default Me;
