import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { withSnackbar } from 'notistack';
import Dialog from '@material-ui/core/Dialog';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from '@material-ui/core/CircularProgress';
import style from './style.module.scss';
import api from '../../../../common/api';
import { difference } from '../../../../common/helpers';

const PaymentModal = ({
  state,
  close,
  ...props
}) => {

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={state}
      onClose={close}
      aria-labelledby="edit-account"
      className={style.dialog}
    >
      <DialogTitle id="form-dialog-title" style={style.title}>Pay As You Save With Easy Finance</DialogTitle>
      <DialogContent>
        <h5>I would like repayments over 60 months</h5>
        <Grid container spacing={1}>
          <Grid item xs={6}>Estimated Monthly repayment*</Grid>
          <Grid item xs={6}>$ 123.00</Grid>
          <Grid item xs={6}>Estimated monthly solar savings^</Grid>
          <Grid item xs={6}>$ 200.00</Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={style.spacedActions}>
        <Button onClick={close} color="secondary">
          Cancel
        </Button>
        <Button color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withSnackbar(PaymentModal);
