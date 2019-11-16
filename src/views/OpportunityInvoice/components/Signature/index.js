import React, { useState, useRef } from 'react';
import { withSnackbar } from 'notistack';
import Popup from 'reactjs-popup';
import CircularProgress from "@material-ui/core/CircularProgress";
import SignaturePad from 'react-signature-canvas';
import dataURLtoBlob from 'blueimp-canvas-to-blob';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import api from '../../../../common/api';
import { SystemImageTypes } from '../../helpers';
import style from './style.module.scss';

const Signature = ({ state, closeModal, oppId, ...props }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  const signRef = useRef({});

  const clear = () => signRef.current.clear();

  const handleUpdate = (imageObj) => {
    try {
      const res = api.post(`/OpportunityImages/${oppId}`, {
        ...imageObj,
        type: SystemImageTypes.CUSTOMER_SIGNATURE
      });
      console.log(res);
      props.enqueueSnackbar('Signature Updated', {
        autoHideDuration: 1000
      });
    } catch (err) {
      props.enqueueSnackbar('Error Updating Signature', {
        autoHideDuration: 1000
      });
      console.log(err);
      throw err;
    }
  }

  const handleUpload = async (blob) => {
    // setSign(signRef.current.getTrimmedCanvas().toDataURL('image/png'));
    setUploading(true);
    const data = new FormData();
    data.append('image', blob, 'signature.png');
    setUploading(true);
    try {
      const imageRes = await api.post('/uploadImage', data);
      await handleUpdate(imageRes.data);
      closeModal();
    } catch (err) {
      setError(err);
    } finally {
      setUploading(false);
    }
  }

  const save = () => {
    const dataURL = signRef.current.getTrimmedCanvas().toDataURL('image/png');
    const blob = dataURLtoBlob(dataURL);
    handleUpload(blob);
  };

  const renderState = () => {
    if (uploading) {
      return (
        <React.Fragment>
          <div className={style.loadingContainer}>
            <CircularProgress />
            <div style={{ marginTop: '20px' }}>Uploading</div>
          </div>
          <div className={style.actions}>
            <div>&nbsp;</div>
          </div>
        </React.Fragment>
      )
    }

    if (error) {
      return (
        <React.Fragment>
          <div className={style.loadingContainer}>
            Error Updating Signature
          </div>
          <div className={style.actions}>
            <div>
              <Button color="secondary" onClick={closeModal}>
                Close
              </Button>
            </div>
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <SignaturePad
          ref={signRef}
          canvasProps={{
            className: style.signPad
          }}
        />
        <div className={style.actions}>
          <div>
            <IconButton onClick={clear} aria-label="clear">
              <DeleteIcon />
            </IconButton>
          </div>
          <div>
            <Button color="primary" onClick={save}>
              Save
            </Button>
            <Button color="secondary" onClick={closeModal}>
              Close
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }

  return (
    <Popup
      open={state}
      onClose={closeModal}
      closeOnDocumentClick={false}
      position="right center"
      contentStyle={{
        padding: '0px',
        border: '0px',
        minWidth: '200px'
      }}
    >
      {renderState()}
    </Popup>
  );
};

export default withSnackbar(Signature);
