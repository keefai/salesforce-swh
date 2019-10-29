import React, { useState } from 'react';
import AutosizeInput from 'react-input-autosize';
import style from './style.module.scss';

const regexType = {
  integer: /[^0-9+-]/g,
  float: /[^0-9+-.]/g
};

const EditableInput = ({ prefix, suffix, className = '', type, onChange, min, value, ...props }) => {
  const [val, setVal] = useState(value);

  const onChangeMiddleware = (e) => {
    let newVal = e.target.value;
    let parsedVal = newVal;

    const re = regexType[type];
    if (re) {
      newVal = newVal.replace(re, "");

      if (type === "integer") {
        parsedVal = parseInt(newVal);
      } else if (type === "float") {
        parsedVal = parseFloat(newVal);
      }
    }

    setVal(newVal);
    onChange({
      ...e,
      target: {
        ...e.target,
        value: isNaN(parsedVal) ? null : parsedVal
      }
    });
  }

	return (
		<React.Fragment>
      {prefix}
      <AutosizeInput
        input='text'
        inputClassName={`${style.input} ${className}`}
        onChange={onChangeMiddleware} 
        value={val}
        {...props}
      />
      {suffix}
		</React.Fragment>
	);
};

export default EditableInput;