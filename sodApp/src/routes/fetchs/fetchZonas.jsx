import { useState, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../../services/apiRoutes'; // Asegúrate de importar la configuración de tu API correctamente
import { message } from 'antd';

const useFetchZonas = () => {
    const [zonas, setZonas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        const fetchZonas = async () => {
            try {
                const response = await axios.get(
        `${apiConfig.API_BASE_URL}${apiConfig.apiZonas.todasZonas}`
      );
      setZonas(response.data);

    } catch (error) {
        setError('Error al obtener las zonas');
        console.error(error);
      message.error('Error al obtener las zonas');
    }finally {
        setLoading(false);
    }
};

fetchZonas();
}, []);

return { zonas, loading, error };
};

export default useFetchZonas;