import React from 'react';
import Popup from 'reactjs-popup';
import SignaturePad from 'react-signature-canvas';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import style from './style.module.scss';

const Signature = ({ state, closeModal, setSign }) => {
  const signRef = React.useRef({});

  const clear = () => signRef.current.clear();

  const save = () => {
		setSign(signRef.current.getTrimmedCanvas().toDataURL('image/png'));
		closeModal();
  };

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
    </Popup>
  );
};

export default Signature;
