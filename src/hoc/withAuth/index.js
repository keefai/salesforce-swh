import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import api from '../../common/api';
import { FullPageLoader } from '../../components';
import { useLocation} from "react-router-dom";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
      setLoading(true);
      api
        .get('/whoami')
        .then(res => {
          setUser(res.data);
        })
        .catch(err => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        })
    }, []);

    if (loading) {
      return <FullPageLoader />;
    }

    if (error) {
      return <Redirect to={`/login?redirectTo=${encodeURI(location)}`} />
    }

    return (
      <WrappedComponent
        user={user}
        {...props}
      />
    );
  }
};

export default withAuth;
