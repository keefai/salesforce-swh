import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
// import withAuth from './hoc/withAuth';
import { RouteWithLayout } from './components';
// import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Me as MeView,
  Invoice as InvoiceView,
  Login as LoginView,
  NotFound as NotFoundView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/me" />
      <Route path="/login" exact component={LoginView} />
      <Route path="/me" exact component={MeView} />
      <Route path="/invoice" exact component={InvoiceView} />
      <Route path="/not-found" exact component={NotFoundView} />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
