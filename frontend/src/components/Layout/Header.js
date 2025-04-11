// src/components/Layout/Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="global-header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/">SchooInc</Link>
        </div>
        <nav className="header-nav">
          <ul>
            {user ? (
              user.role === 'professor' ? (
                <>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><Link to="/classes">Gestion des Classes</Link></li>
                  <li><Link to="/notes">Gestion des Notes</Link></li>
                  <li><Link to="/students">Gestion des Étudiants</Link></li>
                  <li><Link to="/courses">Gestion des Cours</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/dashboard">Mon Espace</Link></li>
                  <li><Link to="/mes-notes">Mes Notes</Link></li>
                  <li><Link to="/mes-cours">Mes Cours</Link></li>
                </>
              )
            ) : (
              <>
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/login">Se connecter</Link></li>
                <li><Link to="/register">S'inscrire</Link></li>
              </>
            )}
          </ul>
        </nav>
        {user && (
          <div className="header-user">
            <span className="header-username">Bonjour, {user.pseudo}</span>
            <button className="header-logout" onClick={handleLogout}>Déconnexion</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
