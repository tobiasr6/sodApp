import axios from 'axios';
import apiConfig from '../../../services/apiRoutes';

export const agregarClienteService = async (clienteData) => {
  try {
    const response = await axios.post(`${apiConfig.API_BASE_URL}${apiConfig.apiClientes.crearCliente}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al agregar cliente');
  }
};
