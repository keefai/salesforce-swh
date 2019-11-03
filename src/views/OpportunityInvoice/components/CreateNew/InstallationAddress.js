import React, { useState, useEffect } from "react";
import _ from 'lodash';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Map from '../Map';
import style from './style.module.scss';

const InstallationAddress = ({
  installationAddress,
  handleInstallationAddress,
  skip,
  nextStep
}) => {
  return (
    <React.Fragment>
      <DialogTitle id="form-dialog-title">Installation Address</DialogTitle>
      <DialogContent>
        <div className={style.addressContainer}>
          <TextField
            margin="dense"
            label="Installation Address"
            variant="filled"
            value={installationAddress}
            onChange={handleInstallationAddress}
            className={style.mapInput}
            fullWidth
          />
          <Map
            address={installationAddress}
            containerStyle={{
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      </DialogContent>
      <DialogActions className={style.spacedActions}>
        <Button onClick={skip}>
          Skip
  			</Button>
        <Button onClick={nextStep} color="primary">
          Next
  			</Button>
      </DialogActions>
    </React.Fragment>
  )
};

export default InstallationAddress;
