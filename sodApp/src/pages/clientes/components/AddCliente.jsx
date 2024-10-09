import { useState, useEffect } from 'react';
import { Modal, Input, Button, Space, Select, message, Row, Col } from 'antd';
import useFetchBarrios from './fetchs/fetchBarrios'; // Importación de los barrios
import useFetchDias from './fetchs/fetchDias';
import useFetchProductos from './fetchs/fetchProductos';

const { Option } = Select;

const IngresarNombreModal = ({ visible, onClose }) => {
  // Estados para cada campo de entrada
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [selectedBarrio, setSelectedBarrio] = useState(null);
  const [telefono, setTelefono] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [pedidos, setPedidos] = useState([{ cantidad: '', idProducto: null }]);
  const [diasRecorrido, setDiasRecorrido] = useState([{ idDia: null }]);
  const [maxPedidos, setMaxPedidos] = useState(0);

  // Hook personalizado para obtener los barrios, días y productos
  const { barrios, loading, error } = useFetchBarrios();
  const { dias, loadingD, errorD } = useFetchDias();
  const { productos, loadingP, errorP } = useFetchProductos();

  const handleOk = () => {
    // Validación de campos obligatorios
    if (!nombre || !direccion || !selectedBarrio || !telefono) {
      message.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const clienteData = {
      nombre,
      direccion,
      idBarrio: selectedBarrio,
      telefono,
      observaciones,
      pedidos: pedidos.map((pedido) => ({
        cantidad: Number(pedido.cantidad),
        producto: pedido.idProducto,
      })),
      diasRecorrido: diasRecorrido.map((diaRecorrido) => ({
        dia: diaRecorrido.idDia,
      })),
    };

    console.log(JSON.stringify(clienteData, null, 2));

    onClose();
    resetFields(); // Reiniciar campos después de cerrar
  };

  const resetFields = () => {
    setNombre('');
    setDireccion('');
    setSelectedBarrio(null);
    setTelefono('');
    setObservaciones('');
    setPedidos([{ cantidad: '', idProducto: null }]);
    setDiasRecorrido([{ idDia: null }]);
  };

  const addPedido = () => {
    if (pedidos.length < maxPedidos) {
      setPedidos([...pedidos, { cantidad: '', idProducto: null }]);
    } else {
      message.error(`No puedes agregar más de ${maxPedidos} pedidos.`);
    }
  };

  const removePedido = (index) => {
    const newPedidos = [...pedidos];
    newPedidos.splice(index, 1);
    setPedidos(newPedidos);
  };

  const addDiaRecorrido = () => {
    if (diasRecorrido.length < 2) { // Limitar a 2 días
      setDiasRecorrido([...diasRecorrido, { idDia: null }]);
    }
  };

  const removeDiaRecorrido = (index) => {
    const newDiasRecorrido = [...diasRecorrido];
    newDiasRecorrido.splice(index, 1);
    setDiasRecorrido(newDiasRecorrido);
  };

  const handleBarrioChange = (value) => {
    setSelectedBarrio(value);
  };

  const handleProductoChange = (index, value) => {
    const newPedidos = [...pedidos];
    newPedidos[index].idProducto = value;
    setPedidos(newPedidos);
  };

  const handleCantidadChange = (index, value) => {
    // Convertir el valor a número
    const cantidad = Number(value);
  
    // Solo actualizar si es un número no negativo
    if (cantidad >= 0 || value === '') {
      const newPedidos = [...pedidos];
      newPedidos[index].cantidad = value;
      setPedidos(newPedidos);
    }
  };

  const handleDiaChange = (index, value) => {
    const newDiasRecorrido = [...diasRecorrido];
    newDiasRecorrido[index].idDia = value;
    setDiasRecorrido(newDiasRecorrido);
  };

  const handleCantidadKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === '-') {
      e.preventDefault(); // Evitar la entrada de números negativos
    }
  };

  useEffect(() => {
    if (productos.length) {
      setMaxPedidos(productos.length); // Establecer el límite de pedidos
    }
  }, [productos]);

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
        required
      />
      <Input
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        placeholder='Dirección'
        style={{ marginTop: 10 }}
        required
      />
      <Select
        style={{ width: '100%', marginTop: 10 }}
        placeholder='Selecciona un barrio'
        onChange={handleBarrioChange}
        showSearch
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
        required
      >
        {barrios.map((barrio) => (
          <Option key={barrio.idBarrio} value={barrio.idBarrio}>
            {barrio.nombreBarrio}
          </Option>
        ))}
      </Select>

      <Input
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder='Teléfono'
        style={{ marginTop: 10 }}
        required
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
          <Row key={index} style={{ marginBottom: 10 }} align='middle'>
            <Col span={9} style={{ marginRight: 10 }}>
              <Input
                style={{ width: '100%' }}
                value={pedido.cantidad}
                onChange={(e) => handleCantidadChange(index, e.target.value)}
                placeholder='Cantidad'
                type='number'
                onKeyDown={handleCantidadKeyDown} // Agregar validación para evitar negativos
                required
              />
            </Col>
            <Col span={9}>
              <Select
                style={{ width: '100%' }}
                placeholder='Selecciona un producto'
                onChange={(value) => handleProductoChange(index, value)}
                required
              >
                {productos.map((producto) => (
                  <Option key={producto.idProducto} value={producto.idProducto}>
                    {producto.tipoProducto}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Button type='link' onClick={() => removePedido(index)}>
                Eliminar
              </Button>
            </Col>
          </Row>
        ))}
        <Button onClick={addPedido} type='dashed' style={{ width: '100%' }}>
          Agregar Pedido
        </Button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4>Días de Recorrido</h4>
        {diasRecorrido.map((diaRecorrido, index) => (
          <Row key={index} style={{ marginBottom: 10 }} align='middle'>
            <Col span={20}>
              <Select
                style={{ width: '100%' }}
                placeholder='Selecciona un día'
                onChange={(value) => handleDiaChange(index, value)}
                required
              >
                {dias.map((dia) => (
                  <Option key={dia.idDia} value={dia.idDia}>
                    {dia.diaSemana}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <Button type='link' onClick={() => removeDiaRecorrido(index)}>
                Eliminar
              </Button>
            </Col>
          </Row>
        ))}
        <Button
          onClick={addDiaRecorrido}
          type='dashed'
          style={{ width: '100%' }}
        >
          Agregar Día
        </Button>
      </div>
    </Modal>
  );
};

export default IngresarNombreModal;
