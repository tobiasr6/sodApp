import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ClientesProvider } from './components/context/ClientesContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClientesProvider>
      <App />
    </ClientesProvider>
  </StrictMode>,
);
