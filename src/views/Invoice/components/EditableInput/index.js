import React, { useState } from 'react';
import AutosizeInput from 'react-input-autosize';
import style from './style.module.scss';

const regexType = {
  integer: /^\d+$/,
  float: /^\d+(\.(\d+)?)?$/
};

const EditableInput = ({ prefix, suffix, className = '', type, onChange, min, ...props }) => {
  // const [width, setWidth] = useState(props.value.length);
  const onChangeMiddleware = (e) => {
    const re = regexType[type];

    if (re) {
      if (e.target.value === '' || re.test(e.target.value)) {
        if (min !== undefined && (e.target.value === '' || Number(e.target.value) < Number(min))) {
          e.target.value = min;
        }
        onChange(e);
      }
    } else {
      onChange(e);
    }
  }

	return (
		<React.Fragment>
      {prefix}
      <AutosizeInput
        input='text'
        inputClassName={`${style.input} ${className}`}
        onChange={onChangeMiddleware} 
        {...props}
      />
      {suffix}
		</React.Fragment>
	);
};

export default EditableInput;