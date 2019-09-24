import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { Sidebar, Topbar, Footer } from './components';
import socket from '../../common/socket';
import api from '../../common/api';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%'
  }
}));

const Main = props => {
  const { children, user = null } = props;
  const [expired, setExpired] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  let timer = null;
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  const ping = async () => {
    let salesforceOK = false;
    const socketOK = socket.connected;
    if (socketOK) {
      console.log('SOCKET LIVE');

      try {
        const res = await api.get('/whoami');
        salesforceOK = true;
        console.log('SALESFORCE LIVE');
      } catch (err) {
        console.log(err);
      }
  
      if (!salesforceOK) {
        console.log('SALESFORCE DOWN');
        setExpired('SALESFORCE');
        socket.off('ping', ping);
        socket.disconnect();
        clearInterval(timer);
        return;
      }
    }

    if (!socketOK) {
      console.log('SOCKET DOWN');
      setExpired('SOCKET');
      socket.off('ping', ping);
      socket.disconnect();
      clearInterval(timer);
      return;
    }
  }

  useEffect(() => {
    // socket.on('ping', ping);
    // return () => {
    //   socket.off('ping', ping);
    // }
    // TIMER
    timer = setInterval(ping, 10 * 60 * 1000);
    return () => {
      clearInterval(timer);
    }
  }, []);

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Topbar onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        user={user}
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <Dialog
        open={expired}
        disableBackdropClick
        disableEscapeKeyDown
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ display: 'flex', justifyContent: 'center', fontSize: '20px' }}>Session Expired!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{ textAlign: 'center' }}>
          It seems that your session has expired or you have lost connection to server.
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ display: 'flex', justifyContent: 'center'}}>
          <Button href='/api/auth/login' color="secondary" autoFocus>
            Login Again
          </Button>
        </DialogActions>
      </Dialog>
      <main className={classes.content}>
        {children}
      </main>
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
