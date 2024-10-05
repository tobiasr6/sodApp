// IngresarNombreModal.js
import React, { useState } from 'react';
import { Modal, Input, Button, Space } from 'antd';

const IngresarNombreModal = ({ visible, onClose }) => {
  // Estados para cada campo de entrada
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [idBarrio, setIdBarrio] = useState(''); // Asegúrate de manejarlo como número
  const [telefono, setTelefono] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [pedidos, setPedidos] = useState([{ cantidad: '', producto: '' }]);
  const [diasRecorrido, setDiasRecorrido] = useState([{ dia: '' }]);

  const handleOk = () => {
    const clienteData = {
      nombre,
      direccion,
      idBarrio: Number(idBarrio), // Convertir a número
      telefono,
      observaciones,
      pedidos: pedidos.map(pedido => ({
        cantidad: Number(pedido.cantidad), // Convertir a número
        producto: Number(pedido.producto), // Convertir a número
      })),
      diasRecorrido: diasRecorrido.map(diaRecorrido => ({
        dia: Number(diaRecorrido.dia), // Convertir a número
      })),
    };

    // Mostrar el objeto en la consola
    console.log(JSON.stringify(clienteData, null, 2));

    // Cerrar el modal
    onClose();
    resetFields(); // Reiniciar campos después de cerrar
  };

  const resetFields = () => {
    setNombre('');
    setDireccion('');
    setIdBarrio(''); // Reiniciar idBarrio
    setTelefono('');
    setObservaciones('');
    setPedidos([{ cantidad: '', producto: '' }]); // Reiniciar pedidos
    setDiasRecorrido([{ dia: '' }]); // Reiniciar días de recorrido
  };

  const addPedido = () => {
    setPedidos([...pedidos, { cantidad: '', producto: '' }]);
  };

  const removePedido = (index) => {
    const newPedidos = [...pedidos];
    newPedidos.splice(index, 1);
    setPedidos(newPedidos);
  };

  const addDiaRecorrido = () => {
    setDiasRecorrido([...diasRecorrido, { dia: '' }]);
  };

  const removeDiaRecorrido = (index) => {
    const newDiasRecorrido = [...diasRecorrido];
    newDiasRecorrido.splice(index, 1);
    setDiasRecorrido(newDiasRecorrido);
  };

  return (
    <Modal
      title='Ingresar Cliente'
      visible={visible}
      onOk={handleOk}
      onCancel={onClose}
    >
      <Input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder='Nombre'
      />
      <Input
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        placeholder='Dirección'
        style={{ marginTop: 10 }}
      />
      <Input
        value={idBarrio}
        onChange={(e) => setIdBarrio(e.target.value)}
        placeholder='ID Barrio'
        style={{ marginTop: 10 }}
        type="number" // Asegurarte de que sea un número
      />
      <Input
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder='Teléfono'
        style={{ marginTop: 10 }}
      />
      <Input
        value={observaciones}
        onChange={(e) => setObservaciones(e.target.value)}
        placeholder='Observaciones'
        style={{ marginTop: 10 }}
      />

      <div style={{ marginTop: 20 }}>
        <h4>Pedidos</h4>
        {pedidos.map((pedido, index) => (
          <Space key={index} style={{ marginBottom: 10 }} align="baseline">
            <Input
              style={{ width: '45%' }}
              value={pedido.cantidad}
              onChange={(e) => {
                const newPedidos = [...pedidos];
                newPedidos[index].cantidad = e.target.value;
                setPedidos(newPedidos);
              }}
              placeholder='Cantidad'
              type="number" // Asegurarte de que sea un número
            />
            <Input
              style={{ width: '45%' }}
              value={pedido.producto}
              onChange={(e) => {
                const newPedidos = [...pedidos];
                newPedidos[index].producto = e.target.value;
                setPedidos(newPedidos);
              }}
              placeholder='Producto'
              type="number" // Asegurarte de que sea un número
            />
            <Button type="link" onClick={() => removePedido(index)}>
              Eliminar
            </Button>
          </Space>
        ))}
        <Button onClick={addPedido} type="dashed" style={{ width: '100%' }}>
          Agregar Pedido
        </Button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4>Días de Recorrido</h4>
        {diasRecorrido.map((diaRecorrido, index) => (
          <Space key={index} style={{ marginBottom: 10 }} align="baseline">
            <Input
              style={{ width: '90%' }}
              value={diaRecorrido.dia}
              onChange={(e) => {
                const newDiasRecorrido = [...diasRecorrido];
                newDiasRecorrido[index].dia = e.target.value;
                setDiasRecorrido(newDiasRecorrido);
              }}
              placeholder='Día de recorrido'
              type="number" // Asegurarte de que sea un número
            />
            <Button type="link" onClick={() => removeDiaRecorrido(index)}>
              Eliminar
            </Button>
          </Space>
        ))}
        <Button onClick={addDiaRecorrido} type="dashed" style={{ width: '100%' }}>
          Agregar Día
        </Button>
      </div>
    </Modal>
  );
};

export default IngresarNombreModal;
