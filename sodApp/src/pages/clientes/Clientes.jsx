import { useContext, useEffect, useState } from 'react';
import { Table, Select, InputNumber, Button, Modal, Form, Input, Space, notification } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ClientesContext } from '../../components/context/ClientesContext';
import zonasData from '../../data/zonas/zonas.json';
// import useFetchClientes from './components/fetchClientes';

const { Option } = Select;

const Clientes = () => {
    // const [cliente, fetchClientes] =  useFetchClientes();

    // Obtiene el contexto de clientes y las funciones para manejar clientes
    const { clientes, addCliente, updateCliente, deleteCliente } = useContext(ClientesContext);

    // Estado para almacenar los clientes filtrados
    const [filteredClientes, setFilteredClientes] = useState(clientes);

     // Estado para los filtros aplicados
    const [filters, setFilters] = useState({ zona: '', producto: '', diaRecorrido: '' });

     // Estado para el cliente que se está editando
    const [editingClient, setEditingClient] = useState(null);

    // Estado para mostrar u ocultar el modal
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Estado para las zonas
    const [zonas, setZonas] = useState({});

    // Estado para la zona seleccionada
    const [selectedZona, setSelectedZona] = useState(null);

    // Hook para manejar el formulario de Ant Design
    const [form] = Form.useForm();

    // Efecto que se ejecuta al montar el componente, establece las zonas
    useEffect(() => {
        setZonas(zonasData);
    }, []);

    const handleBarrioChange = (value) => {
        const zona = Object.keys(zonas).find(zona => zonas[zona].includes(value));
        setSelectedZona(zona);
        form.setFieldsValue({ zona: zona });
    };

    useEffect(() => {
        applyFilters(filters, clientes);
    }, [clientes]);

    // Función para mostrar notificaciones
    const openNotificationWithIcon = (type, message) => {
        notification[type]({
            message: message,
            duration: 2,
        });
    };

    // Función para abrir el modal para agregar un nuevo cliente
    const handleAddClient = () => {
        setEditingClient(null);// No hay cliente para editar
        form.resetFields(); // Resetea los campos del formulario
        setIsModalVisible(true); // Muestra el modal
    };

    // Función para abrir el modal para editar un cliente existente
    const handleEditClient = (client) => {
        setEditingClient(client); // No hay cliente para editar
        form.setFieldsValue(client); // Resetea los campos del formulario
        setIsModalVisible(true); // Muestra el modal
    };

    const handleDeleteClient = (id) => {
        deleteCliente(id); // Elimina el cliente por ID
        openNotificationWithIcon('success', 'Cliente eliminado exitosamente'); // Muestra notificación de éxito
    };

    // Función para manejar la confirmación del modal
    const handleModalOk = () => {
        form.validateFields().then(values => { // Valida los campos del formulario
            if (editingClient) {
                // Si hay un cliente en edición, actualiza sus datos
                updateCliente(editingClient.id, values);
                openNotificationWithIcon('success', 'Cliente editado exitosamente');// Notificación de éxito
            } else {
                // Si es un nuevo cliente, lo agrega
                addCliente(values);
                openNotificationWithIcon('success', 'Cliente agregado exitosamente'); // Notificación de éxito
            }
            setIsModalVisible(false); // Cierra el modal
        });
    };

    // Función para manejar el cierre del modal
    const handleModalCancel = () => {
        setIsModalVisible(false);  // Cierra el modal

    };

    // Función para aplicar los filtros a la lista de clientes
    const applyFilters = (filters, clientList) => {
        let filtered = clientList;

        // Filtra por zona si está especificada
        if (filters.zona) {
            filtered = filtered.filter(client => client.zona === filters.zona);
        }
        // Filtra por producto si está especificado
        if (filters.producto) {
            filtered = filtered.filter(client => client.pedidos.some(pedido => pedido.producto === filters.producto));
        }
        // Filtra por día de recorrido si está especificado
        if (filters.diaRecorrido) {
            filtered = filtered.filter(client => client.diasRecorrido.some(dia => dia.dia === filters.diaRecorrido));
        }

        setFilteredClientes(filtered); // Actualiza la lista de clientes filtrados
    };

    // Maneja el cambio en los filtros
    const handleFilterChange = (value, key) => {
        const updatedFilters = { ...filters, [key]: value }; // Actualiza el filtro correspondiente
        setFilters(updatedFilters); // Establece los nuevos filtros
        applyFilters(updatedFilters, clientes);  // Aplica los filtros a la lista de clientes
    };

    // Función para limpiar todos los filtros
    const handleClearFilters = () => {
        setFilters({ zona: '', producto: '', diaRecorrido: '' }); // Resetea los filtros
        setFilteredClientes(clientes);  // Vuelve a mostrar la lista completa de clientes
    };

    // Definición de las columnas de la tabla
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
                            {pedido.cantidad} {pedido.producto} {/* Muestra la cantidad y el producto de los pedidos */}
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
                            {dia.dia} {/* Muestra los días de recorrido del cliente */}
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Telefono',
            dataIndex: 'telefono',
            key: 'telefono',
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
                    <Button icon={<EditOutlined />} onClick={() => handleEditClient(record)} />  {/* Botón de editar */}
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteClient(record.id)} />   {/* Botón de eliminar */}

                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Componente de filtros para clientes */}
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
                        <Option value="Agua">Agua</Option>
                        <Option value="Soda">Soda</Option>
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

            {/* Modal para agregar/editar clientes */}
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
                    name="barrio"
                    label="Barrio"
                    rules={[{ required: true, message: 'Por favor selecciona un barrio!' }]}
                >
                    <Select
                        showSearch  // Habilita la búsqueda
                        placeholder="Selecciona un barrio"
                        onChange={handleBarrioChange}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {Object.keys(zonas).flatMap(zona =>
                            zonas[zona].map(barrio => (
                                <Option key={barrio} value={barrio}>
                                    {barrio}
                                </Option>
                            ))
                        )}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="zona"
                    label="Zona"
                >
                    <Input value={selectedZona} disabled />
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
                                                <Option value="Agua">Agua</Option>
                                                <Option value="Soda">Soda</Option>
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
                    <Form.Item
                        name="telefono"
                        label="Telefono"
                        rules={[{ required: true, message: 'Por favor ingresa el telefono del cliente!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Clientes;