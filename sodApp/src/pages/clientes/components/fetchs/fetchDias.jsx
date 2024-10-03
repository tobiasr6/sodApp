import { useState, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../../../../services/apiRoutes'; // Asegúrate de importar la configuración de tu API correctamente
import { message } from 'antd';

const useFetchDias = () => {
    const [dias, setDias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        const fetchDias = async () => {
            try {
                const response = await axios.get(
        `${apiConfig.API_BASE_URL}${apiConfig.apiDias.todosDias}`
      );
      setDias(response.data);
      console.log('Data: ', response.data)

    } catch (error) {
        setError('Error al obtener los dias');
        console.error(error);
      message.error('Error al obtener los dias');
    }finally {
        setLoading(false);
    }
};

fetchDias();
}, []);

return { dias, loading, error };
};

export default useFetchDias;