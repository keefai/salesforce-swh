import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { SalesforceButton } from 'components';
import { Redirect, useParams } from 'react-router-dom';
import { Minimal as MinimalLayout } from '../../layouts';
import api from '../../common/api';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    paddingTop: 150,
    textAlign: 'center'
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  }
}));

const LoginPage = ({ location }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get('redirectTo');

  const login = () => {
    window.location = '/api/auth/login';
  }

  useEffect(() => {
    api
    .get('/whoami')
    .then(res => {
      setLoading(false);
      setRedirect(true);
    })
    .catch(err => {
      // not logged in, set redirect
      if (redirectTo) {
        localStorage.setItem('redirectTo', redirectTo);
      }
      setLoading(false);
    })
  }, []);

  if (redirect) {
    return <Redirect to={decodeURI(redirectTo)} />;
  }

  return (
    <MinimalLayout>
      <div className={classes.root}>
        <Grid
          container
          justify="center"
          spacing={4}
        >
          <Grid
            item
            lg={6}
            xs={12}
          >
            <div className={classes.content}>
              {loading ? (
              <CircularProgress
                style={{
                  color: '#009EDB'
                }}
              />
              ) : (
                <SalesforceButton onClick={login}>
                  Login Using Salesforce
                  <img
                    alt="cloud-sf"
                    src="/images/logos/logo--white.png"
                    style={{ height: '17px', marginLeft: '10px' }}
                  />
                </SalesforceButton>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </MinimalLayout>
  );
};

export default LoginPage;
