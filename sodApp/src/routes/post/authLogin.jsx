import { useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../../services/apiRoutes';

const AuthLogin = ({ username, password, openNotification, setLoading, navigate }) => {
    useEffect(() => {
        const loginUser = async () => {
            if (username && password) {
                try {
                    const response = await axios.post(`${apiConfig.API_BASE_URL}${apiConfig.apiUsuarios.userActivo}`, {
                        username: username,
                        password: password,
                    });

                    const data = response.data;

                    if (response.status === 200) {
                        openNotification('success', 'Inicio de sesión exitoso');
                        localStorage.setItem('user', data.nombre); // Guardar información del usuario
                        localStorage.setItem('token', data.token); // Simular token si es necesario
                        navigate('/entregas'); // Redirige a la página deseada
                    } else {
                        openNotification('error', data.message || 'Error en el inicio de sesión');
                    }
                } catch (error) {
                    if (error.response) {
                        openNotification('error', error.response.data.message || 'Error del servidor');
                    } else {
                        openNotification('error', 'Error de conexión al servidor');
                    }
                } finally {
                    setLoading(false); // Restablece el estado de carga al final
                }
            }
        };

        loginUser();
    }, [username, password, openNotification, setLoading, navigate]);

    return null; // No se necesita renderizar nada
};

export default AuthLogin;
