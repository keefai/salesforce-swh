import React, { useState, useEffect, useRef } from 'react';
import AutosizeInput from 'react-input-autosize';
import style from './style.module.scss';

const regexType = {
  integer: /[^0-9+-]/g,
  float: /[^0-9+-.]/g
};

class EditableInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // val: this.props.value,
      edit: false
    };
    this.iRef = null;
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.value !== this.props.value) {
  //     this.setState({
  //       val: this.props.value
  //     });
  //   }
  // }

  onChangeMiddleware = (e) => {
    let newVal = e.target.value;
    let parsedVal = newVal;

    const re = regexType[this.props.type];
    if (re) {
      newVal = newVal.replace(re, "");

      if (this.props.type === "integer") {
        parsedVal = parseInt(newVal);
      } else if (this.props.type === "float") {
        parsedVal = parseFloat(newVal);
      }

      if (isNaN(parsedVal)) {
        parsedVal = null;
      }

      if (this.props.min !== undefined) {
        if (parsedVal === null || parsedVal < this.props.min) {
          parsedVal = this.props.min;
        }
      }

      this.props.onChange({
        ...e,
        target: {
          ...e.target,
          value: parsedVal
        }
      });
    } else {
      this.props.onChange({
        ...e,
        target: {
          ...e.target,
          value: parsedVal
        }
      });
    }
  }

  onBlurMiddleware = (e) => {
    this.setState({ edit: false });
    this.props.onBlur && this.props.onBlur(e);
  }

  onDivClick = () => {
    console.log(this.iRef);
    this.iRef && this.iRef.focus();
    this.setState({ edit: true });
  }

  render() {
    const { prefix, suffix, className = '', type, onChange, min, value, onBlur, ...props } = this.props;
    return (
      <div
        className={style.div}
        onClick={this.onDivClick}
        style={{
          background: this.state.edit ? 'white' : 'unset'
        }}
      >
        {prefix}
        <AutosizeInput
          type={this.props.inputType || 'text'}
          inputClassName={`${style.input} ${className}`}
          onChange={this.onChangeMiddleware}
          value={value}
          onBlur={this.onBlurMiddleware}
          inputRef={(node) => this.iRef = node}
          {...props}
        />
        {suffix}
      </div>
    );
  }
}

export default EditableInput;