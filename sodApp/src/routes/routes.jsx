import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login/Login';
import BaseLayout from '../layouts/Sidebar';
import Clientes from '../pages/clientes/Clientes';
import Pedidos from '../pages/pedidos/Pedidos';
import Entregas from '../pages/entregas/Entregas';
import Zonas from '../pages/zonas/Zonas';
import Config from '../pages/config/Config';

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route element={<BaseLayout />}>
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/pedidos" element={<Pedidos />} />
                    <Route path="/entregas" element={<Entregas />} />
                    <Route path="/zonas" element={<Zonas />} />
                    <Route path="/config" element={<Config />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default AppRoutes;
