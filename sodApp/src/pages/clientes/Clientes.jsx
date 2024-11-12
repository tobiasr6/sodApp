import { useState } from 'react';
import { Table } from 'antd';
import useFetchClientes from '../../routes/fetchs/fetchClientes'; // Ruta del hook
import FiltrosClientes from './components/FiltrosClientes'; // Importa el componente de filtros
// import DeleteCliente from './components/DeleteCliente'; // Importa correctamente el componente DeleteCliente
import EditarCliente from './components/EditCliente'; // Asegúrate de que el nombre del componente sea correcto
import ConsultarCliente from './components/ConsultingCliente'; // Asegúrate de que el nombre del componente sea correcto
import './clientes.css'
import BusquedaClientes from './components/BusquedaClientes';

const ClientesTable = () => {
  const [clientes, setClientes] = useFetchClientes(); // Asegúrate de actualizar el estado con setClientes
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filters, setFilters] = useState({
    zona: '',
    producto: '',
    diaRecorrido: '',
    estado: 'Activo',
  });

  // Función que maneja cuando se elimina un cliente
  // const onClienteEliminado = (id) => {
  //   setClientes((prevClientes) => prevClientes.filter((cliente) => cliente.id !== id));
  // };

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  // Manejar cambios en los filtros
  const handleFilterChange = (value, type) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
  };

  // Limpiar los filtros
  const handleClearFilters = () => {
    setFilters({
      zona: '',
      producto: '',
      diaRecorrido: '',
      estado: 'Activo',
    });
  };

  // Función para agregar cliente (puedes enlazar a un modal aquí)
  const handleAddClient = () => {
    // console.log('Agregar nuevo cliente');
    // Implementa la lógica para abrir un modal o formulario para agregar un nuevo cliente
  };

  // Filtrar los clientes en base a los filtros
  const filteredClientes = clientes.filter(cliente => {
    const matchesNombre = cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZona = filters.zona ? cliente.nombreZona === filters.zona : true;
    const matchesProducto = filters.producto ? cliente.pedidos.some(p => p.producto === filters.producto) : true;
    const matchesDia = filters.diaRecorrido ? cliente.diasRecorrido.some(dia => dia.dia === filters.diaRecorrido) : true;
    const matchesEstado = filters.estado ? cliente.estado === filters.estado : true;

    return matchesNombre && matchesZona && matchesProducto && matchesDia && matchesEstado;
  });

  // Definir las columnas de la tabla
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      width: 200,
    },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      key: 'direccion',
      width: 200,
    },
    {
      title: 'Zona',
      dataIndex: 'nombreZona',
      key: 'nombreZona',
      width: 200,
    },
    {
      title: 'Pedidos Habituales',
      key: 'pedidos',
      render: (_, record) => (
        <div>
          {record.pedidos && record.pedidos.length > 0 ? (
            record.pedidos.map((pedido, index) => (
              <div key={index}>
                {pedido.cantidad} {pedido.producto}
              </div>
            ))
          ) : (
            <span>No hay pedidos habituales</span>
          )}
        </div>
      ),
      width: 250,
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
      width: 250,
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
      width: 200,
    },
    {
      title: 'Observaciones',
      dataIndex: 'observaciones',
      key: 'observaciones',
      width: 280,
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 200,
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          <EditarCliente cliente={record} /> {/* Cambia a record si EditarCliente necesita más información */}
          <ConsultarCliente cliente={record} />
          {/* <DeleteCliente idCliente={record.id} onClienteEliminado={onClienteEliminado} /> */}
        </div>
      ),
      width: 160,
    },
  ];

  return (
    <div>
      <div className="clientes-header">
        <h2>Lista de clientes</h2>
        <BusquedaClientes onSearch={handleSearch} className="busqueda-input" />
      </div>

      <FiltrosClientes
        filters={filters}
        handleFilterChange={handleFilterChange}
        handleClearFilters={handleClearFilters}
        handleAddClient={handleAddClient}
      />
      {/* Tabla de Clientes */}
      <Table
        columns={columns}
        dataSource={filteredClientes}
        rowKey="idCliente"
        pagination={{ pageSize: 5 }}
        onRow={(record) => ({
        className: record.estado === 'Inactivo' ? 'inactive-row' : '', // Aplica clase condicional
        })}
      />
    </div>
  );
};

export default ClientesTable;