import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

const Home = () => {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const redirectTo = localStorage.getItem('redirectTo');
    if (redirectTo && redirectTo !== '/') {
      console.log('HERE');
      setRedirect(redirectTo);
    } else {
      console.log('THERE');
      setRedirect('/me');
    }
    localStorage.removeItem('redirectTo');
  }, []);

  if (redirect) {
    return <Redirect to={decodeURI(redirect)} />;
  }

  return null;
};

export default Home;
