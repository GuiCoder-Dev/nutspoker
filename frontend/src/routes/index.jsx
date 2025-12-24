import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage'; 
import ParticipantsTables from '../pages/ParticipantsTables';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/participants" element={<ParticipantsTables/>} />
       
      </Routes>
    </Router>
  );
}

export default AppRoutes;