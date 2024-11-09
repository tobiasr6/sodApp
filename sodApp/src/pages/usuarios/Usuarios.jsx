import { Table, Spin, Alert } from 'antd';
import useFetchUsuarios from '../../routes/fetchs/fetchUsuarios'; // Asegúrate de que la ruta sea correcta

const Usuarios = () => {
  // Usa el hook personalizado para obtener los usuarios, el estado de carga y los posibles errores
  const { usuarios, loading, error } = useFetchUsuarios();

  // Define las columnas de la tabla
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
    },
    {
      title: 'Fecha de Nacimiento',
      dataIndex: 'fechaNacimiento',
      key: 'fechaNacimiento',
      render: (fecha) => new Date(fecha).toLocaleDateString(), // Formatea la fecha
    }
  ];

  // Si está cargando, muestra un spinner
  if (loading) {
    return <Spin tip="Cargando usuarios..." />;
  }

  // Si hay un error, muestra una alerta
  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <Table dataSource={usuarios} columns={columns} rowKey="idUsuario" />
    </div>
  );
};

export default Usuarios;
