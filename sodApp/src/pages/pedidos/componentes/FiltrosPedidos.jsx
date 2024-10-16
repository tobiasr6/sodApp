import { Select, Space, Button, Spin, Alert } from 'antd';
import useFetchZonas from '../../../routes/fetchs/fetchZonas';
import useFetchDias from '../../../routes/fetchs/fetchDias';
import useFetchProductos from '../../../routes/fetchs/fetchProductos';

const { Option } = Select;

const FiltrosPedidos = ({
  filters,
  handleFilterChange,
  handleClearFilters
}) => {
  const { zonas, loading: loadingZonas, error: errorZonas } = useFetchZonas();
  const { dias, loading: loadingDias, error: errorDias } = useFetchDias();
  const {
    productos,
    loading: loadingProductos,
    error: errorProductos
  } = useFetchProductos();

  if (loadingZonas || loadingDias || loadingProductos) {
    return <Spin tip='Cargando...' />;
  }

  return (
    <Space
      direction='vertical'
      size='middle'
      style={{ display: 'flex', marginBottom: 16, padding: '0 16px' }}
    >
      <Space>
        <Select
          placeholder='Filtrar por producto'
          onChange={(value) => handleFilterChange(value, 'producto')}
          value={filters.producto || ''}
          style={{ width: 200 }}
        >
          <Option value=''>Todos los productos</Option>
          {productos.map((producto) => (
            <Option key={producto.idProducto} value={producto.tipoProducto}>
              {producto.tipoProducto}
            </Option>
          ))}
        </Select>
        <Select
          placeholder='Filtrar por zona'
          onChange={(value) => handleFilterChange(value, 'zona')}
          value={filters.zona || ''}
          style={{ width: 200 }}
        >
          <Option value=''>Todas las zonas</Option>
          {zonas.map((zona) => (
            <Option key={zona.idZona} value={zona.nombreZona}>
              {zona.nombreZona}
            </Option>
          ))}
        </Select>
        <Select
          placeholder='Filtrar por día'
          onChange={(value) => handleFilterChange(value, 'dia')}
          value={filters.dia || ''}
          style={{ width: 200 }}
        >
          <Option value=''>Todos los días</Option>
          {dias.map((dia) => (
            <Option key={dia.idDia} value={dia.diaSemana}>
              {dia.diaSemana}
            </Option>
          ))}
        </Select>
        <Button onClick={handleClearFilters}>Limpiar Filtros</Button>
      </Space>
      {(errorZonas || errorDias || errorProductos) && (
        <Alert
          message={errorZonas || errorDias || errorProductos}
          type='error'
        />
      )}
    </Space>
  );
};

export default FiltrosPedidos;
