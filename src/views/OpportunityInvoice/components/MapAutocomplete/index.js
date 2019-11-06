import React, { useState, useEffect, useCallback } from 'react';
import style from './style.module.scss';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from "@material-ui/core/TextField";
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

class GoogleMapAutocomplete extends React.Component {
// const GoogleMap = ({ google, map, address, setAddress, label, className, ...props }) => {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        lat: 0,
        lng: 0
      }
    }
  }

  componentDidMount() {
    this.renderAutoComplete();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps.map) this.renderAutoComplete();
    if (this.props.address !== prevProps.address) this.debouncedFetchGeocoding(this.props.address);
  }

  fetchGeocoding = async (add) => {
    try {
      const res = await api.post('/geocoding', { address: add });
      console.log(res.data);
      this.setState({
        location: res.data
      });
    } catch (err) {
      console.log(err);
    }
  }

  renderAutoComplete = () => {
    const { google, map } = this.props;

    if (!google || !map) return;

    const autocomplete = new google.maps.places.Autocomplete(this.autocomplete);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry) return;

      if (place.geometry.viewport) map.fitBounds(place.geometry.viewport);
      else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      this.setState({ location: place.geometry.location });
    });
  }

  debouncedFetchGeocoding = useCallback(_.debounce(this.fetchGeocoding, 2000), []);

  onSubmit(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div className={style.addressContainer}>
        {/*
        <TextField
          margin="dense"
          label={label}
          variant="filled"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={style.mapInput}
          fullWidth
        />
        */}
        <form onSubmit={this.onSubmit}>
          <input
            placeholder="Enter a location"
            ref={ref => (this.autocomplete = ref)}
            type="text"
          />

          <input className={style.button} type="submit" value="Go" />
        </form>

        <Map
          google={this.props.google}
          mapType='SATELLITE'
          mapTypeControl={false}
          streetViewControl={false}
          rotateControl={false}
          fullscreenControl={false}
          scaleControl={false}
          zoom={18}
          center={this.state.location}
          className={`${style.map}`}
          containerStyle={{
            width: '100%',
            height: '100%'
          }}
          {...this.props}
        >
          <Marker position={this.state.location} />
        </Map>
      </div>
    );
  }
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_googleMapKey,
  LoadingContainer: LoadingContainer
})(GoogleMapAutocomplete);
