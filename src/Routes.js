import React from 'react';
import { Switch, Route } from 'react-router-dom';
import withAuth from './hoc/withAuth';
// import { RouteWithLayout } from './components';
// import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Home as HomeView,
  Me as MeView,
  Invoice as InvoiceView,
  Login as LoginView,
  NotFound as NotFoundView,
  QRScanner as QRScannerView,
  Scanner as ScannerView,
  Barcode as BarcodeView,
  Test as TestView,
  Opportunity as OpportunityView,
  OpportunityInvoice as OpportunityInvoiceView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={withAuth(HomeView)} />
      <Route path="/login" exact component={LoginView} />
      <Route path="/me" exact component={withAuth(MeView)} />
      {/*
        <Route path="/invoice" exact component={withAuth(InvoiceView)} />
      */}
      <Route path="/invoice" exact component={withAuth(OpportunityInvoiceView)} />
      <Route path="/invoice/:opportunityId" exact component={withAuth(OpportunityInvoiceView)} />
      <Route path="/qr" exact component={QRScannerView} />
      <Route path="/scanner" exact component={ScannerView} />
      <Route path="/barcode" exact component={BarcodeView} />
      <Route path="/opportunity" exact component={withAuth(OpportunityView)} />
      <Route path="/test" exact component={TestView} />
      <Route path="*" component={NotFoundView} />
    </Switch>
  );
};

export default Routes;
