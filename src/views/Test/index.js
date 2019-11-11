import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { ImageUploadDropzone, DivDropzone, ImageDropzone } from '../OpportunityInvoice/components/ImageUpload';

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
      <ImageUploadDropzone>
        {(active) => <DivDropzone active={active} />}
      </ImageUploadDropzone>
      <ImageUploadDropzone>
        {active => <ImageDropzone src="https://swamedia.blob.core.windows.net/salesforce-swh-uploads/08241853393936505-test1.png" alt="installation-address" active={active} />}
      </ImageUploadDropzone>
    </div>
  );
};

export default TestView;