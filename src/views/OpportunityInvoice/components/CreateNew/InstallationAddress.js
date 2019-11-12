import React, { useState, useEffect } from "react";
import _ from 'lodash';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import GooglePlacesSearch from '../../../../components/GooglePlacesSearch';
import Map from '../Map';
import style from './style.module.scss';

const InstallationAddress = ({
  installationAddress,
  handleInstallationAddress,
  skip,
  nextStep
}) => {
  const [latLng, setLatLng] = useState({
    lat: 0,
    lng: 0
  });

  const getLatLng = (newAdd, lat, lng) => {
    handleInstallationAddress({
      target: {
        value: newAdd
      }
    });
    setLatLng({
      lat,
      lng
    })
  };

  const handleAddress = (newAdd) => {
    handleInstallationAddress({
      target: {
        value: newAdd
      }
    });
  }

  return (
    <React.Fragment>
      <DialogTitle id="form-dialog-title">
        <div className={style.spacedHeader}>
          <span>Installation Address</span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className={style.addressContainer}>
          <GooglePlacesSearch
            getLatLng={getLatLng}
            handleAddress={handleAddress}
            className={style.mapInput}
            wrapperClassName={style.mapInputWrapper}
            address={installationAddress}
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
