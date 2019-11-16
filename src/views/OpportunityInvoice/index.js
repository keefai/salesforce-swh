import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withSnackbar } from 'notistack';
import style from './style.module.scss';
import api from '../../common/api';
import { 
  emitOpportunity,
  subscribeToOpportunity,
  unSubscribeToOpportunity,
  emitOpportunitySystemImage,
  subscribeToOpportunitySystemImage,
  unSubscribeToOpportunitySystemImage
} from '../../common/socket';
import Invoice from './Invoice';
import Create from './Create';

const OpportunityInvoice = props => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [templates, setTemplates] = useState(null);
  const [opportunity, setOpportunity] = useState(null);
  const [products, setProducts] = useState(null);
  const [oppProducts, setOppProducts] = useState(null);
  const [oppImages, setOppImages] = useState(null);
  const [account, setAccount] = useState(null);
  const [pricebook, setPricebook] = useState(null);

  const { opportunityId = null } = props.match.params;

  const getOpportunity = async (id, showLoading = true) => {
    showLoading && setLoading(true);
    try {
      const res = await api.get(`/Opportunity/${id}`);
      emitOpportunity(id);
      console.log('Opportunity: ', res.data);
      setOpportunity(res.data);
      if (res.data) {
        await getPricebook(res.data.Pricebook2Id);
        await getAccount(res.data.AccountId);
        await getOpportunityProducts(id);
        await getProducts(res.data.AccountId);
      }
    } catch (err) {
      console.log(err);
      setError(err);
    } finally {
      showLoading && setLoading(false);
    }
  };

  const getPricebook = async (id) => {
    try {
      const res = await api.get(`/PricebookProducts/${id}`);
      console.log('getPricebook: ', res);
      setPricebook(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const getAccount = async (id) => {
    try {
      const res = await api.get(`/Account/${id}`);
      console.log('Account: ', res);
      setAccount(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const getProducts = async () => {
    try {
      const res = await api.get(`/Products`);
      console.log('Products: ', res);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      setError(err);
    }
  }

  const getOpportunityProducts = async (id) => {
    try {
      const res = await api.get(`/OpportunityProducts/${id}`);
      console.log('OppProducts: ', res.data);
      setOppProducts(res.data);
    } catch (err) {
      console.log(err);
      setError(err);
    }
  }

  const getOpportunityImages = async (id) => {
    try {
      const res = await api.get(`/OpportunityImages/${id}`);
      console.log('OpportunityImages: ', res.data);
      setOppImages(res.data);
    } catch (err) {
      console.log(err);
      setError(err);
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
      getOpportunity(opportunityId);
      getProducts();
      getOpportunityImages(opportunityId);

      subscribeToOpportunity(opportunityId, (d) => {
        console.log('subscribeToOpportunity: ', d);
        props.enqueueSnackbar('Invoice Updated', {
          autoHideDuration: 1000
        });
        getOpportunity(opportunityId, false);
      });

      subscribeToOpportunitySystemImage(opportunityId, (d) => {
        console.log('subscribeToOpportunitySystemImage: ', d);
        getOpportunityImages(opportunityId); 
      })

      return () => {
        unSubscribeToOpportunity(opportunityId, (d) => {
          console.log('unSubscribeToOpportunity: ', d);
        });

        unSubscribeToOpportunitySystemImage(opportunityId, (d) => {
          console.log('unSubscribeToOpportunitySystemImage: ', d);
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
    return <Invoice
      data={opportunity}
      account={{
        Id: account.Id,
        FirstName: account.FirstName,
        LastName: account.LastName,
        PersonEmail: account.PersonEmail,
        Phone: account.Phone
      }}
      getAccount={getAccount}
      oppProducts={oppProducts.records}
      oppImages={oppImages.records}
      products={products.records.filter(p => Boolean(pricebook.records.find(pb => pb.Product2Id === p.Id)))}
    />;
  }

  if (templates && templates.totalSize > 0) {
    return <Create templates={templates.records} />
  }

  return null;
};

export default withSnackbar(OpportunityInvoice);
