import { useState }  from 'react';
import { Modal, Button, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const ConsultarCliente = ({ cliente }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
    <Button
        type="primary"
        // ghost // Aplicar el estilo ghost para fondo transparente
        icon={<QuestionCircleOutlined style={{ color: 'black', backgroundColor: 'transparent' }} />} // Ícono blanco
        onClick={showModal}
        style={{
            backgroundColor:'transparent',
            borderColor: 'gray', // Borde blanco
        }}
      />
      <Modal
        title="Cliente consultado"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        {/* Contenido del modal para editar el cliente */}
      </Modal>
    </>
  );
};

export default ConsultarCliente;