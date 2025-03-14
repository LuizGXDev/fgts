import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Inicio from "../Inicio/Inicio.jsx";
import Login from "../Login/Login.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redireciona para a página inicial sem o prefixo /maiscredito */}
        <Route path="/" element={<Navigate to="/saque-do-emprestimo" />} />
        <Route path="/saque-do-emprestimo" element={<Inicio />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
