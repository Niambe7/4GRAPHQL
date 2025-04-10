// src/pages/Dashboard.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return <div>Chargement...</div>;

  const renderProfessorDashboard = () => (
    <div className="dashboard-container">
      <h1>Bienvenue, Professeur @{user.pseudo}</h1>
      
      <div className="dashboard-cards">
        {/* Chaque carte devient cliquable via onClick -> navigate() */}
        <div className="card" onClick={() => navigate('/classes')}>
          <h2>Nombre de Classes</h2>
          <p>5</p>
        </div>
        <div className="card" onClick={() => navigate('/notes')}>
          <h2>Évaluations Récentes</h2>
          <p>3 nouvelles évaluations</p>
        </div>
        <div className="card" onClick={() => navigate('/students')}>
          <h2>Statistiques Globales</h2>
          <p>Médiane: 15,0</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Dernières Activités</h2>
        <ul>
          <li>Création de la classe "Maths Avancés"</li>
          <li>Mise à jour des notes de la classe "Physique"</li>
          <li>Message envoyé à l'ensemble des étudiants</li>
        </ul>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="dashboard-container">
      <h1>Bienvenue, @{user.pseudo}</h1>
      
      <div className="dashboard-cards">
        <div className="card">
          <h2>Note Moyenne</h2>
          <p>16,5</p>
        </div>
        <div className="card">
          <h2>Cours Suivis</h2>
          <p>Mathématiques, Physique, Informatique</p>
        </div>
        <div className="card">
          <h2>Activité Récente</h2>
          <p>5 cours à jour</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Historique des Notes</h2>
        <ul>
          <li>Mathématiques: 17</li>
          <li>Physique: 16</li>
          <li>Informatique: 18</li>
        </ul>
      </div>
    </div>
  );

  return user.role === 'professor'
    ? renderProfessorDashboard()
    : renderStudentDashboard();
};

export default Dashboard;
