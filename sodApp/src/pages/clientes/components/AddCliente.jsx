import { useState, useEffect } from 'react';
import {  Modal, Input, Button, Space, Select, message, Row, Col, Divider} from 'antd';
import useFetchBarrios from '../../../routes/fetchs/fetchBarrios'; // Importación de los barrios
import useFetchDias from '../../../routes/fetchs/fetchDias';
import useFetchProductos from '../../../routes/fetchs/fetchProductos';
import { agregarClienteService } from '../services/addCliente';

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
  const [estado, setEstado] = useState('')

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

    // Validación para evitar espacios en el teléfono
    if (telefono.trim().includes(' ')) {
      message.error('El teléfono no debe contener espacios.');
      return;
    }

    const clienteData = {
      nombre,
      direccion,
      idBarrio: selectedBarrio,
      telefono,
      observaciones,
      estado,
      pedidos: pedidos.map((pedido) => ({
        cantidad: Number(pedido.cantidad),
        producto: pedido.idProducto
      })),
      diasRecorrido: diasRecorrido.map((diaRecorrido) => ({
        dia: diaRecorrido.idDia
      }))
    };

    // console.log(clienteData);
    agregarClienteService(clienteData)
      .then(() => {
        message.success('Cliente agregado correctamente!');
        onClose();
        resetFields();
        window.location.reload();
      })
      .catch((error) => {
        message.error(error.message);
      });

    console.log(JSON.stringify(clienteData, null, 2));
  };

  const resetFields = () => {
    setNombre('');
    setDireccion('');
    setSelectedBarrio(null);
    setTelefono('');
    setEstado('Activo')
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
    if (diasRecorrido.length < 2) {
      // Limitar a 2 días
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
      <label style={{ fontWeight: 'bold' }}>
        Nombre <span style={{ color: 'red' }}>*</span>
      </label>
      <Input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder='Nombre'
        style={{ marginBottom: 10 }} // Aumentar el margen
        required
      />

      <label style={{ fontWeight: 'bold' }}>
        Dirección <span style={{ color: 'red' }}>*</span>
      </label>
      <Input
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        placeholder='Dirección'
        style={{ marginBottom: 10 }} // Aumentar el margen
        required
      />

      <label style={{ fontWeight: 'bold' }}>
        Barrio <span style={{ color: 'red' }}>*</span>
      </label>
      <Select
        style={{ width: '100%', marginBottom: 10 }} // Aumentar el margen
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

      <label style={{ fontWeight: 'bold' }}>
        Teléfono <span style={{ color: 'red' }}>*</span>
      </label>
      <Input
        value={telefono}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ''); // Remover cualquier carácter que no sea numérico
          setTelefono(value);
        }}
        placeholder='Teléfono'
        inputMode='numeric' // Sugiere el teclado numérico en móviles
        pattern='[0-9]*' // Acepta solo números
        style={{ marginBottom: 10 }} // Aumentar el margen
        required
      />

      <label style={{ fontWeight: 'bold' }}>Observaciones</label>
      <Input
        value={observaciones}
        onChange={(e) => setObservaciones(e.target.value)}
        placeholder='Observaciones'
        style={{ marginBottom: 10 }} // Aumentar el margen
      />

      <label style={{ fontWeight: 'bold' }}>Estado</label>
      <Select
        style={{ width: '100%', marginBottom: 10 }} // Aumentar el margen
        placeholder='Estado'
        value={'Activo'}
      >
        <Option value='Activo' >Activo</Option>
        <Option value='Inactivo' >Inactivo</Option>
      </Select>

      <div style={{ marginTop: 20 }}>
        <Divider>Pedidos</Divider>
        {pedidos.map((pedido, index) => (
          <Row key={index} style={{ marginBottom: 10 }} align='middle'>
            <Col span={9} style={{ marginRight: 10 }}>
              <label style={{ fontWeight: 'bold' }}>Cantidad</label>
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
              <label style={{ fontWeight: 'bold' }}>Producto</label>
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
            <Button type='dashed' onClick={addPedido} style={{ width: '100%' }}>
          Agregar pedido
        </Button>
      </div>

      <div
        style={{
          marginTop: 20,
        }}
      >
        <Divider>Días de Recorrido</Divider>
        {diasRecorrido.map((diaRecorrido, index) => (
          <Row key={index} style={{ marginBottom: 10 }}>
            <Col span={20}>
              <label style={{ fontWeight: 'bold' }}>Día</label>
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
            <Col
              span={4}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <Button
                type='link'
                onClick={() => removeDiaRecorrido(index)}
                style={{ margin: 0 }}
              >
                Eliminar
              </Button>
            </Col>
          </Row>
        ))}
        <div
          style={{ marginTop: 10 }}
        >
          <Button
            onClick={addDiaRecorrido}
            type='dashed'
            style={{ width: '100%' }}
          >
            Agregar Día
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default IngresarNombreModal;
