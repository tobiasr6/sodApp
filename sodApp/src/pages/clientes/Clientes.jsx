import { useState } from 'react';
import { Table } from 'antd';
import useFetchClientes from './components/fetchs/fetchClientes'; // Ruta del hook
import FiltrosClientes from './components/FiltrosClientes'; // Importa el componente de filtros

const ClientesTable = () => {
  const [clientes] = useFetchClientes();
  
  // Estado para los filtros
  const [filters, setFilters] = useState({
    zona: '',
    producto: '',
    diaRecorrido: '',
  });  

  // Manejar cambios en los filtros
  const handleFilterChange = (value, type) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
    // Aquí podrías realizar cualquier otra lógica necesaria
  };
  

  // Limpiar los filtros
  const handleClearFilters = () => {
    setFilters({
      zona: '',
      producto: '',
      diaRecorrido: '',
    });
  };

  // Función para agregar cliente
  const handleAddClient = () => {
    console.log('Agregar nuevo cliente');
  };

  // Filtrar los clientes en base a los filtros
  const filteredClientes = clientes.filter(cliente => {
    const matchesZona = filters.zona ? cliente.nombreZona === filters.zona : true;
    const matchesProducto = filters.producto ? cliente.pedidos.some(p => p.producto === filters.producto) : true;
    const matchesDia = filters.diaRecorrido ? cliente.diasRecorrido.some(dia => dia.dia === filters.diaRecorrido) : true;
  
    return matchesZona && matchesProducto && matchesDia;
  });

  // Definir las columnas de la tabla
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
      dataIndex: 'nombreZona',
      key: 'nombreZona',
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
      )
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
      )
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
    },
    {
      title: 'Observaciones',
      dataIndex: 'observaciones',
      key: 'observaciones',
    },
    {
      title: 'Acciones',
      key: 'acciones',
    },
  ];

  return (
    <div>
      <h2>Lista de Clientes</h2>
      {/* Componente de Filtros */}
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
      />
    </div>
  );
};

export default ClientesTable;
