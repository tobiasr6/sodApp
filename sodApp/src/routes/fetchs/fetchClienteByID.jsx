import { useState, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../../services/apiRoutes'; // Asegúrate de importar la configuración de tu API correctamente
import { message } from 'antd';

const useFetchClienteById = (clienteId) => {
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCliente = async () => {
            if (!clienteId) return; // No hacer nada si no hay ID

            try {
                const response = await axios.get(
                    `${apiConfig.API_BASE_URL}${apiConfig.apiClientes.clienteID(clienteId)}` // Cambia la ruta según tu configuración
                );
                setCliente(response.data);
            } catch (error) {
                setError('Error al obtener el cliente');
                console.error(error);
                message.error('Error al obtener el cliente');
            } finally {
                setLoading(false);
            }
        };

        fetchCliente();
    }, [clienteId]); // Se ejecutará cada vez que cambie el clienteId

    return { cliente, loading, error };
};

export default useFetchClienteById;
