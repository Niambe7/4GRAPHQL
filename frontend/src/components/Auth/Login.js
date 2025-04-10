import React, { useState, useContext } from 'react';
import { useMutation, gql } from '@apollo/client';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        pseudo
        role
      }
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Notre fonction login du contexte
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      // Stocke le token et le user dans le contexte
      login(data.login.token, data.login.user);
      // Redirige vers le dashboard ou une autre page de votre choix
      navigate('/dashboard');
    }
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation({ variables: { email: formData.email, password: formData.password } });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <label>Email :</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          <label>Mot de passe :</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          <button type="submit" className="btn-submit">Se connecter</button>
        </form>
        {error && <p className="error-message">Erreur : {error.message}</p>}
      </div>
    </div>
  );
};

export default Login;
