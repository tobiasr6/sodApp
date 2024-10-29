import { Select, Space, Button, Spin, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'; // Importar PropTypes
import useFetchZonas from '../../../routes/fetchs/fetchZonas';
import useFetchDias from '../../../routes/fetchs/fetchDias';
import useFetchProductos from '../../../routes/fetchs/fetchProductos';
import AddCliente from './AddCliente';
import { useState } from 'react';

const { Option } = Select;

const FiltrosClientes = ({ filters, handleFilterChange, handleClearFilters }) => {
  const { zonas, loading: loadingZonas, error: errorZonas } = useFetchZonas();
  const { dias, loading: loadingDias, error: errorDias } = useFetchDias();
  const { productos, loading: loadingProductos, error: errorProductos} = useFetchProductos(); 
  
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  if (loadingZonas || loadingDias || loadingProductos) {
    return <Spin tip='Cargando...' />;
  }

  return (
    <Space
      direction='vertical'
      size='middle'
      style={{ display: 'flex', margin: 8 }}
    >
      <Space>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
        >
          Agregar Cliente
        </Button>

        <AddCliente visible={modalVisible} onClose={handleCloseModal}/>

        <Select
          placeholder='Filtrar por zona'
          onChange={(value) => handleFilterChange(value, 'zona')}
          value={filters.zona || 'Filtrar por zona'} // Asegurarte de que tenga un valor por defecto
          style={{ width: 200 }}
        >
          <Option value=''>Todos</Option>
          {zonas.map((zona) => (
            <Option key={zona.idZona} value={zona.nombreZona}>
              {zona.nombreZona}
            </Option>
          ))}
        </Select>
        <Select
          placeholder='Filtrar por producto'
          onChange={(value) => handleFilterChange(value, 'producto')} // Asegúrate de que el segundo argumento sea correcto
          value={filters.producto || 'Filtrar por producto'} // Cambiado a '' para evitar el texto por defecto
          style={{ width: 200 }}
        >
          <Option value=''>Todos</Option>
          {productos.map((producto) => (
            <Option key={producto.idProducto} value={producto.tipoProducto}>
              {producto.tipoProducto}
            </Option>
          ))}
        </Select>
        <Select
          placeholder='Filtrar por día'
          onChange={(value) => handleFilterChange(value, 'diaRecorrido')}
          value={filters.diaRecorrido || 'Filtrar por día'} // Asegúrate de que tenga un valor por defecto
          style={{ width: 200 }}
        >
          <Option value=''>Todos</Option>
          {dias.map((dia) => (
            <Option key={dia.idDia} value={dia.diaSemana}>
              {dia.diaSemana}
            </Option>
          ))}
        </Select>
        <Button onClick={handleClearFilters}>Limpiar Filtros</Button>
      </Space>
      {(errorZonas || errorDias) && (
        <Alert
          message={errorZonas || errorDias || errorProductos}
          type='error'
        />
      )}
    </Space>
  );
};

// Definición de PropTypes
FiltrosClientes.propTypes = {
  filters: PropTypes.shape({
    zona: PropTypes.string,
    producto: PropTypes.string,
    diaRecorrido: PropTypes.string
  }).isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  handleClearFilters: PropTypes.func.isRequired,
  handleAddClient: PropTypes.func.isRequired
};

export default FiltrosClientes;
