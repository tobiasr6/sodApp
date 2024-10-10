import './login.css';
import { useState } from 'react';
import { Button, Form, Input, notification } from 'antd';
import logo from '../../assets/SODAPP.png'; // Importa el logo
import AuthLogin from '../../routes/post/authLogin'; // Importa el componente de autenticación
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Crea la función de navegación

    const openNotificationWithIcon = (type, message) => {
        notification[type]({
            message: message,
            duration: 2,
        });
    };

    const onFinish = (values) => {
        setLoading(true);
        setUsername(values.username);
        setPassword(values.password);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                style={{ maxWidth: 300, margin: 'auto', padding: '100px 0' }}
            >
                <img src={logo} alt="Logo" style={{ width: '200px', marginBottom: '20px' }} />
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
            <AuthLogin username={username} password={password} openNotification={openNotificationWithIcon} setLoading={setLoading} navigate={navigate} />
        </div>
    );
};

export default Login;
