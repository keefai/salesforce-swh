import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import withAuth from './hoc/withAuth';
import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Me as MeView,
  Login as LoginView,
  NotFound as NotFoundView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/me"
      />
      <RouteWithLayout
        component={LoginView}
        exact
        path="/login"
      />
      <RouteWithLayout
        component={MeView}
        exact
        path="/me"
      />
      {/* <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      /> */}
      <RouteWithLayout
        component={NotFoundView}
        exact
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
