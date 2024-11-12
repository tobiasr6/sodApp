import useFetchProducto from '../../routes/fetchs/fetchProductos'
import { Table, Spin, Alert } from 'antd';

const Productos = () => {
  const { productos, loading: loadingProductos, error: errorProductos } = useFetchProducto();

  if (loadingProductos) return <Spin tip="Cargando productos..." />;
  if (errorProductos) return <Alert message="Error al cargar productos" type="error" />;

  const columns = [
    {
      title:'Id',
      dataIndex: 'idProducto',
      key: 'idProducto',
    },
    {
      title: 'Producto',
      dataIndex: 'tipoProducto',
      key: 'tipoProducto',
    },
    {
      title: 'Costo',
      dataIndex: 'valorProducto',
      key: 'valorProducto',
    },
  ];

    return (
        <>
          <h1>Productos</h1>

        <Table columns={columns} dataSource={productos} rowKey="idZona" pagination={{ pageSize: 5 }}  />
        </>
    )
}

export default Productos;