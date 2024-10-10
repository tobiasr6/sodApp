import axios from 'axios';
import apiConfig from '../../services/apiRoutes'

export const editClient = async (idCliente, clienteData) => {
  const response = await axios.put(`${apiConfig.API_BASE_URL}${apiConfig.apiClientes.editarCliente(idCliente)}`, clienteData);
  return response.data;
};
