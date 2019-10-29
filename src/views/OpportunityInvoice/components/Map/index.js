import React, { useState, useEffect, useCallback } from 'react';
import style from './style.module.scss';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import api from '../../../../common/api';
import _ from 'lodash';

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

  const fetchGeocoding = async (add) => {
    try {
      const res = await api.post('/geocoding', { address: add });
      console.log(res.data);
      setLocation(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const debouncedFetchGeocoding = useCallback(_.debounce(fetchGeocoding, 1500), []);

  useEffect(() => {
    debouncedFetchGeocoding(address);
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