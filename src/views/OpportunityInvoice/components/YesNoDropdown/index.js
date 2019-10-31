import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import style from './style.module.scss';

const yesNo = [
  {
    value: true,
    label: "Yes"
  },
  {
    value: false,
    label: "No"
  }
];

const useStyles = makeStyles(theme => ({
  textField: {
    width: "100%"
  }
}));

const YesNoDropdown = ({ value, onChange }) => {
  const classes = useStyles();
  const [edit, setEdit] = React.useState(false);

  const handleChange = e => {
    const val = Boolean(e.target.value === "true");
    onChange({
      ...e,
      target: {
        ...e.target,
        value: val
      }
    });
  };

  return (
    <div onClick={() => setEdit(true)}>
      {!edit ? value === true ? "Yes" : "No" :
        <TextField
          id="standard-select-currency-native"
          select
          className={classes.textField}
          value={value}
          onChange={handleChange}
          SelectProps={{
            native: true
          }}
          margin="normal"
          onBlur={() => setEdit(false)}
          style={{
            margin: 0
          }}
        >
          {yesNo.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      }
    </div>
  );
};

export default YesNoDropdown;