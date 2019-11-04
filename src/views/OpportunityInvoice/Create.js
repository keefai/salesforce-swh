import React, { useState, useEffect, useCallback } from 'react';
import { withSnackbar } from 'notistack';
import { Redirect } from 'react-router-dom';
import CreateNew from './components/CreateNew';
import api from '../../common/api';

const CreateOpportunity = ({ templates, ...props }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [oppRes, setOppRes] = useState(null);
  const [data, setData] = useState({
    details: {
      FirstName: null,
      LastName: null,
      PersonEmail: null,
      Phone: null,
      BillingAddress: null,
      consent: false
    },
    installationAddress: null,
    templateId: templates[0].Id
  });

  const handleTemplate = e => {
    setData({
      ...data,
      templateId: e.target.value
    });
  };

  const handleDetails = field => e => {
    setData({
      ...data,
      details: {
        ...data.details,
        [field]: e.target.value
      }
    });
  };

  const handleConsent = e => {
    setData({
      ...data,
      details: {
        ...data.details,
        consent: e.target.checked
      }
    });
  }

  const handleInstallationAddress = e => {
    setData({
      ...data,
      installationAddress: e.target.value
    });
  }

  const submitData = async () => {
    setLoading(true);
    console.log('SUBMIT: ', data);
    try {
      const res = await api.post('/createOpportunity', data);
      console.log(res.data);
      setOppRes(res.data);
    } catch (err) {
      setError(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (oppRes) {
    return <Redirect to={`/invoice/${oppRes.id}`} /> 
  }

  return (
    <CreateNew
      loading={loading}
      error={error}
      details={data.details}
      handleDetails={handleDetails}
      handleConsent={handleConsent}
      installationAddress={data.installationAddress}
      handleInstallationAddress={handleInstallationAddress}
      templateId={data.templateId}
      templates={templates}
      handleTemplate={handleTemplate}
      state={true}
      close={() => { console.log('CLOSE') }}
      submitData={submitData}
    />
  );
};

export default withSnackbar(CreateOpportunity);
