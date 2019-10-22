import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import 'antd/dist/antd.css';
import { createBrowserHistory } from 'history';
import { Chart } from 'react-chartjs-2';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import validate from 'validate.js';

import { chartjs } from './helpers';
import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import Routes from './Routes';

const browserHistory = createBrowserHistory();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

export default class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={2}>
          <Router history={browserHistory}>
            <Routes />
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    );
  }
}
