import React from 'react';
import style from './style.module.scss';

const Sidebar = () => (
  <div className={style.sidebar}>
    <div><img src='/images/icons/print.svg' alt='print' /></div>
    <div><img src='/images/icons/edit.svg' alt='edit' /></div>
    <div><img src='/images/icons/download.svg' alt='download' /></div>
  </div>
);

export default Sidebar;