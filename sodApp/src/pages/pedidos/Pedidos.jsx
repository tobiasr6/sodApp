import { useState } from 'react';
import { Table, Select, Space, Typography, Button, Card, Row, Col, Statistic } from 'antd';
import { ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';
import clientes from '../../data/clientes/clientes.json';

const { Option } = Select;
const { Title } = Typography;

const Pedidos = () => {
    const [filters, setFilters] = useState({
        zona: '',
        producto: ''
    });

    // Genera los pedidos en base a los clientes importados
    const pedidos = clientes.map((cliente) => ({
        id: cliente.id,
        cantidad: cliente.pedido.cantidad,
        producto: cliente.pedido.producto,
        zona: cliente.zona,
        cliente: cliente.nombre,
    }));

    const applyFilters = () => {
        return pedidos.filter(pedido => {
            const matchesZona = filters.zona ? pedido.zona === filters.zona : true;
            const matchesProducto = filters.producto ? pedido.producto.toLowerCase() === filters.producto.toLowerCase() : true;
            return matchesZona && matchesProducto;
        });
    };

    const handleFilterChange = (value, key) => {
        setFilters({
            ...filters,
            [key]: value
        });
    };

    const handleClearFilters = () => {
        setFilters({
            zona: '',
            producto: ''
        });
    };

    const filteredPedidos = applyFilters();

    // Calcular el total de pedidos y productos
    const totalPedidos = filteredPedidos.length;
    const totalProductos = filteredPedidos.reduce((acc, pedido) => acc + pedido.cantidad, 0);

    const columns = [
        {
            title: 'Cantidad',
            dataIndex: 'cantidad',
            key: 'cantidad',
        },
        {
            title: 'Producto',
            dataIndex: 'producto',
            key: 'producto',
        },
        {
            title: 'Zona',
            dataIndex: 'zona',
            key: 'zona',
        },
        {
            title: 'Nombre del Cliente',
            dataIndex: 'cliente',
            key: 'cliente',
        },
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
                <Row gutter={16} align="middle">
                    <Col span={24}>
                        <Title level={3} style={{ marginBottom: 24, color: '#1890ff' }}>
                            Resumen de pedidos:
                        </Title>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Statistic
                            title="Total de pedidos"
                            value={totalPedidos}
                            prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Col>
                    <Col xs={24} sm={12}>
                        <Statistic
                            title="Total de productos"
                            value={totalProductos}
                            prefix={<ShoppingOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Col>
                </Row>
            </Card>
            <Space direction="vertical" size="middle" style={{ display: 'flex', marginBottom: 16, padding: '0 16px' }}>
                <Space>
                    <Select
                        placeholder="Filtrar por zona"
                        onChange={value => handleFilterChange(value, 'zona')}
                        value={filters.zona}
                        style={{ width: 200 }}
                    >
                        <Option value="">Todas las zonas</Option>
                        <Option value="Norte">Norte</Option>
                        <Option value="Sur">Sur</Option>
                        <Option value="Este">Este</Option>
                        <Option value="Oeste">Oeste</Option>
                    </Select>
                    <Select
                        placeholder="Filtrar por producto"
                        onChange={value => handleFilterChange(value, 'producto')}
                        value={filters.producto}
                        style={{ width: 200 }}
                    >
                        <Option value="">Todos los productos</Option>
                        <Option value="agua">Agua</Option>
                        <Option value="soda">Soda</Option>
                    </Select>
                    <Button onClick={handleClearFilters} type="default">
                        Limpiar filtros
                    </Button>
                </Space>
            </Space>
            <Table 
                columns={columns} 
                dataSource={filteredPedidos} 
                rowKey="id" 
                style={{ padding: '0 16px' }}
            />
        </div>
    );
};

export default Pedidos;