import { useState, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../../services/apiRoutes'; // Asegúrate de importar la configuración de tu API correctamente
import { message } from 'antd';

const useFetchBarrios = () => {
    const [barrios, setBarrios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        const fetchBarrios = async () => {
            try {
                const response = await axios.get(
        `${apiConfig.API_BASE_URL}${apiConfig.apiBarrios.todosBarrios}`
      );
      setBarrios(response.data);

    } catch (error) {
        setError('Error al obtener los barrios');
        console.error(error);
      message.error('Error al obtener los barrios');
    }finally {
        setLoading(false);
    }
};

fetchBarrios();
}, []);

return { barrios, loading, error };
};

export default useFetchBarrios;