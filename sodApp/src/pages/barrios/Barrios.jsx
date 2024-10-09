import { useState, useRef } from 'react';
import { Spin, Table, Alert, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './barrios.css';
import useFetchBarrios from '../../routes/fetchs/fetchBarrios';

const Barrios = () => {
  const { barrios, loading, error } = useFetchBarrios();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Buscar por barrio`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ fontSize: 20, color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'idBarrio',
      key: 'idBarrio',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombreBarrio',
      key: 'nombreBarrio',
      ...getColumnSearchProps('nombreBarrio'), // Añadir buscador en esta columna
    },
    {
      title: 'Zona',
      dataIndex: 'idZona',
      key: 'idZona',
    },
  ];

  if (loading) return <Spin />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="barrios">
      <h1>Barrios</h1>
      <Table 
        dataSource={barrios} 
        columns={columns} 
        rowKey="idBarrio" 
        pagination={{ pageSize: 5 }} 
      />
    </div>
  );
};

export default Barrios;
