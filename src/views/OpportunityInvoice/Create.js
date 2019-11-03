import React, { useState, useEffect, useCallback } from 'react';
import { withSnackbar } from 'notistack';
import CreateNew from './components/CreateNew';
import api from '../../common/api';

const CreateOpportunity = ({ templates, ...props }) => {
  const [data, setData] = useState({
    details: {
      FirstName: null,
      LastName: null,
      email: null,
      Phone: null,
      BillingAddress: null,
      consent: false
    },
    installationAddress: null,
    templateId: templates[0].Id
  });

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
    console.log('SUBMIT: ', data);
    try {
      const res = await api.post('/createOpportunity', data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <CreateNew
      details={data.details}
      handleDetails={handleDetails}
      handleConsent={handleConsent}
      installationAddress={data.installationAddress}
      handleInstallationAddress={handleInstallationAddress}
      templates={templates}
      state={true}
      close={() => { console.log('CLOSE') }}
      submitData={submitData}
    />
  );
};

export default withSnackbar(CreateOpportunity);
