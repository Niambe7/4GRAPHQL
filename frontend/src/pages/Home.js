// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Bienvenue sur SchooInc</h1>
        <p>La meilleure expérience pour étudiants et professeurs</p>
        {/* Utilise navigate pour rediriger vers /login */}
        <button className="btn-login" onClick={() => navigate('/login')}>
          Se connecter
        </button>
      </header>
      <section className="home-features">
        <div className="feature-card">
          <h2>Gestion des Utilisateurs</h2>
          <p>Créez, modifiez et supprimez vos profils en toute simplicité.</p>
        </div>
        <div className="feature-card">
          <h2>Notes & Cours</h2>
          <p>Consultez vos notes et suivez votre progression dans vos cours.</p>
        </div>
        <div className="feature-card">
          <h2>Classes & Statistiques</h2>
          <p>Accédez aux statistiques de vos classes et visualisez vos performances.</p>
        </div>
      </section>
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} SchooInc. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Home;
