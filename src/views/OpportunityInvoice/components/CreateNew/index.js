import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import Dialog from '@material-ui/core/Dialog';
import style from './style.module.scss';
import DetailsFrom from './DetailsForm';
import InstallationAddress from './InstallationAddress';
import CircularProgress from '@material-ui/core/CircularProgress';
import QuickTemplates from './QuickTemplates';
import GooglePlacesSearch from '../../../../components/GooglePlacesSearch';
import Map from '../Map';

const STEPS = Object.freeze({
  DETAILS: 'DETAILS',
  ADDRESS: 'ADDRESS',
  TEMPLATE: 'TEMPLATE'
});

const CreateNew = ({
  error,
  loading,
  state,
  close,
  templateId,
  templates,
  handleTemplate,
  details,
  handleDetails,
  handleConsent,
  installationAddress,
  handleInstallationAddress,
  submitData
}) => {
  const [step, setStep] = useState(STEPS.DETAILS);

  const renderSteps = () => {
    if (step === STEPS.DETAILS)
      return (
        <DetailsFrom
          details={details}
          handleDetails={handleDetails}
          handleConsent={handleConsent}
          nextStep={() => setStep(STEPS.ADDRESS)}
        />
      );
    if (step === STEPS.ADDRESS)
      return (
        <InstallationAddress
          installationAddress={installationAddress}
          handleInstallationAddress={handleInstallationAddress}
          skip={() => {
            handleInstallationAddress({ target: { value: null } });
            setStep(STEPS.TEMPLATE);
          }}
          nextStep={() => setStep(STEPS.TEMPLATE)}
        />
      );
    if (step === STEPS.TEMPLATE)
      return (
        <QuickTemplates
          templates={templates}
          templateId={templateId}
          handleTemplate={handleTemplate}
          nextStep={submitData}
        />
      );
    return null;
  };

  const renderLoading = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '300px'
    }}>
      <CircularProgress style={{ color: '#009EDB' }} />
    </div> 
  );

  const renderError = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '300px'
    }}>
      Error Creating Opportunity
    </div> 
  );

  const renderState = () => {
    if (loading)
      return renderLoading();
    if (error)
      return renderError();
    return renderSteps();
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={state}
      onClose={close}
      aria-labelledby="create-new"
      className={style.dialog}
    >
      {renderState()}
      <Map
        latLng={{
          lat: 0,
          lng: 0
        }}
        containerStyle={{
          display: 'none'
        }}
      />
    </Dialog>
  );
};

export default CreateNew;
