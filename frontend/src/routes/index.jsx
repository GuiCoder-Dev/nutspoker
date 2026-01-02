import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage'; 
import ParticipantsTables from '../pages/ParticipantsTables';
import ChampionsPage from '../pages/ChampionsPage';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/participants" element={<ParticipantsTables/>} />
        <Route path="/champions" element={<ChampionsPage/>} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;