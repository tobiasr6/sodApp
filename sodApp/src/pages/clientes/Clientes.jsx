import { useState, useEffect } from 'react';
import { Table, Select, InputNumber, Button, Modal, Form, Input, Space, notification } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import clientesData from '../../data/clientes/clientes.json';

const { Option } = Select;

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [filters, setFilters] = useState({ zona: '', producto: '', diaRecorrido: '' });
    const [editingClient, setEditingClient] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        setClientes(clientesData);
        setFilteredClientes(clientesData);
    }, []);

    const openNotificationWithIcon = (type, message) => {
        notification[type]({
            message: message,
            duration: 2,
        });
    };

    const handleAddClient = () => {
        setEditingClient(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditClient = (client) => {
        setEditingClient(client);
        form.setFieldsValue(client);
        setIsModalVisible(true);
    };

    const handleDeleteClient = (id) => {
        const updatedClientes = clientes.filter(client => client.id !== id);
        setClientes(updatedClientes);
        applyFilters(filters, updatedClientes);
        openNotificationWithIcon('success', 'Cliente eliminado exitosamente');
    };

    const handleModalOk = () => {
        form.validateFields().then(values => {
            if (editingClient) {
                const updatedClientes = clientes.map(client => client.id === editingClient.id ? { ...client, ...values } : client);
                setClientes(updatedClientes);
                applyFilters(filters, updatedClientes);
                openNotificationWithIcon('success', 'Cliente editado exitosamente');
            } else {
                const newClient = {
                    ...values,
                    id: clientes.length ? clientes[clientes.length - 1].id + 1 : 1
                };
                const updatedClientes = [...clientes, newClient];
                setClientes(updatedClientes);
                applyFilters(filters, updatedClientes);
                openNotificationWithIcon('success', 'Cliente agregado exitosamente');
            }
            setIsModalVisible(false);
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const applyFilters = (filters, clientList) => {
        let filtered = clientList;

        if (filters.zona) {
            filtered = filtered.filter(client => client.zona === filters.zona);
        }
        if (filters.producto) {
            filtered = filtered.filter(client => client.pedido.producto === filters.producto);
        }
        if (filters.diaRecorrido) {
            filtered = filtered.filter(client => client.diaRecorrido === filters.diaRecorrido);
        }

        setFilteredClientes(filtered);
    };

    const handleFilterChange = (value, key) => {
        const updatedFilters = { ...filters, [key]: value };
        setFilters(updatedFilters);
        applyFilters(updatedFilters, clientes);
    };

    const handleClearFilters = () => {
        setFilters({ zona: '', producto: '', diaRecorrido: '' });
        setFilteredClientes(clientes);
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Dirección',
            dataIndex: 'direccion',
            key: 'direccion',
        },
        {
            title: 'Zona',
            dataIndex: 'zona',
            key: 'zona',
            render: (zona) => <span>{zona}</span>,
        },
        {
            title: 'Pedido Habitual',
            key: 'pedido',
            render: (_, record) => (
                <div>
                    <InputNumber value={record.pedido.cantidad} style={{ marginRight: 8 }} readOnly />
                    <Select value={record.pedido.producto} style={{ width: 120 }} disabled>
                        <Option value="agua">Agua</Option>
                        <Option value="soda">Soda</Option>
                    </Select>
                </div>
            ),
        },
        {
            title: 'Día Recorrido',
            dataIndex: 'diaRecorrido',
            key: 'diaRecorrido',
        },
        {
            title: 'Observación',
            dataIndex: 'observacion',
            key: 'observacion',
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEditClient(record)} />
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteClient(record.id)} />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Space direction="vertical" size="middle" style={{ display: 'flex', margin: 8 }}>
                <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClient}>
                        Agregar Cliente
                    </Button>
                    <Select
                        placeholder="Filtrar por zona"
                        onChange={value => handleFilterChange(value, 'zona')}
                        value={filters.zona}
                        style={{ width: 200 }}
                    >
                        <Option value="">Todos</Option>
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
                        <Option value="">Todos</Option>
                        <Option value="agua">Agua</Option>
                        <Option value="soda">Soda</Option>
                    </Select>
                    <Select
                        placeholder="Filtrar por día"
                        onChange={value => handleFilterChange(value, 'diaRecorrido')}
                        value={filters.diaRecorrido}
                        style={{ width: 200 }}
                    >
                        <Option value="">Todos</Option>
                        <Option value="Lunes">Lunes</Option>
                        <Option value="Martes">Martes</Option>
                        <Option value="Miércoles">Miércoles</Option>
                        <Option value="Jueves">Jueves</Option>
                        <Option value="Viernes">Viernes</Option>
                    </Select>
                    <Button onClick={handleClearFilters}>
                        Limpiar Filtros
                    </Button>
                </Space>
                <Table columns={columns} dataSource={filteredClientes} rowKey="id" />
            </Space>

            <Modal
                title={editingClient ? "Editar Cliente" : "Agregar Nuevo Cliente"}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Guardar"
                cancelText="Cancelar"
                width={720}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="nombre"
                        label="Nombre"
                        rules={[{ required: true, message: 'Por favor ingresa el nombre del cliente!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="direccion"
                        label="Dirección"
                        rules={[{ required: true, message: 'Por favor ingresa la dirección!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="zona"
                        label="Zona"
                        rules={[{ required: true, message: 'Por favor selecciona una zona!' }]}
                    >
                        <Select>
                            <Option value="Norte">Norte</Option>
                            <Option value="Sur">Sur</Option>
                            <Option value="Este">Este</Option>
                            <Option value="Oeste">Oeste</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="pedido"
                        label="Pedido Habitual"
                        rules={[{ required: true, message: 'Por favor ingresa el pedido habitual!' }]}
                    >
                        <Form.Item
                            name={['pedido', 'cantidad']}
                            noStyle
                            rules={[{ required: true, message: 'Por favor ingresa la cantidad!' }]}
                        >
                            <InputNumber min={1} style={{ width: '100px', marginRight: '8px' }} />
                        </Form.Item>
                        <Form.Item
                            name={['pedido', 'producto']}
                            noStyle
                            rules={[{ required: true, message: 'Por favor selecciona un producto!' }]}
                        >
                            <Select style={{ width: '120px' }}>
                                <Option value="agua">Agua</Option>
                                <Option value="soda">Soda</Option>
                            </Select>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                        name="diaRecorrido"
                        label="Día de Recorrido"
                        rules={[{ required: true, message: 'Por favor selecciona un día!' }]}
                    >
                        <Select>
                            <Option value="Lunes">Lunes</Option>
                            <Option value="Martes">Martes</Option>
                            <Option value="Miércoles">Miércoles</Option>
                            <Option value="Jueves">Jueves</Option>
                            <Option value="Viernes">Viernes</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="observacion"
                        label="Observación"
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Clientes;