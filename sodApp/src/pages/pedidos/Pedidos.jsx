import { useState, useContext  } from 'react';
import { Table, Select, Space, Typography, Button, Card, Row, Col, Statistic } from 'antd';
import { ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';
import { ClientesContext } from '../../components/context/ClientesContext'
// import clientes from '../../data/clientes/clientes.json';

const { Option } = Select;
const { Title } = Typography;

const Pedidos = () => {
    const { clientes } = useContext(ClientesContext);
    const [filters, setFilters] = useState({
        zona: '',
        producto: '',
        dia: ''
    });

    // Genera los pedidos en base a los clientes importados
    const pedidos = clientes.flatMap((cliente) => 
        cliente.pedidos.map((pedido) => ({
            id: cliente.id,
            cantidad: pedido.cantidad,
            producto: pedido.producto,
            zona: cliente.zona,
            cliente: cliente.nombre,
            diasRecorrido: cliente.diasRecorrido.map((dia) => dia.dia)
        }))
    );

    const applyFilters = () => {
        return pedidos.filter(pedido => {
            const matchesZona = filters.zona ? pedido.zona === filters.zona : true;
            const matchesProducto = filters.producto ? pedido.producto.toLowerCase() === filters.producto.toLowerCase() : true;
            const matchesDia = filters.dia ? pedido.diasRecorrido.includes(filters.dia) : true;
            return matchesZona && matchesProducto && matchesDia;
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
            producto: '',
            dia: ''
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
        {
            title: 'Días de Recorrido',
            dataIndex: 'diasRecorrido',
            key: 'diasRecorrido',
            render: diasRecorrido => diasRecorrido.join(', '),
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
                        <Option value="Agua">Agua</Option>
                        <Option value="Soda">Soda</Option>
                    </Select>
                    <Select
                        placeholder="Filtrar por día"
                        onChange={value => handleFilterChange(value, 'dia')}
                        value={filters.dia}
                        style={{ width: 200 }}
                    >
                        <Option value="">Todos los días</Option>
                        <Option value="Lunes">Lunes</Option>
                        <Option value="Martes">Martes</Option>
                        <Option value="Miércoles">Miércoles</Option>
                        <Option value="Jueves">Jueves</Option>
                        <Option value="Viernes">Viernes</Option>
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
