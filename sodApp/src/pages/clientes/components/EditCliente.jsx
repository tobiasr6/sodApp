import { useState, useEffect } from 'react';
import { Modal, Input, Button, Select, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { editClient } from '../../../routes/put/editClientService'; // Importar la función de envío al backend
import useFetchBarrios from '../../../routes/fetchs/fetchBarrios'; // Asegúrate de que estas rutas sean correctas
import useFetchDias from '../../../routes/fetchs/fetchDias';
import useFetchProductos from '../../../routes/fetchs/fetchProductos';

const { Option } = Select;

const EditarCliente = ({ cliente }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [selectedBarrio, setSelectedBarrio] = useState(null);
  const [telefono, setTelefono] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [pedidos, setPedidos] = useState([{ cantidad: '', idProducto: null }]);
  const [diasRecorrido, setDiasRecorrido] = useState([{ idDia: '' }]);
  const [idCliente, setIdCliente] = useState('');

  // Hook personalizado para obtener los barrios, días y productos
  const { barrios } = useFetchBarrios();
  const { dias } = useFetchDias();
  const { productos } = useFetchProductos();

  const showModal = () => {
    setIsModalOpen(true);

    // Inicializamos los valores del cliente al abrir el modal
    if (cliente) {
      setIdCliente(cliente.id);
      setNombre(cliente.nombre);
      setDireccion(cliente.direccion);
      setSelectedBarrio(cliente.idBarrio);
      setTelefono(cliente.telefono);
      setObservaciones(cliente.observaciones);

      setPedidos(
        cliente.pedidos.map((pedido) => {
          const productoEncontrado = productos.find(
            (prod) => prod.tipoProducto === pedido.producto
          );
          return {
            cantidad: pedido.cantidad,
            idProducto: productoEncontrado
              ? productoEncontrado.idProducto
              : null // Asegurarse de encontrar el ID
          };
        })
      );

      setDiasRecorrido(
        cliente.diasRecorrido.map((diaRecorrido) => {
          const diaEncontrado = dias.find(
            (dia) => dia.diaSemana === diaRecorrido.dia
          );
          return {
            idDia: diaEncontrado ? diaEncontrado.idDia : null
          };
        })
      );
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    resetFields(); // Reseteamos los campos al cerrar el modal
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
  const handleOk = async () => {
    const clienteData = {
      idCliente,
      nombre,
      direccion,
      idBarrio: selectedBarrio,
      telefono,
      observaciones,
      pedidos: pedidos.map((pedido) => ({
        cantidad: Number(pedido.cantidad),
        producto: pedido.idProducto
      })),
      diasRecorrido: diasRecorrido.map((diaRecorrido) => ({
        dia: diaRecorrido.idDia
      }))
    };

    try {
      await editClient(cliente.id, clienteData); // Enviar al backend
      message.success('Cliente actualizado con éxito');
      handleCancel();
      window.location.reload();
      // console.log('clienteData', clienteData);
    } catch (error) {
      message.error('Error al actualizar el cliente');
      // console.log('clienteData', clienteData);
      // console.log('diasRecorrido', diasRecorrido);
      // console.log('dias', dias);
    }

  };

  const addPedido = () => {
    setPedidos([...pedidos, { cantidad: '', idProducto: null }]);
  };

  const removePedido = (index) => {
    const newPedidos = [...pedidos];
    newPedidos.splice(index, 1);
    setPedidos(newPedidos);
  };

  const handlePedidoChange = (index, field, value) => {
    const newPedidos = [...pedidos];
    newPedidos[index][field] = value;
    setPedidos(newPedidos);
  };

  const addDiaRecorrido = () => {
    setDiasRecorrido([...diasRecorrido, { idDia: null }]);
  };

  const removeDiaRecorrido = (index) => {
    const newDiasRecorrido = [...diasRecorrido];
    newDiasRecorrido.splice(index, 1);
    setDiasRecorrido(newDiasRecorrido);
  };

  const handleDiaRecorridoChange = (index, field, value) => {
    const newDiasRecorrido = [...diasRecorrido];
    newDiasRecorrido[index][field] = value;
    setDiasRecorrido(newDiasRecorrido);
  };

  return (
    <>
      <Button
        type='primary'
        icon={
          <EditOutlined
            style={{ color: 'black', backgroundColor: 'transparent' }}
          />
        }
        onClick={showModal}
        style={{
          backgroundColor: 'transparent',
          borderColor: 'gray'
        }}
      />
      <Modal
        title='Editar Cliente'
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key='cancel' onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key='submit' type='primary' onClick={handleOk}>
            Guardar
          </Button>
        ]}
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
          onChange={(value) => setSelectedBarrio(value)}
          value={selectedBarrio}
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
            <div key={index} style={{ display: 'flex', marginBottom: 10 }}>
              <Input
                value={pedido.cantidad}
                onChange={(e) =>
                  handlePedidoChange(index, 'cantidad', e.target.value)
                }
                placeholder='Cantidad'
                style={{ width: '30%', marginRight: 10 }}
                required
              />
              <Select
                value={pedido.idProducto || undefined} // Asegúrate de que el valor inicial esté correctamente definido
                style={{ width: '60%', marginRight: 10 }}
                placeholder='Selecciona un producto'
                onChange={(value) =>
                  handlePedidoChange(index, 'idProducto', value)
                }
                required
              >
                {productos.map((producto) => (
                  <Option key={producto.idProducto} value={producto.idProducto}>
                    {producto.tipoProducto}
                  </Option>
                ))}
              </Select>

              <Button onClick={() => removePedido(index)} type='link' danger>
                Eliminar
              </Button>
            </div>
          ))}
          <Button type='dashed' onClick={addPedido}>
            Agregar Pedido
          </Button>
        </div>

        <div style={{ marginTop: 20 }}>
          <h4>Días de Recorrido</h4>
          {diasRecorrido.map((diaRecorrido, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: 10 }}>
              <Select
                value={diaRecorrido.idDia || undefined} // Asegúrate de que sea el ID numérico
                style={{ width: '100%', marginRight: 10 }}
                placeholder='Selecciona un día'
                onChange={(value) =>
                  handleDiaRecorridoChange(index, 'idDia', value)
                }
                required
              >
                {dias.map((dia) => (
                  <Option key={dia.idDia} value={dia.idDia}>
                    {dia.diaSemana}
                  </Option>
                ))}
              </Select>

              <Button
                onClick={() => removeDiaRecorrido(index)}
                type='link'
                danger
              >
                Eliminar
              </Button>
            </div>
          ))}
          <Button type='dashed' onClick={addDiaRecorrido}>
            Agregar Día de Recorrido
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default EditarCliente;
