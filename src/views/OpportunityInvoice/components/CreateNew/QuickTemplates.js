import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import style from './style.module.scss';

const QuickTemplates = ({
  templates,
  nextStep
}) => {
  return (
    <React.Fragment>
      <DialogTitle id="form-dialog-title">Contact Details</DialogTitle>
      <DialogContent>
        <pre>{JSON.stringify(templates, null, 2)}</pre>
      </DialogContent>
      <DialogActions className={style.spacedActions}>
        {/* <Button onClick={() => setStep(STEPS.SUCCESS)} color="secondary">
          Skip
        </Button> */}
        <Button onClick={nextStep} color="primary">
          Create
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default QuickTemplates;
