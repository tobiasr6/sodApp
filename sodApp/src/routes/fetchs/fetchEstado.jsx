import { useState, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../../services/apiRoutes'; // Asegúrate de importar la configuración de tu API correctamente
import { message } from 'antd';

const useFetchEstados = () => {
    const [estados, setEstados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        const fetchEstados = async () => {
            try {
                const response = await axios.get(
        `${apiConfig.API_BASE_URL}${apiConfig.apiEstado.todosEstados}`
      );
      setEstados(response.data);

    } catch (error) {
        setError('Error al obtener los estados');
        console.error(error);
      message.error('Error al obtener los estados');
    }finally {
        setLoading(false);
    }
};

fetchEstados();
}, []);

return { estados, loading, error };
};

export default useFetchEstados;