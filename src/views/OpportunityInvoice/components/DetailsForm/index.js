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

const DetailsForm = ({
  state,
  close,
  account,
  getAccount,
  ...props
}) => {
  const [accData, setAccData] = useState(account);
  const [loading, setLoading] = useState(false);

  const handleAccData = (field) => e => {
    setAccData({
      ...accData,
      [field]: e.target.value
    });
  }

  const updateAccount = async () => {
    setLoading(true);
    const diff = difference(accData, account);
    console.log('ACCOUNT PATCH: ', diff);
    try {
      await api.patch(`/Account/${accData.Id}`, diff);
      await getAccount(account.Id);
      props.enqueueSnackbar('Account Updated', {
        autoHideDuration: 1000
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      close();
    }
  };

  if (loading) {
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={state}
        onClose={close}
        aria-labelledby="edit-account"
        className={style.dialog}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px'
        }}>
          <CircularProgress style={{ color: '#009EDB' }} />
        </div> 
      </Dialog>
    );
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={state}
      onClose={close}
      aria-labelledby="edit-account"
      className={style.dialog}
    >
      <DialogTitle id="form-dialog-title">Account</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="First Name"
              variant="outlined"
              value={accData.FirstName}
              onChange={handleAccData("FirstName")}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Last Name"
              variant="outlined"
              value={accData.LastName}
              onChange={handleAccData("LastName")}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Email Address"
              type="email"
              variant="outlined"
              value={accData.PersonEmail}
              onChange={handleAccData("PersonEmail")}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Mobile"
              variant="outlined"
              value={accData.Phone}
              onChange={handleAccData("Phone")}
              fullWidth
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className={style.spacedActions}>
        <Button onClick={close} color="secondary">
          Close
        </Button>
        <Button onClick={updateAccount} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withSnackbar(DetailsForm);
