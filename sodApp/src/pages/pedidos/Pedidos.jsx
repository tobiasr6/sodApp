import { useState } from 'react';
import { Table, Typography, Card, Row, Col, Statistic } from 'antd';
import { ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';
import FiltrosPedidos from './componentes/FiltrosPedidos'; // Importamos el nuevo componente de filtros
import useFetchClientes from '../../routes/fetchs/fetchClientes'; // Ruta del hook
import ConsultingCliente from '../clientes/components/ConsultingCliente';

const { Title } = Typography;

const Pedidos = () => {
  const [clientes, setClientes] = useFetchClientes();
  const [filters, setFilters] = useState({
    zona: '',
    producto: '',
    dia: ''
  });

  const handleFilterChange = (value, key) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const handleClearFilters = () => {
    setFilters({
      zona: '',
      producto: '',
      dia: ''
    });
  };

  // Genera los pedidos en base a los clientes importados
  const pedidosAplanados = clientes.flatMap(cliente => 
    cliente.pedidos.map(pedido => ({
      id: cliente.id, // referencia al cliente
      nombre: cliente.nombre,
      direccion: cliente.direccion,
      telefono: cliente.telefono,
      observaciones: cliente.observaciones,
      nombreZona: cliente.nombreZona,
      idBarrio: cliente.idBarrio,
      nombreBarrio: cliente.nombreBarrio,
      cantidad: pedido.cantidad, // cantidad del producto
      producto: pedido.producto, // tipo de producto
      diasRecorrido: cliente.diasRecorrido.map(dia => dia.dia).join(', ') // transformamos los días en una cadena
    }))
  );

  const applyFilters = () => {
    return pedidosAplanados.filter((pedido) => {
      const matchesZona = filters.zona ? pedido.nombreZona === filters.zona : true;
      const matchesProducto = filters.producto
        ? pedido.producto.toLowerCase() === filters.producto.toLowerCase()
        : true;
      const matchesDia = filters.dia
        ? pedido.diasRecorrido.includes(filters.dia)
        : true;
      return matchesZona && matchesProducto && matchesDia;
    });
  };

  const filteredPedidos = applyFilters();

  // Calcular el total de pedidos y productos
  const totalPedidos = filteredPedidos.length;
  const totalProductos = filteredPedidos.reduce(
    (acc, pedido) => acc + pedido.cantidad,
    0
  );

  const columns = [
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad'
    },
    {
      title: 'Producto',
      dataIndex: 'producto',
      key: 'producto'
    },
    {
      title: 'Zona',
      dataIndex: 'nombreZona',
      key: 'nombreZona'
    },
    {
      title: 'Nombre del Cliente',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {text}
          <ConsultingCliente cliente={clientes.find(c => c.id === record.id)} />
        </div>
      )
    },
    {
      title: 'Días de Recorrido',
      dataIndex: 'diasRecorrido',
      key: 'diasRecorrido'
    }
  ];

  return (
    <div>
      <Card
        style={{
          margin: 16,
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Row gutter={16} align='middle'>
          <Col span={24}>
            <Title level={3} style={{ marginBottom: 24, color: '#1890ff' }}>
              Resumen de pedidos:
            </Title>
          </Col>
          <Col xs={24} sm={12}>
            <Statistic
              title='Total de pedidos'
              value={totalPedidos}
              prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Statistic
              title='Total de productos'
              value={totalProductos}
              prefix={<ShoppingOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>
      </Card>

      {/* FiltrosPedidos como nuevo componente */}
      <FiltrosPedidos
        filters={filters}
        handleFilterChange={handleFilterChange}
        handleClearFilters={handleClearFilters}
      />

      <Table
        columns={columns}
        dataSource={filteredPedidos}
        rowKey={(record, index) => `${record.id}-${index}`} // Generar clave única para evitar duplicados
        style={{ padding: '0 16px' }}
      />
    </div>
  );
};

export default Pedidos;
