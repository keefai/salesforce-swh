import React, { useState, useEffect } from 'react';
import AutosizeInput from 'react-input-autosize';
import style from './style.module.scss';

const regexType = {
  integer: /[^0-9+-]/g,
  float: /[^0-9+-.]/g
};

const EditableInput = ({ prefix, suffix, className = '', type, onChange, min, value, onBlur, ...props }) => {
  let iRef;
  const [val, setVal] = useState(value);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setVal(value);
  }, [value]);

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

      setVal(newVal);
      onChange({
        ...e,
        target: {
          ...e.target,
          value: isNaN(parsedVal) ? null : parsedVal
        }
      });
    }

    setVal(newVal);
    onChange({
      ...e,
      target: {
        ...e.target,
        value: parsedVal
      }
    });
  }

  const onBlurMiddleware = (e) => {
    setEdit(false);
    onBlur(e);
  }

  const onDivClick = () => {
    iRef && iRef.focus();
    setEdit(true);
  }

	return (
		<div
      className={style.div}
      onClick={onDivClick}
      style={{
        background: edit ? 'white' : 'unset'
      }}
    >
      {prefix}
      <AutosizeInput
        input='text'
        inputClassName={`${style.input} ${className}`}
        onChange={onChangeMiddleware}
        value={val}
        onBlur={onBlurMiddleware}
        inputRef={el => iRef = el}
        {...props}
      />
      {suffix}
		</div>
	);
};

export default EditableInput;