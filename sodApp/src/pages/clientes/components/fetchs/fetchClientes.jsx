import { useState, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../../../../services/apiRoutes'; // Asegúrate de importar la configuración de tu API correctamente
import { message } from 'antd';

const useFetchClientes = () => {
  const [clientes, setClientes] = useState([]);
  
  const fetchClientes = async () => {
    try {
      const response = await axios.get(
        `${apiConfig.API_BASE_URL}${apiConfig.apiClientes.todosClientes}`
      );
      const usersArray = Array.isArray(response.data)
        ? response.data
        : [];
      setClientes(usersArray);

    } catch (error) {
      console.error('Hubo un error al obtener los clientes:', error);
      message.error('Error al obtener los clientes');
    }

  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return [clientes, fetchClientes];
};

export default useFetchClientes;
