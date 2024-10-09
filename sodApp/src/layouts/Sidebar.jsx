import { useState } from 'react';
import { Layout, Menu, Modal } from 'antd';
import { UserOutlined, ShopOutlined, CarOutlined, EnvironmentOutlined, LogoutOutlined,  SettingOutlined } from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import logoCompleto from '../assets/SODAPP.png';  // Importar logo completo
import imagotipo from '../assets/Soda.png';        // Importar imagotipo

const { Header, Sider, Content } = Layout;

const BaseLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    const handleMenuClick = ({ key }) => {
        if (key === 'logout') {
            setIsModalVisible(true);
        } else {
            navigate(key);
        }
    };

    const handleOk = () => {
        setIsModalVisible(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div className="logo" style={{ height: 64, margin: 16, textAlign: 'center', marginBottom: 16 }}>
                    <img 
                        src={collapsed ? imagotipo : logoCompleto} 
                        alt="Logo" 
                        style={{ width: collapsed ? '50px' : '80%', height: 'auto' }} 
                    />
                </div>
                <Menu theme="dark" mode="inline" onClick={handleMenuClick} style={{ paddingTop: 16 }}>
                    <Menu.Item key="/entregas" icon={<CarOutlined />}>
                        Entregas
                    </Menu.Item>
                    <Menu.Item key="/clientes" icon={<UserOutlined />}>
                        Clientes
                    </Menu.Item>
                    <Menu.Item key="/pedidos" icon={<ShopOutlined />}>
                        Pedidos
                    </Menu.Item>
                    <Menu.Item key="/zonas" icon={<EnvironmentOutlined />}>
                        Zonas
                    </Menu.Item>
                    <Menu.Item key= "/config" icon= {<SettingOutlined />}>
                        Configuración
                    </Menu.Item>
                    <Menu.Item key="logout" icon={<LogoutOutlined />}>
                        Cerrar Sesión
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }} />
                <Content style={{ margin: '0 16px' }}>
                    <Outlet />
                </Content>
            </Layout>
            <Modal
                title="Confirmación"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Sí"
                cancelText="No"
            >
                <p>¿Estás seguro de que quieres cerrar sesión?</p>
            </Modal>
        </Layout>
    );
};

export default BaseLayout;
