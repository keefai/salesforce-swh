import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import classnames from "classnames";

import "./styles.css";

export default class GooglePlacesSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.address || '',
      errorMessage: "",
      latitude: null,
      longitude: null,
      isGeocoding: false
    };
  }

  setAddress = (address) => {
    geocodeByAddress(address)
      .then(res => getLatLng(res[0]))
      .then(({ lat, lng }) => {
        this.props.getLatLng(address, lat, lng);
        this.setState({
          latitude: lat,
          longitude: lng,
          isGeocoding: false
        });
      })
      .catch(error => {
        this.setState({ isGeocoding: false });
        console.log("error", error);
      });
  };

  componentDidMount() {
    if (this.state.address.length > 0) {
      this.setAddress(this.state.address);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.address !== this.props.address) {
      this.setState({
        address: this.props.address
      });
    }
  }

  handleChange = address => {
    this.setState({
      address,
      latitude: null,
      longitude: null,
      errorMessage: ""
    });
  };

  handleSelect = selected => {
    this.setState({ isGeocoding: true, address: selected });
    this.setAddress(selected);
  };

  handleError = (status, clearSuggestions) => {
    console.log("Error from Google Maps API", status);
    this.setState({ errorMessage: status }, () => {
      clearSuggestions();
    });
  };

  render() {
    const { address, errorMessage } = this.state;
    return (
      <div className={this.props.wrapperClassName}>
        <PlacesAutocomplete
          onChange={this.handleChange}
          value={address}
          onSelect={this.handleSelect}
          onError={this.handleError}
          shouldFetchSuggestions={address.length > 2}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => {
            return (
              <div className={`MapsPlaces__search-bar-container ${this.props.className}`}>
                <div className="MapsPlaces__search-input-container">
                  <input
                    {...getInputProps({
                      placeholder: "Search Places...",
                      className: "MapsPlaces__search-input"
                    })}
                  />
                </div>
                {suggestions.length > 0 && (
                  <div className="MapsPlaces__autocomplete-container">
                    {suggestions.map(suggestion => {
                      const className = classnames(
                        "MapsPlaces__suggestion-item",
                        {
                          "MapsPlaces__suggestion-item--active":
                            suggestion.active
                        }
                      );
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, { className })}
                        >
                          <strong>
                            {suggestion.formattedSuggestion.mainText}
                          </strong>
                          &nbsp;
                          <small>
                            {suggestion.formattedSuggestion.secondaryText}
                          </small>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }}
        </PlacesAutocomplete>
        {errorMessage.length > 0 && (
          <div className="MapsPlaces__error-message">
            {this.state.errorMessage}
          </div>
        )}
      </div>
    );
  }
}