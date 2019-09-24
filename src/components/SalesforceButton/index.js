import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const ColorButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText('#009EDB'),
    backgroundColor: 'rgba(0, 158, 219, 0.9)',
    '&:hover': {
      backgroundColor: 'rgb(0, 158, 219)',
    },
  },
}))(Button);

const SalesforceButton = ({ children, ...props }) => {
  return (
    <div>
      <ColorButton
        variant="contained"
        {...props}
      >
        {children}
      </ColorButton>
    </div>
  );
}

export default SalesforceButton;
