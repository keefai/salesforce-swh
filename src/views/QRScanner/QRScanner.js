import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-reader';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CachedIcon from '@material-ui/icons/Cached';
import style from './style.module.scss';
import CircularProgress from '@material-ui/core/CircularProgress';

const QRScannerPage = () => {
  const [qrData, setQRData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [scanned, setScanned] = useState(false);

  const onScan = data => {
    if (data) {
      setScanned(true);
      setQRData(data);
    }
  }

  const onError = err => {
    console.error(err)
  }

  const onLoad = () => {
    setLoaded(true);
  }

  const reScan = () => {
    setQRData(null);
    setScanned(false);
  }

  return (
    <React.Fragment>
      <div className={style.page}>
        <Paper className={style.paper}>
          {!loaded && (
            <div className={style.loading}>
              <CircularProgress style={{ color: '#222' }} />
            </div>
          )}
          {
            scanned ? (
              <div className={style.output}>
                <h3>{qrData}</h3>
                <br />
                <Button
                  variant="contained"
                  color="default"
                  startIcon={<CachedIcon />}
                  onClick={reScan}
                >
                  Rescan
                </Button>
              </div>) : (
                <QrReader
                  delay={0}
                  onError={onError}
                  onScan={onScan}
                  onLoad={onLoad}
                  showViewFinder={false}
                  className={style.qrReader}
                />
              )
          }
        </Paper>
      </div>
    </React.Fragment>
  );
};

export default QRScannerPage;
