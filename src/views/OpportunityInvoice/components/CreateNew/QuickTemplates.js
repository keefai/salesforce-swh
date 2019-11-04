import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import style from './style.module.scss';

const QuickTemplates = ({
  templates,
  templateId,
  handleTemplate,
  nextStep
}) => {
  return (
    <React.Fragment>
      <DialogTitle id="form-dialog-title">Templates</DialogTitle>
      <DialogContent>
        <RadioGroup aria-label="template" name="template" value={templateId} onChange={handleTemplate}>
          {templates.map((t, i) => (
            <FormControlLabel value={t.Id} control={<Radio />} label={t.Name} />
          ))}
        </RadioGroup>
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
