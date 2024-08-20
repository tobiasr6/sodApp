import { createContext, useState } from 'react';
import clientesData from '../../data/clientes/clientes.json'; // Ajusta la ruta según la ubicación de tu JSON

export const ClientesContext = createContext();

export const ClientesProvider = ({ children }) => {
    const [clientes, setClientes] = useState(clientesData);

    const addCliente = (cliente) => {
        setClientes([...clientes, cliente]);
    };

    const updateCliente = (id, updatedCliente) => {
        setClientes(clientes.map(cliente =>
            cliente.id === id ? { ...cliente, ...updatedCliente } : cliente
        ));
    };

    const deleteCliente = (id) => {
        setClientes(clientes.filter(cliente => cliente.id !== id));
    };

    return (
        <ClientesContext.Provider value={{ clientes, addCliente, updateCliente, deleteCliente }}>
            {children}
        </ClientesContext.Provider>
    );
};
