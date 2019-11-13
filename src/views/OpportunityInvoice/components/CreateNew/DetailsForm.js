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

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const DetailsForm = ({
  details,
  handleDetails,
  handleConsent,
  nextStep
}) => {
  const [error, setError] = useState(null);
  const next = () => {
    // nextStep
    let err = null;
    if (details.FirstName === null || details.FirstName.trim() === '') {
      err = 'First Name is required';
    } else
    if (details.LastName === null || details.LastName.trim() === '') {
      err = 'Last Name is required';
    } else
    if (details.PersonEmail === null || details.PersonEmail.trim() === '') {
      err = 'Email is required';
    } else
    if(!validateEmail(details.PersonEmail)) {
      err = 'Please enter a valid email';
    } else
    if (details.Phone === null || details.Phone.trim() === '') {
      err = 'Mobile Number is required';
    } else if (details.consent === null || details.consent === false) {
      err = 'Please click on the checkbox to continue';
    }

    if (err) {
      setError(err);
      setTimeout(() => setError(null), 5000);
    } else {
      nextStep();
    }
  }
  return (
    <React.Fragment>
      <DialogTitle id="form-dialog-title">
        <div className={style.spacedHeader}>
          <span>Contact Details</span>
          <img src="/images/logos/swa.png" alt="swa-logo" />
        </div>
      </DialogTitle>
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
          <Grid item xs={12}>
            {error && <span style={{ color: 'red' }}>{error}</span>}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={next} color="primary">
          Next
        </Button>
      </DialogActions>
    </React.Fragment>
  )
};

export default DetailsForm;
