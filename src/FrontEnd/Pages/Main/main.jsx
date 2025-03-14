import React from 'react';  // Importa o React
import { createRoot } from 'react-dom/client';  // Para o React 18+
import App from '../App/App.jsx';  // Importe o seu componente App

createRoot(document.getElementById('root')).render(
    <App />
);
