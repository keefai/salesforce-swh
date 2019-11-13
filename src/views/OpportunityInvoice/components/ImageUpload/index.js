import React, { useState, useCallback } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import classnames from "classnames";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useDropzone } from "react-dropzone";
import Fab from '@material-ui/core/Fab';
import RefreshIcon from '@material-ui/icons/Refresh';
import api from '../../../../common/api';
import styles from "./style.module.scss";
import Map from '../Map';

const UploadButton = (props) => (
  <Fab color="default" aria-label="upload" {...props}>
    <CloudUploadIcon />
  </Fab>
);

export const ImageUploadDropzone = ({ children, setImg, noClick = false }) => {
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    setUploading(true);
    const file = acceptedFiles[0];
    console.log(file);
    const data = new FormData();
    data.append('image', file);
    api.post('/uploadImage', data)
      .then((res) => {
        console.log('uploadImage: ', res.data);
        setUploaded(true);
        setTimeout(() => {
          setUploaded(false);
        }, 2000);
        setImg(res.data.url);
      })
      .catch((err) => {
        console.log('uploadImage Error: ', err);
        setError(err);
      })
      .finally(() => {
        setUploading(false);
      });
    // Do something with the files
  }, []);

  const reUpload = () => {
    setUploading(false);
    setError(null);
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
    maxSize: 3000000,
    noClick: noClick
  });

  if (uploading) {
    return (
      <div className={styles.container}>
        <div>
          <CircularProgress />
        </div>
        <div style={{ marginTop: '20px' }}>Uploading</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ color: 'red' }}>Error Uploading File. Retry Again.</div>
        <br />
        <Fab color="secondary" aria-label="retry" size="medium" onClick={reUpload}>
          <RefreshIcon />
        </Fab>
      </div>
    );
  }

  if (uploaded) {
    return (
      <div className={styles.container}>
        <div>Image Uploaded. Please wait...</div>
      </div>
    );
  }

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {children(isDragActive, open)}
    </div>
  );
};

export const MyDropzone = ({ className, style, active, showSubtext = true }) => {
  const classes = classnames(styles.myDropzone, {
    [styles.myDropzoneActive]: active
  }, className);

  return (
    <div className={classes}>
      <div className={styles.dropzoneText}>
        Drag and Drop File Here
        <br />
        {showSubtext && <span>or click to select</span>}
      </div>
      <CloudUploadIcon className={styles.dropzoneIcon} />
    </div>
  );
};

export const ImageDropzone = ({ active, src, alt }) => {
  return (
    <div className={styles.dropzoneImageContainer}>
      <img src={src} alt={alt} className={styles.dropzoneImage} />
      {active && (
        <MyDropzone
          className={styles.dropzoneActiveForImage}
          active={active}
          showSubtext={false}
        />
      )}
    </div>
  );
};

export const DivDropzone = ({ active, src, alt }) => {
  return (
    <div className={styles.divDropzone}>
      <MyDropzone active={active} />
    </div>
  );
};

export const MapDropzone = ({ active, open, address}) => {
  return (
    <div className={styles.dropzoneImageContainer}>
      <Map
        address={address}
        containerStyle={{
          position: 'relative',
          width: '100%',
          height: '400px'
        }}
      />
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '15px'
      }}>
        <UploadButton onClick={open} />
      </div>
      {active && (
        <MyDropzone
          className={styles.dropzoneActiveForImage}
          active={active}
          showSubtext={false}
        />
      )}
    </div>
  );
}