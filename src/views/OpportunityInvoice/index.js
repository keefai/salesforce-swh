import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withSnackbar } from 'notistack';
import style from './style.module.scss';
import api from '../../common/api';
import { emitOpportunity, subscribeToOpportunity, unSubscribeToOpportunity } from '../../common/socket';
import Invoice from './Invoice';
import Create from './Create';

const OpportunityInvoice = props => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [templates, setTemplates] = useState(null);
  const [opportunity, setOpportunity] = useState(null);
  const [account, setAccount] = useState(null);

  const { opportunityId = null } = props.match.params;

  const getOpportnity = async (id, showLoading = true) => {
    showLoading && setLoading(true);
    try {
      const res = await api.get(`/Opportunity/${id}`);
      emitOpportunity(id);
      console.log(res);
      setOpportunity(res.data);
      if (res.data) {
        await getAccount(res.data.AccountId);
      }
    } catch (err) {
      console.log(err);
      setError(err);
    } finally {
      showLoading && setLoading(false);
    }
  };

  const getAccount = async (id) => {
    try {
      const resAcc = await api.get(`/Account/${id}`);
      setAccount(resAcc.data);
    } catch (err) {
      console.log(err);
    }
  }

  const getTemplates = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/opportunityTemplates`);
      console.log(res);
      setTemplates(res.data);
    } catch (err) {
      console.log(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log('opportunityId: ', opportunityId);
    if (opportunityId) {
      console.log('Id: ', opportunityId);
      getOpportnity(opportunityId);
      subscribeToOpportunity(opportunityId, (d) => {
        console.log('subscribeToOpportunity: ', d);
        props.enqueueSnackbar('Invoice Updated', {
          autoHideDuration: 1000
        });
        getOpportnity(opportunityId, false);
      });

      return () => {
        unSubscribeToOpportunity(opportunityId, (d) => {
          console.log('unSubscribeToOpportunity: ', d);
        });
      };
    } else {
      getTemplates();
    }
  }, []);

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

  if (opportunityId && opportunity) {
    return <Invoice data={opportunity} account={{
      Id: account.Id,
      FirstName: account.FirstName,
      LastName: account.LastName,
      PersonEmail: account.PersonEmail,
      Phone: account.Phone
    }} getAccount={getAccount} />;
  }

  if (templates && templates.totalSize > 0) {
    return <Create templates={templates.records} />
  }

  return null;
};

export default withSnackbar(OpportunityInvoice);
