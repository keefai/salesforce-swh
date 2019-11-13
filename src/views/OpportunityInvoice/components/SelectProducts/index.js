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

  return (
    <div
      className={style.div}
      style={{
        background: edit ? 'white' : 'unset'
      }}
      onClick={() => setEdit(true)}
    >
      {!edit ? value ? options.find(op => op.Id === value).Name : <i style={{ color: '#A9A9A9' }}>Select Product</i> :
        <TextField
          id="select-product"
          select
          className={classes.textField}
          value={value}
          onChange={onChange}
          SelectProps={{
            native: true
          }}
          margin="dense"
          onBlur={() => setEdit(false)}
          style={{
            margin: 0
          }}
        >
          {!value && (
            <option key='select' value={null}>
              Select Product
            </option>
          )}
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