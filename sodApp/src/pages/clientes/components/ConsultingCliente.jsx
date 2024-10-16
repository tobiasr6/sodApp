import { Modal, Input, Button, Row, Col, Divider } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';

const MostrarCliente = ({ cliente }) => {
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
        icon={<EyeOutlined style={{ color: 'black', backgroundColor: 'transparent' }} />}
        onClick={showModal}
        style={{
          backgroundColor: 'transparent',
          borderColor: 'gray'
        }}
      />
      <Modal
        title={`Detalles del Cliente: ${cliente?.nombre}`}
        open={isModalOpen}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cerrar
          </Button>
        ]}
      >
        {/* Nombre y Dirección */}
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <label style={{ fontWeight: 'bold' }}>Nombre</label>
            <Input value={cliente?.nombre || ''} readOnly />
          </Col>
          <Col span={12}>
            <label style={{ fontWeight: 'bold' }}>Dirección</label>
            <Input value={cliente?.direccion || ''} readOnly />
          </Col>
        </Row>

        {/* Teléfono y Barrio */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={12}>
            <label style={{ fontWeight: 'bold' }}>Teléfono</label>
            <Input value={cliente?.telefono || ''} readOnly />
          </Col>
          <Col span={12}>
            <label style={{ fontWeight: 'bold' }}>Barrio</label>
            <Input value={cliente?.nombreBarrio || ''} readOnly />
          </Col>
        </Row>

        {/* Observaciones */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <label style={{ fontWeight: 'bold' }}>Observaciones</label>
            <Input value={cliente?.observaciones || ''} readOnly />
          </Col>
        </Row>

        <Divider>Pedidos</Divider>

        {/* Pedidos */}
        {cliente.pedidos?.map((pedido, index) => (
          <Row gutter={[16, 16]} key={index} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <label style={{ fontWeight: 'bold' }}>Cantidad</label>
              <Input value={pedido.cantidad || ''} readOnly />
            </Col>
            <Col span={12}>
              <label style={{ fontWeight: 'bold' }}>Producto</label>
              <Input value={pedido.producto || ''} readOnly />
            </Col>
          </Row>
        ))}

        <Divider>Días de Recorrido</Divider>

        {/* Días de Recorrido */}
        {cliente.diasRecorrido?.map((diaRecorrido, index) => (
          <Row gutter={[16, 16]} key={index} style={{ marginBottom: 16 }}>
            <Col span={24}>
              <label style={{ fontWeight: 'bold' }}>Día</label>
              <Input value={diaRecorrido.dia || ''} readOnly />
            </Col>
          </Row>
        ))}
      </Modal>
    </>
  );
};

export default MostrarCliente;
