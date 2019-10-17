import React from 'react';
import Map from '../Invoice/components/Map';

const TestView = () => {
  return (
    <div style={{ padding: '50px' }}>
      <h3>Test Page</h3>
      <Map address="Eiffel Tower, Paris" /> 
    </div>
  );
};

export default TestView;