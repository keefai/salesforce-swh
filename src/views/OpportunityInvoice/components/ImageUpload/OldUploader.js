import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withSnackbar } from 'notistack';
import { DropzoneArea } from "material-ui-dropzone";
import Fab from '@material-ui/core/Fab';
import RefreshIcon from '@material-ui/icons/Refresh';
import api from '../../../../common/api';
import style from './style.module.scss';

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploaded: false,
      uploading: false,
      error: null
    };
  }

  handleChange = files => {
    this.setState({
      uploading: true
    });
    const data = new FormData();
    data.append('image', files[0]);
    api.post('/uploadImage', data)
      .then((res) => {
        console.log('uploadImage: ', res.data);
        this.setState({
          uploaded: true
        });
        this.props.setImg(res.data.url);
      })
      .catch((err) => {
        console.log('uploadImage Error: ', err);
        this.setState({
          error: err
        });
      })
      .finally(() => {
        this.setState({
          uploading: false
        });
      });
  };

  dropzoneText = () => (
    <div className={style.dropzoneText}>
      Drag and Drop File Here
      <br />
      <span>or click to select</span>
    </div>
  )

  reUpload = () => {
    this.setState({
      uploading: false,
      error: null
    });
  }

  render() {
    if (this.state.uploading) {
      return (
        <div className={style.container}>
          <div>
            <CircularProgress />
          </div>
          <div style={{ marginTop: '20px' }}>Uploading</div>
        </div>
      );
    }

    if (this.state.error) {
      return (
        <div className={style.container}>
          <div style={{ color: 'red' }}>Error Uploading File. Retry Again.</div>
          <Fab color="secondary" aria-label="retry" onClick={this.reUpload}>
            <RefreshIcon />
          </Fab>
        </div>
      );
    }

    if (this.state.uploaded) {
      return (
        <div className={style.container}>
          <div>Image Uploaded. Please wait...</div>
        </div>
      );
    }

    return (
      <DropzoneArea
        dropzoneClass={style.dropzone}
        onChange={this.handleChange}
        filesLimit={1}
        acceptedFiles={['image/*']}
        dropzoneText={this.dropzoneText()}
      />
    );
  }
}

export default withSnackbar(ImageUpload);
