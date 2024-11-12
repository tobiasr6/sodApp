// components/BusquedaClientes.js
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

const BusquedaClientes = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Pasamos el valor de búsqueda al componente padre
  };

  return (
    <Input
      placeholder="Buscar por nombre"
      prefix={<SearchOutlined />}
      value={searchTerm}
      onChange={handleSearch}
      style={{ width: 200, marginLeft: 10 }}
    />
  );
};

export default BusquedaClientes;
