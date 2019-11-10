import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import ImageUpload from '../OpportunityInvoice/components/ImageUpload';

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
      <Paper style={{
        maxWidth: '500px',
        minHeight: '400px'
      }}>
        <ImageUpload setImg={setImg} id='abcd' />
      </Paper>
    </div>
  );
};

export default TestView;