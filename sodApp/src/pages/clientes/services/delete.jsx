// clienteService.js
import axios from 'axios';
import apiConfig from '../../../services/apiRoutes';

// Función para eliminar un cliente por ID
export const eliminarCliente = async (idCliente) => {
  try {
    const response = await axios.delete(`${apiConfig.API_BASE_URL}${apiConfig.apiClientes.eliminarCliente(idCliente)}`);
    return response.data; // Devuelve la respuesta si es necesario
  } catch (error) {
    // Manejo de errores
    console.error('Error al eliminar el cliente:', error);
    throw error; // Lanza el error para que el componente lo maneje
  }
};
