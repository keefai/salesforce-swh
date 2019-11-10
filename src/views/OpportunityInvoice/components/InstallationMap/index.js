import React, { useState, useEffect } from "react";
import _ from 'lodash';
import Dialog from '@material-ui/core/Dialog';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import GooglePlacesSearch from '../../../../components/GooglePlacesSearch';
import Map from '../Map';
import style from './style.module.scss';

const InstallationAddress = ({
  state,
  close,
  address,
  updateAddress
}) => {
  const [add, setAdd] = useState(address);
  const [latLng, setLatLng] = useState({
    lat: 0,
    lng: 0
  });

  useEffect(() => {
    if (state === true) {
      setAdd(address);
    }
  }, [address, state]);

  const setAddress = (e) => {
    updateAddress({
      ...e,
      target: {
        ...e.target,
        value: add
      }
    });
    close();
  }

  const getLatLng = (newAdd, lat, lng) => {
    setAdd(newAdd);
    setLatLng({
      lat,
      lng
    })
  };

  const handleAddress = (newAdd) => {
    setAdd(newAdd);
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
      <DialogTitle id="form-dialog-title">Installation Address</DialogTitle>
      <DialogContent>
        <div className={style.addressContainer} getLatLng={getLatLng}>
          {/*
            <TextField
              margin="dense"
              label="Installation Address"
              variant="filled"
              value={add}
              onChange={(e) => setAdd(e.target.value)}
              className={style.mapInput}
              fullWidth
            />
          */}
          <GooglePlacesSearch
            getLatLng={getLatLng}
            handleAddress={handleAddress}
            className={style.mapInput}
            wrapperClassName={style.mapInputWrapper}
            address={add}
          />
          <Map
            latLng={latLng}
            containerStyle={{
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      </DialogContent>
      <DialogActions className={style.spacedActions}>
        <Button onClick={close} color="secondary">
          Close
        </Button>
        <Button onClick={setAddress} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  )
};

export default InstallationAddress;
