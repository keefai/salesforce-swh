import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { ImageUploadDropzone, MapDropzone, ImageDropzone } from '../OpportunityInvoice/components/ImageUpload';

const TestView = () => {
  const [img, setImg] = useState('');
  return (
    <div style={{ padding: '50px' }}>
      <h3>Test Page</h3>
      <pre>
        <code>
          {JSON.stringify(img, null, 2)}
        </code>
      </pre>
      <ImageUploadDropzone noClick={true}>
        {(active, open) => <MapDropzone address='Mumbai, Maharashtra, India' active={active} open={open} />}
      </ImageUploadDropzone>
    </div>
  );
};

export default TestView;