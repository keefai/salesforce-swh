import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CachedIcon from '@material-ui/icons/Cached';
import CameraAltSharpIcon from '@material-ui/icons/CameraAltSharp';
import style from './style.module.scss';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Webcam from "react-webcam";
import Quagga from 'quagga';

const videoConstraints = {
  width: 1500,
  height: 1500,
  facingMode: "user"
};

const dataURItoBlob = (dataURI) => {
  var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var binary = atob(dataURI.split(',')[1]);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
     array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: mime});
}

const ScannerPage = () => {
  const webcamRef = React.useRef(null);
  const [data, setData] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [rescanError, setRescanError] = useState(false);
  // useEffect(() => {
  //   Quagga.init({
  //     inputStream : {
  //       name : "Live",
  //       type : "ImageStream",
  //       target: document.querySelector('#viewport')
  //     },
  //     constraints: {
  //       width: 640,
  //       height: 480,
  //       facingMode: "environment"
  //     },
  //     decoder: {
  //       readers : ["code_128_reader"]
  //     }
  //   }, function(err) {
  //       if (err) {
  //           console.log(err);
  //           return
  //       }
  //       console.log("Initialization finished. Ready to start");
  //       Quagga.start();

  //       Quagga.onDetected((data) => {
  //         console.log('DETECTED: ', data);
  //       })
  //   });
  // }, []);

  const reScan = () => {
    setData(null);
    setScanned(false);
  }

  const fileSelected = (e) => {
    Quagga.decodeSingle({
      src: URL.createObjectURL(e.target.files[0]),
      decoder: {
          readers: ["code_128_reader"] // List of active readers
      },
    }, (data) => {
      console.log(data);
      if (data && data.codeResult && data.codeResult.code) {
        setScanned(true);
        setData(data.codeResult.code);
      } else {
        setRescanError(true);
        setTimeout(() => {
          setRescanError(false);
        }, 3000);
      }
    });
  }

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      const im = URL.createObjectURL(dataURItoBlob(imageSrc));
      console.log(im);
      Quagga.decodeSingle({
        src: im,
        decoder: {
            readers: ["code_128_reader"] // List of active readers
        },
      }, (data) => {
        console.log(data);
        if (data && data.codeResult && data.codeResult.code) {
          setScanned(true);
          setData(data.codeResult.code);
        } else {
          setRescanError(true);
          setTimeout(() => {
            setRescanError(false);
          }, 3000);
        }
      });
    },
    [webcamRef]
  );

  const renderScanner = () => (
    <React.Fragment>
      <h4>File Upload Try</h4>
      <br />
      <input type="file" accept="image/*;capture=camera" onChange={fileSelected}/>
      <br />
      <hr />
      <br />
      <h4>File Upload Try</h4>
      <br />
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={500}
        videoConstraints={videoConstraints}
      />
      <br />
      <Button
        variant="contained"
        color="default"
        startIcon={<CameraAltSharpIcon />}
        onClick={capture}
      >
        Capture
      </Button>
      <br />
       { rescanError && (
        <h3>No Bar Code Found. Try Again</h3>
      )}
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
          { scanned ? renderResult() : renderScanner() }
        </Paper>
      </div>
    </React.Fragment>
  );
};

export default ScannerPage;
