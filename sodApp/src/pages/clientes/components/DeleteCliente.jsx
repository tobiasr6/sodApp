import { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { eliminarCliente as eliminarClienteService } from '../services/delete'; // Importa la función de servicio
import PropTypes from 'prop-types';
import { DeleteOutlined } from '@ant-design/icons';

const EliminarCliente = ({ idCliente, onClienteEliminado }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mostrar el modal de confirmación
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Ocultar el modal
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Función para manejar la eliminación del cliente
  const eliminarCliente = async () => {
    setLoading(true);
    try {
      // Llamar a la función de servicio para eliminar el cliente
      await eliminarClienteService(idCliente);

      // Mostrar mensaje de éxito
      message.success('Cliente eliminado con éxito');

      // Notificar que el cliente fue eliminado
      onClienteEliminado(idCliente);
    } catch (error) {
      // Manejo de errores
      console.error(error); // Imprimir error en consola para depuración
      message.error('Error al eliminar el cliente');
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {/* Botón para eliminar */}
      <Button
        type="primary"
        // ghost // Aplicar el estilo ghost para fondo transparente
        icon={<DeleteOutlined style={{ color: 'black', backgroundColor: 'transparent' }} />} // Ícono blanco
        onClick={showModal}
        style={{
            backgroundColor:'transparent',
            borderColor: 'gray', // Borde blanco
        }}
      />

      {/* Modal de confirmación */}
      <Modal
        title="Confirmar eliminación"
        open={isModalOpen}
        onOk={eliminarCliente}
        confirmLoading={loading}
        onCancel={handleCancel}
        okText="Eliminar"
        cancelText="Cancelar"
      >
        <p>¿Estás seguro que deseas eliminar este cliente?</p>
      </Modal>
    </>
  );
};

// Validación de props con PropTypes
EliminarCliente.propTypes = {
    idCliente: PropTypes.number.isRequired,  // idCliente debe ser un número y es requerido
    onClienteEliminado: PropTypes.func.isRequired, // onClienteEliminado debe ser una función y es requerido
  };

export default EliminarCliente;
