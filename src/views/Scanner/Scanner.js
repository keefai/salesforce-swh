import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CachedIcon from '@material-ui/icons/Cached';
import style from './style.module.scss';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as ZXing from '@zxing/library';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const codeReader = new ZXing.BrowserMultiFormatReader();

const ScannerPage = () => {
  const [devices, setDevices] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState(null);
  const [scanned, setScanned] = useState(false);

  const getDevices = async () => {
    let devices = [];
    const videoInputDevices = await codeReader.listVideoInputDevices();
    setDevices(videoInputDevices);
    setSelectedDevice(videoInputDevices[0].deviceId);
    setLoaded(true);
  }

  const scan = () => {
    codeReader.decodeFromVideoDevice(selectedDevice, 'scanner', (result, err) => {
      if (result) {
        console.log(result.text);
        setData(result.text);
        setScanned(true);
      }
      if (err && !(err instanceof ZXing.NotFoundException)) {
        console.error(err);
      }
    });
  }

  // useEffect(() => {
  //   getDevices();
  // }, []);

  useEffect(() => {
    getDevices();
    scan();
  }, [selectedDevice]);

  const onDeviceChange = (e) => {
    setSelectedDevice(e.target.value);
  }

  const reScan = () => {
    setData(null);
    setScanned(false);
    codeReader.reset();
    getDevices();
    scan();
  }

  const renderLoader = () => (
    <div className={style.loading}>
      <CircularProgress style={{ color: '#222' }} />
    </div>
  );

  const renderScanner = () => (
    <React.Fragment>
      <video id="scanner" className={style.scanner} />
      <br />
      <Select
        value={selectedDevice}
        onChange={onDeviceChange}
      >
        {devices.map((d) => (
          <MenuItem value={d.deviceId} key={d.deviceId}>{d.label}</MenuItem>
        ))}
      </Select>
    </React.Fragment>
  );

  const renderResult = () => (
    <div className={style.output}>
      <h3>{data}</h3>
      <br />
      <Button
        variant="contained"
        color="default"
        startIcon={<CachedIcon />}
        onClick={reScan}
      >
        Rescan
      </Button>
    </div>
  );

  return (
    <React.Fragment>
      <div className={style.page}>
        <Paper className={style.paper}>
          {loaded ? (scanned ? renderResult() : renderScanner()) : renderLoader()}
        </Paper>
      </div>
    </React.Fragment>
  );
};

export default ScannerPage;
