import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import style from './style.module.scss';
import DetailsFrom from './DetailsForm';
import InstallationAddress from './InstallationAddress';
import QuickTemplates from './QuickTemplates';

const STEPS = Object.freeze({
  DETAILS: 'DETAILS',
  ADDRESS: 'ADDRESS',
  TEMPLATE: 'TEMPLATE'
});

const CreateNew = ({
  state,
  close,
  templates,
  details,
  handleDetails,
  handleConsent,
  installationAddress,
  handleInstallationAddress,
  submitData
}) => {
  const [step, setStep] = useState(STEPS.DETAILS);

  const renderSuccess = () => (
    <React.Fragment>
      <DialogContent>
        <h1
          style={{
            padding: '50px',
            textAlign: 'center'
          }}
        >
          Success
        </h1>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Close
        </Button>
      </DialogActions>
    </React.Fragment>
  );

  const renderState = () => {
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
            handleInstallationAddress({ e: { target: { value: null } } });
          }}
          nextStep={() => setStep(STEPS.TEMPLATE)}
        />
      );
    if (step === STEPS.TEMPLATE)
      return (
        <QuickTemplates
          templates={templates}
          nextStep={submitData}
        />
      );
    return null;
  };

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
    </Dialog>
  );
};

export default CreateNew;
