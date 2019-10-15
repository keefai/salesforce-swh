import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
// import Button from '@material-ui/core/Button';
// import CachedIcon from '@material-ui/icons/Cached';
import style from './style.module.scss';
// import CircularProgress from '@material-ui/core/CircularProgress';
import * as ZXing from '@zxing/library';



const ScannerPage = () => {
  const codeReader = new ZXing.BrowserQRCodeReader();
  const [devices, setDevices] = useState(null);

  const getDevices = async (cR) => {
    let devices = [];
    const videoInputDevices = await cR.listVideoInputDevices();
    // console.log(videoInputDevices);
    // videoInputDevices.forEach(device =>
    //   devices.push({
    //     label: device.label,
    //     deviceId: device.deviceId
    //   })
    // );
    console.log(videoInputDevices);
    setDevices(videoInputDevices);
  }

  useEffect(() => {
    getDevices(codeReader);
  }, []);

  // const [data, setData] = useState(null);
  // const [loaded, setLoaded] = useState(false);
  // const [scanned, setScanned] = useState(false);

  return (
    <React.Fragment>
      <div className={style.page}>
        <pre>
          {
            JSON.stringify(devices, null, 2)
          }
          </pre>
        <Paper className={style.paper}>
        </Paper>
      </div>
    </React.Fragment>
  );
};

export default ScannerPage;
