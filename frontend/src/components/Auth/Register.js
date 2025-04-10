// src/components/Auth/Register.js
import React, { useState } from 'react';
import { useMutation, ApolloProvider } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { REGISTER_USER } from '../../graphql/userQueries';
import clientUser from '../../apollo/clientUser';
import './Auth.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pseudo: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [registerUser, { error }] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      console.log('Inscription réussie:', data.register);
      // Redirection vers la page de connexion après inscription
      navigate('/login');
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      await registerUser({
        variables: {
          email: formData.email,
          pseudo: formData.pseudo,
          password: formData.password,
          role: "student"
        }
      });
    } catch (err) {
      console.error('Erreur d’inscription:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Inscription</h2>
        <form onSubmit={handleSubmit}>
          <label>Pseudo :</label>
          <input 
            type="text" 
            name="pseudo" 
            value={formData.pseudo} 
            onChange={handleChange} 
            placeholder="Votre pseudo"
            required 
          />
          <label>Email :</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Votre email"
            required 
          />
          <label>Mot de passe :</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Votre mot de passe"
            required 
          />
          <label>Confirmer le mot de passe :</label>
          <input 
            type="password" 
            name="confirmPassword" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            placeholder="Confirmez votre mot de passe"
            required 
          />
          <button type="submit" className="btn-submit">S'inscrire</button>
        </form>
        {error && <p className="error-message">Erreur d'inscription: {error.message}</p>}
        <button className="btn-back" onClick={() => navigate('/')}>
          Retour à l'accueil
        </button>
        <p className="auth-switch-text">
          Vous avez déjà un compte ? <span onClick={() => navigate('/login')}>Se connecter</span>
        </p>
      </div>
    </div>
  );
};

const Register = () => {
  return (
    <ApolloProvider client={clientUser}>
      <RegisterForm />
    </ApolloProvider>
  );
};

export default Register;
