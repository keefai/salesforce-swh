import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import withAuth from './hoc/withAuth';
// import { RouteWithLayout } from './components';
// import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Me as MeView,
  Invoice as InvoiceView,
  Login as LoginView,
  NotFound as NotFoundView,
  QRScanner as QRScannerView,
  Scanner as ScannerView,
  Barcode as BarcodeView,
  Test as TestView,
  Opportunity as OpportunityView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/me" />
      <Route path="/login" exact component={LoginView} />
      <Route path="/me" exact component={withAuth(MeView)} />
      <Route path="/invoice" exact component={withAuth(InvoiceView)} />
      <Route path="/qr" exact component={QRScannerView} />
      <Route path="/scanner" exact component={ScannerView} />
      <Route path="/barcode" exact component={BarcodeView} />
      <Route path="/opportunity" exact component={withAuth(OpportunityView)} />
      {/*
        <Route path="/test" exact component={TestView} />
      */}
      <Route path="/not-found" exact component={NotFoundView} />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
