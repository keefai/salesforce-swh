import React from 'react';
import style from './style.module.scss';

const Sidebar = ({ exportPDF }) => {
	return (
		<div className={style.sidebar}>
			<div onClick={() => window.print()}><img src='/images/icons/print.svg' alt='print' /></div>
			<div><img src='/images/icons/edit.svg' alt='edit' /></div>
			<div onClick={exportPDF}><img src='/images/icons/download.svg' alt='download' /></div>
		</div>
	);
};

export default Sidebar;