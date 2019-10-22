import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Popconfirm, Form } from 'antd';
import api from '../../common/api';
import DataPopup from './DataPopup';

export const Opportunity = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getOpportnities = async () => {
    setLoading(true);
    try {
      const res = await api.get('/Opportunity');
      setData(res.data.recentItems);
      console.log('opportunities: ', res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOpportnities();
  }, []);

  const [modal, setModal] = useState(false);
  const [id, setId] = useState(null);

  const showData = (id) => () => {
    setId(id);
    setModal(true);
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'Id',
      key: 'Id',
    },
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name'
    },
    {
      title: 'Action',
      key: 'Action',
      render: (text, record) => (
        <React.Fragment>
          <Button type="link" onClick={showData(record.Id)}>Show</Button>
          {/* <Button type="link" onClick={deleteData(record.Id)}>Delete</Button> */}
        </React.Fragment>
      )
    }
  ]

  return (
    <React.Fragment>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        loading={loading}
        style={{
          width: '80%',
          margin: '0px 10%'
        }}
      />
      <Modal
        title="Opportunity Data"
        centered
        visible={modal}
        destroyOnClose={true}
        onOk={() => setModal(false)}
        onCancel={() => setModal(false)}
        style={{
          minWidth: '600px',
          margin: '100px auto'
        }}
      >
        <DataPopup id={id} />
      </Modal>
    </React.Fragment>
  );
}

export default Opportunity;