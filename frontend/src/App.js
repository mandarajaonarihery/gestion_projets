import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ClientPage from './pages/ClientPage';
import ChefPage from './pages/ChefPage';
import GestionEquipe from './pages/chef/equipe'; 
import Membr from './pages/MembersPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} /> {/* Route pour la page de connexion */}
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/client/*" element={<ClientPage/>}/>
        <Route path="/chef/*" element={<ChefPage/>}/>
        <Route path="/membres/*" element={<Membr/>}/>
        {/* Ajoute d'autres routes si nécessaire */}
      </Routes>
    </Router>
  );
}

export default App;
