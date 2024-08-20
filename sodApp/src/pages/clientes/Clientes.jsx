import { useContext, useEffect, useState } from 'react';
import { Table, Select, InputNumber, Button, Modal, Form, Input, Space, notification } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ClientesContext } from '../../components/context/ClientesContext';

const { Option } = Select;

const Clientes = () => {
    const { clientes, addCliente, updateCliente, deleteCliente } = useContext(ClientesContext);
    const [filteredClientes, setFilteredClientes] = useState(clientes);
    const [filters, setFilters] = useState({ zona: '', producto: '', diaRecorrido: '' });
    const [editingClient, setEditingClient] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        applyFilters(filters, clientes);
    }, [clientes]);

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
        deleteCliente(id);
        openNotificationWithIcon('success', 'Cliente eliminado exitosamente');
    };

    const handleModalOk = () => {
        form.validateFields().then(values => {
            if (editingClient) {
                updateCliente(editingClient.id, values);
                openNotificationWithIcon('success', 'Cliente editado exitosamente');
            } else {
                addCliente(values);
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
            filtered = filtered.filter(client => client.pedidos.some(pedido => pedido.producto === filters.producto));
        }
        if (filters.diaRecorrido) {
            filtered = filtered.filter(client => client.diasRecorrido.some(dia => dia.dia === filters.diaRecorrido));
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
        },
        {
            title: 'Pedidos Habituales',
            key: 'pedidos',
            render: (_, record) => (
                <div>
                    {record.pedidos.map((pedido, index) => (
                        <div key={index}>
                            {pedido.cantidad} {pedido.producto}
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Días de Recorrido',
            key: 'diasRecorrido',
            render: (_, record) => (
                <div>
                    {record.diasRecorrido.map((dia, index) => (
                        <div key={index}>
                            {dia.dia}
                        </div>
                    ))}
                </div>
            ),
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
    <Form.List name="pedidos">
        {(fields, { add, remove }) => (
            <div>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <Form.Item
                            {...restField}
                            name={[name, 'cantidad']}
                            fieldKey={[fieldKey, 'cantidad']}
                            rules={[{ required: true, message: 'Ingresa la cantidad!' }]}
                        >
                            <InputNumber min={1} placeholder="Cantidad" />
                        </Form.Item>
                        <Form.Item
                            {...restField}
                            name={[name, 'producto']}
                            fieldKey={[fieldKey, 'producto']}
                            rules={[{ required: true, message: 'Selecciona un producto!' }]}
                        >
                            <Select placeholder="Producto" style={{ width: 120 }}>
                                <Option value="agua">Agua</Option>
                                <Option value="soda">Soda</Option>
                            </Select>
                        </Form.Item>
                        <Button onClick={() => remove(name)}>Eliminar</Button>
                    </Space>
                ))}
                <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Agregar Pedido
                    </Button>
                </Form.Item>
            </div>
        )}
    </Form.List>
    <Form.List name="diasRecorrido">
        {(fields, { add, remove }) => (
            <div>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <Form.Item
                            {...restField}
                            name={[name, 'dia']}
                            fieldKey={[fieldKey, 'dia']}
                            rules={[{ required: true, message: 'Selecciona un día!' }]}
                        >
                            <Select placeholder="Día de Recorrido" style={{ width: 120 }}>
                                <Option value="Lunes">Lunes</Option>
                                <Option value="Martes">Martes</Option>
                                <Option value="Miércoles">Miércoles</Option>
                                <Option value="Jueves">Jueves</Option>
                                <Option value="Viernes">Viernes</Option>
                            </Select>
                        </Form.Item>
                        <Button onClick={() => remove(name)}>Eliminar</Button>
                    </Space>
                ))}
                <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Agregar Día
                    </Button>
                </Form.Item>
            </div>
        )}
    </Form.List>
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
