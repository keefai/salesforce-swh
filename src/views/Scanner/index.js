import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { Main as MainLayout } from '../../layouts';
import Scanner from './Scanner';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const ScannerView = ({ user }) => {
  const classes = useStyles();

  return (
    <MainLayout user={user}>
      <div className={classes.root}>
        <Grid
          container
          spacing={4}
        >
          <Scanner /> 
        </Grid>
      </div>
    </MainLayout>
  );
};

export default ScannerView;