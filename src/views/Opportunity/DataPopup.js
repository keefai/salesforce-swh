import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import api from '../../common/api';

export const DataPopup = ({ id }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getOpportnity = async () => {
    if (id) {
      setLoading(true);
      try {
        const res = await api.get(`/Opportunity/${id}`);
        setData(Object.keys(res.data).map(d => ({ key: d, val: res.data[d] })));
        console.log('Opportunity: ', res);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    getOpportnity();
  }, []);

  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Value',
      dataIndex: 'val',
      key: 'val'
    }
  ]

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      loading={loading}
      style={{
        width: '100%'
      }}
    />
  );
}

export default DataPopup;