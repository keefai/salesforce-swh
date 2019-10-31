import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import style from './style.module.scss';
import api from '../../common/api';
import { emitOpportunity, subscribeToOpportunity, unSubscribeToOpportunity } from '../../common/socket';
import Invoice from './Invoice';

const OpportunityInvoice = props => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const { opportunityId } = props.match.params;

  const getOpportnity = async id => {
    setLoading(true);
    try {
      const res = await api.get(`/Opportunity/${id}`);
      emitOpportunity(id);
      console.log(res);
      setData(res.data);
    } catch (err) {
      console.log(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Id: ', opportunityId);
    getOpportnity(opportunityId);
    subscribeToOpportunity(opportunityId, (d) => {
      console.log('subscribeToOpportunity: ', d);
      getOpportnity(opportunityId);
    });

    return () => {
      unSubscribeToOpportunity(opportunityId, (d) => {
        console.log('unSubscribeToOpportunity: ', d);
      });
    };
  }, [props.match.params.opportunityId]);

  if (loading) {
    return (
      <div className={style.loadingOrErrorContainer}>
        <CircularProgress
          style={{
            color: '#009EDB'
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.loadingOrErrorContainer}>
        <h3>Error Fetching Opportunity</h3>
      </div>
    );
  }

  if (data) {
    return <Invoice data={data} />;
  }

  return null;
};

export default OpportunityInvoice;
