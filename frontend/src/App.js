// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import GestionClasses from './pages/GestionClasses';
import GestionNotes from './pages/GestionNotes';
import GestionCours from './pages/GestionCours';
import GestionEtudiants from './pages/GestionEtudiants'; 
import MesCours from './pages/MesCours';
import MesNotes from './pages/MesNotes';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/classes" element={<GestionClasses />} />
        <Route path="/notes" element={<GestionNotes />} />
        <Route path="/students" element={<GestionEtudiants />} />
        <Route path="/courses" element={<GestionCours />} />
        <Route path="/mes-notes" element={<MesNotes />} />
        <Route path="/mes-cours" element={<MesCours />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
