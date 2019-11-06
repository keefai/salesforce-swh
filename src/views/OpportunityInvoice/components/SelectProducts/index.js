import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import style from './style.module.scss';

const useStyles = makeStyles(theme => ({
  textField: {
    width: "100%"
  }
}));

const SelectProducts = ({ options, value, onChange }) => {
  const classes = useStyles();
  const [edit, setEdit] = React.useState(false);

  const handleChange = e => {
    console.log(e);
    onChange(e);
  };

  return (
    <div
      className={style.div}
      style={{
        background: edit ? 'white' : 'unset'
      }}
      onClick={() => setEdit(true)}
    >
      {!edit ? options.find(op => op.Id === value).Name :
        <TextField
          id="select-yes-no"
          select
          className={classes.textField}
          value={value}
          onChange={handleChange}
          SelectProps={{
            native: true
          }}
          margin="dense"
          onBlur={() => setEdit(false)}
          style={{
            margin: 0
          }}
        >
          {options.map(option => (
            <option key={option.Id} value={option.Id}>
              {option.Name}
            </option>
          ))}
        </TextField>
      }
    </div>
  );
};

export default SelectProducts;