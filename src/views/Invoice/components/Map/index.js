import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import CircularProgress from '@material-ui/core/CircularProgress';
const googleMapsClient = require("@google/maps").createClient({
  key: process.env.REACT_APP_googleMapKey,
  Promise: Promise
});

  const LoadingContainer = (props) => (
    <div className={style.mapLoadingContainer}>
      <CircularProgress
        style={{
          color: '#009EDB'
        }}
      />
    </div>
  );

const GoogleMap = ({ google, address, className, ...props }) => {
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0
  });

  useEffect(() => {
    googleMapsClient
      .geocode({
        address: address
      })
      .asPromise()
      .then(response => {
        console.log("Geocoding Res: ", response.json.results[0].geometry.location);
        setLocation(response.json.results[0].geometry.location);
      });
  }, [address]);

	return (
    <Map
      google={google}
      mapType='SATELLITE'
      mapTypeControl={false}
      streetViewControl={false}
      rotateControl={false}
      fullscreenControl={false}
      scaleControl={false}
      zoom={18}
      center={location}
      className={`${style.map} ${className}`}
      {...props}
    >
      <Marker position={location} />
    </Map>
	);
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_googleMapKey,
  LoadingContainer: LoadingContainer
})(GoogleMap);