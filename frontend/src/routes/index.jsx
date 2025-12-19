import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage'; // Ajuste o caminho para a sua HomePage

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Outras rotas serão adicionadas aqui no futuro */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;