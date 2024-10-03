import { useState, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../../../../services/apiRoutes'; // Asegúrate de importar la configuración de tu API correctamente
import { message } from 'antd';

const useFetchProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get(
        `${apiConfig.API_BASE_URL}${apiConfig.apiProducto.todosProductos}`
      );
      setProductos(response.data);
      console.log('Data: ', response.data)

    } catch (error) {
        setError('Error al obtener los productos');
        console.error(error);
      message.error('Error al obtener los productos');
    }finally {
        setLoading(false);
    }
};

fetchProductos();
}, []);

return { productos, loading, error };
};

export default useFetchProductos;