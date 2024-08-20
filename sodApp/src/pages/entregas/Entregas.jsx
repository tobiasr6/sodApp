import { useState, useMemo, useContext } from 'react';
import { Table, Select, Space, Typography, Button, Card, Row, Col, Statistic, Modal, Form, InputNumber } from 'antd';
import { CaretDownOutlined, DropboxOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/es';
// import clientes from '../../data/clientes/clientes.json';
import { ClientesContext } from '../../components/context/ClientesContext'


const { Option } = Select;
const { Title } = Typography;

moment.locale('es');

const translateDay = (day) => {
    const daysInSpanish = {
        'Monday': 'Lunes',
        'Tuesday': 'Martes',
        'Wednesday': 'Miércoles',
        'Thursday': 'Jueves',
        'Friday': 'Viernes',
        'Saturday': 'Sábado',
        'Sunday': 'Domingo'
    };
    return daysInSpanish[day] || day;
};

const Entregas = () => {
    const { clientes } = useContext(ClientesContext);
    const [filters, setFilters] = useState({
        zona: '',
        estado: '',
        dia: translateDay(moment().format('dddd')),
    });

    const [entregas, setEntregas] = useState(clientes.flatMap(cliente => 
        cliente.pedidos.map(pedido => 
            cliente.diasRecorrido.map(diaRecorrido => ({
                id: `${cliente.id}-${pedido.producto}-${diaRecorrido.dia}`, // Genera un ID único combinando los datos
                cantidad: pedido.cantidad,
                producto: pedido.producto,
                zona: cliente.zona,
                cliente: cliente.nombre,
                direccion: cliente.direccion,
                observacion: cliente.observacion,
                estado: 'pendiente',
                diaRecorrido: diaRecorrido.dia,
            }))
        ).flat()
    ));

    const applyFilters = () => {
        return entregas.filter(entrega => {
            const matchesZona = filters.zona ? entrega.zona === filters.zona : true;
            const matchesEstado = filters.estado ? entrega.estado === filters.estado : true;
            const matchesDia = filters.dia ? entrega.diaRecorrido === filters.dia : true;
            return matchesZona && matchesEstado && matchesDia;
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
            estado: '',
            dia: translateDay(moment().format('dddd'))
        });
    };

    const filteredEntregas = useMemo(() => applyFilters(), [filters, entregas]);

    const calcularTotales = (entregas) => {
        let totalAgua = 0;
        let totalSoda = 0;

        entregas.forEach(entrega => {
            if (entrega.producto.toLowerCase() === 'agua') {
                totalAgua += entrega.cantidad;
            } else if (entrega.producto.toLowerCase() === 'soda') {
                totalSoda += entrega.cantidad;
            }
        });

        return { totalAgua, totalSoda };
    };

    const { totalAgua, totalSoda } = useMemo(() => calcularTotales(filteredEntregas), [filteredEntregas]);

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'entregada':
                return '#4CAF50';
            case 'no recibida':
                return '#F44336';
            case 'pendiente':
                return '#FF9800';
            default:
                return '#9E9E9E';
        }
    };

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
            title: 'Dirección',
            dataIndex: 'direccion',
            key: 'direccion',
        },
        {
            title: 'Observaciones',
            dataIndex: 'observacion',
            key: 'observacion',
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            render: (_, record) => (
                <Select
                    value={record.estado}
                    onChange={value => handleEstadoChange(record.id, value)}
                    style={{ width: 150, backgroundColor: 'white' }}
                    dropdownStyle={{ backgroundColor: 'white' }}
                    suffixIcon={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div 
                                style={{ 
                                    width: 10, 
                                    height: 10, 
                                    borderRadius: '50%', 
                                    backgroundColor: getEstadoColor(record.estado),
                                    marginRight: 5
                                }} 
                            />
                            <CaretDownOutlined />
                        </div>
                    }
                >
                    <Option value="entregada" style={{ color: 'green' }}>
                        <span style={{ color: 'green' }}>Entregada</span>
                    </Option>
                    <Option value="no recibida" style={{ color: 'red' }}>
                        <span style={{ color: 'red' }}>No Recibida</span>
                    </Option>
                    <Option value="pendiente" style={{ color: 'orange' }}>
                        <span style={{ color: 'orange' }}>Pendiente</span>
                    </Option>
                </Select>
            )
        }
    ];

    const handleEstadoChange = (id, value) => {
        setEntregas(entregas.map(entrega =>
            entrega.id === id ? { ...entrega, estado: value } : entrega
        ));
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const cliente = clientes.find(c => c.id === values.clienteId);
            const nuevaEntrega = {
                id: Date.now(),
                cantidad: values.cantidad,
                producto: values.producto,
                zona: cliente.zona,
                cliente: cliente.nombre,
                direccion: cliente.direccion,
                observacion: "Entrega extraordinaria",
                estado: 'pendiente',
                diaRecorrido: translateDay(moment().format('dddd'))
            };
            setEntregas([...entregas, nuevaEntrega]);
            setIsModalVisible(false);
            form.resetFields();
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <div>
            <Card style={{ margin: 16, borderRadius: 8, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Title level={3} style={{ marginBottom: 24, color: '#1890ff' }}>
                            Resumen de productos a cargar:
                        </Title>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Statistic
                            title="Agua"
                            value={totalAgua}
                            prefix={<DropboxOutlined style={{ color: '#1890ff' }} />}
                            suffix="unidades"
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Col>
                    <Col xs={24} sm={12}>
                        <Statistic
                            title="Soda"
                            value={totalSoda}
                            prefix={<DropboxOutlined style={{ color: '#52c41a' }} />}
                            suffix="unidades"
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Col>
                </Row>
            </Card>
            <Space direction="vertical" size="middle" style={{ display: 'flex', marginBottom: 16 }}>
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
                        placeholder="Filtrar por estado"
                        onChange={value => handleFilterChange(value, 'estado')}
                        value={filters.estado}
                        style={{ width: 200 }}
                    >
                        <Option value="">Todos los estados</Option>
                        <Option value="entregada">Entregada</Option>
                        <Option value="no recibida">No Recibida</Option>
                        <Option value="pendiente">Pendiente</Option>
                    </Select>
                    <Select
                        placeholder="Filtrar por día"
                        onChange={value => handleFilterChange(value, 'dia')}
                        value={filters.dia}
                        style={{ width: 200 }}
                    >
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
            <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={showModal}
                style={{ marginBottom: 16, marginLeft: 16 }}
            >
                Agregar entrega
            </Button>
            <Table columns={columns} dataSource={filteredEntregas} rowKey="id" />

            <Modal
                title="Agregar entrega "
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="clienteId"
                        label="Cliente"
                        rules={[{ required: true, message: 'Por favor seleccione un cliente' }]}
                    >
                        <Select>
                            {clientes.map(cliente => (
                                <Option key={cliente.id} value={cliente.id}>{cliente.nombre}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="producto"
                        label="Producto"
                        rules={[{ required: true, message: 'Por favor seleccione un producto' }]}
                    >
                        <Select>
                            <Option value="Agua">Agua</Option>
                            <Option value="Soda">Soda</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="cantidad"
                        label="Cantidad"
                        rules={[{ required: true, message: 'Por favor ingrese una cantidad' }]}
                    >
                        <InputNumber min={1} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Entregas;
