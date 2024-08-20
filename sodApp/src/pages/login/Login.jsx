import './login.css';
import { useState } from 'react';
import { Button, Form, Input, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import users from '../../data/login/dataLogin.json';  // Importar el JSON con los datos
import logo from '../../assets/SODAPP.png';  // Importa el logo

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const openNotificationWithIcon = (type, message) => {
        notification[type]({
            message: message,
            duration: 2,
        });
    };

    const onFinish = (values) => {
        setLoading(true);

        // Buscar coincidencia en los usuarios
        const user = users.find(u => u.alias === values.username && u.password === values.password);

        if (user) {
            // Si las credenciales coinciden
            openNotificationWithIcon('success', 'Inicio de sesión exitoso');
            localStorage.setItem('token', 'your-jwt-token'); // Simulación de token
            localStorage.setItem('user', user.alias);
            navigate('/entregas');
        } else {
            // Si las credenciales no coinciden
            openNotificationWithIcon('error', 'Credenciales incorrectas');
            setLoading(false);
        }
    };

    return (
        <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            style={{ maxWidth: 300, margin: 'auto', padding: '100px 0', textAlign: 'center' }}
        >
            {/* Logo */}
            <img src={logo} alt="Logo" style={{ width: '200px', marginBottom: '20px' }} />

            {/* Inputs */}
            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Por favor ingresa tu nombre de usuario!' }]}
            >
                <Input placeholder="Usuario" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Por favor ingresa tu contraseña!' }]}
            >
                <Input.Password placeholder="Contraseña" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Ingresar
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Login;
