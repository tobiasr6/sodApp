import { useState, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../../services/apiRoutes'; // Asegúrate de importar la configuración de tu API correctamente
import { message } from 'antd';

const useFetchUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get(
        `${apiConfig.API_BASE_URL}${apiConfig.apiUsuarios.todosUsuarios}`
      );
      setUsuarios(response.data);

    } catch (error) {
        setError('Error al obtener los usuarios');
        console.error(error);
      message.error('Error al obtener los usuarios');
    }finally {
        setLoading(false);
    }
};

fetchUsuarios();
}, []);

return { usuarios, loading, error };
};

export default useFetchUsuarios;