import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const RouteWithLayout = props => {
  const { component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={matchProps => <Component {...matchProps} />}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  path: PropTypes.string,
  auth: PropTypes.bool
};

export default RouteWithLayout;
