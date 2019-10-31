import React, { useState, useEffect } from "react";
import _ from 'lodash';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import Map from '../Map';
import style from './style.module.scss';

const STEPS = Object.freeze({
	DETAILS: 'DETAILS',
	ADDRESS: 'ADDRESS',
	SUCCESS: 'SUCCESS'
});

const CreateNew = ({ state, open, close }) => {
	const [step, setStep] = useState(STEPS.DETAILS);
	const [data, setData] = useState({
    firstname: null,
    lastname: null,
    email: null,
		mobile: null,
		postalAddress: null,
		installationAddress: null,
    consent: false
	});

  const handleData = key => e => {
    setData({
      ...data,
      [key]: e.target.value
    });
  };

  const handleConsent = e => {
    setData({
      ...data,
      consent: e.target.checked
    });
	}
	
	const renderDetails = () => (
		<React.Fragment>
			<DialogTitle id="form-dialog-title">Contact Details</DialogTitle>
			<DialogContent>
				<Grid container spacing={1}>
					<Grid item xs={6}>
						<TextField
							margin="dense"
							label="First Name"
							variant="outlined"
							value={data.firstname}
							onChange={handleData("firstname")}
							fullWidth
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							margin="dense"
							label="Last Name"
							variant="outlined"
							value={data.lastname}
							onChange={handleData("lastname")}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							margin="dense"
							label="Email Address"
							type="email"
							variant="outlined"
							value={data.email}
							onChange={handleData("email")}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							margin="dense"
							label="Mobile"
							variant="outlined"
							value={data.mobile}
							onChange={handleData("mobile")}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<div className={style.postalAddressContainer}>
							<TextField
								margin="dense"
								label="Postal Address"
								variant="filled"
								value={data.postalAddress}
								onChange={handleData('postalAddress')}
								className={style.mapInput}
								fullWidth
							/>	
							<Map
								address={data.postalAddress}
								containerStyle={{
									width: '100%',
									height: '100%'
								}}
							/>
						</div>
					</Grid>
					<Grid item xs={12}>
						<Checkbox
							checked={data.consent}
							onChange={handleConsent}
							color="primary"
							inputProps={{
								'aria-label': 'secondary checkbox',
							}}
						/> I accept the <a href="/" target="_blank">Terms of Use</a> and <a href="/" target="_blank">Privacy Policy</a>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions className={style.spacedActions}>
				<Button onClick={close} color="secondary">
					Close
				</Button>
				<Button onClick={() => setStep(STEPS.ADDRESS)} color="primary">
					Next
				</Button>
			</DialogActions>
		</React.Fragment>
	)

	const renderAddress = () => (
		<React.Fragment>
		<DialogTitle id="form-dialog-title">Installation Address</DialogTitle>
		<DialogContent>
			<div className={style.addressContainer}>
				<TextField
					margin="dense"
					label="Installation Address"
					variant="filled"
					value={data.installationAddress}
					onChange={handleData('installationAddress')}
					className={style.mapInput}
					fullWidth
				/>	
				<Map
					address={data.installationAddress}
					containerStyle={{
						width: '100%',
						height: '100%'
					}}
				/>
			</div>
		</DialogContent>
		<DialogActions className={style.spacedActions}>
			<Button onClick={() => setStep(STEPS.SUCCESS)}  color="secondary">
				Skip
			</Button>
			<Button onClick={() => setStep(STEPS.SUCCESS)} color="primary">
				Next
			</Button>
		</DialogActions>
	</React.Fragment>
	)

  const renderSuccess = () => (
		<React.Fragment>
			<DialogContent>
				<h1 style={{
					padding: '50px',
					textAlign: 'center'
				}}>Success</h1>
			</DialogContent>
			<DialogActions>
				<Button onClick={close} color="primary">
					Close
				</Button>
		</DialogActions>
	</React.Fragment>
	)

	const renderState = () => {
		if (step === STEPS.DETAILS) return renderDetails();
		if (step === STEPS.ADDRESS) return renderAddress();
		if (step === STEPS.SUCCESS) return renderSuccess();
		return null;
	}

  return (
		<Dialog
			disableBackdropClick
      disableEscapeKeyDown
			open={state}
			onClose={close}
			aria-labelledby="create-new"
			className={style.dialog}
		>
			{renderState()}	
		</Dialog>
  );
};

export default CreateNew;
