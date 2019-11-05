import React, { useState, useEffect } from "react";
import _ from 'lodash';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import Map from '../Map';
import style from './style.module.scss';

const DetailsForm = ({
  details,
  handleDetails,
  handleConsent,
  nextStep
}) => {
  return (
    <React.Fragment>
      <DialogTitle id="form-dialog-title">Contact Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="First Name"
              variant="outlined"
              value={details.FirstName}
              onChange={handleDetails("FirstName")}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Last Name"
              variant="outlined"
              value={details.LastName}
              onChange={handleDetails("LastName")}
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
              value={details.PersonEmail}
              onChange={handleDetails("PersonEmail")}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Mobile"
              variant="outlined"
              value={details.Phone}
              onChange={handleDetails("Phone")}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Checkbox
              checked={details.consent}
              onChange={handleConsent}
              color="primary"
              inputProps={{
                'aria-label': 'secondary checkbox',
              }}
            /> I accept the <a href="/" target="_blank">Terms of Use</a> and <a href="/" target="_blank">Privacy Policy</a>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {/*
          <Button onClick={close} color="secondary">
            Close
          </Button>
        */}
        <Button onClick={nextStep} color="primary">
          Next
        </Button>
      </DialogActions>
    </React.Fragment>
  )
};

export default DetailsForm;
