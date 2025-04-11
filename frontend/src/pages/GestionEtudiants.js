// src/pages/GestionEtudiants.js
import React, { useState } from 'react';
import { ApolloProvider, useQuery, useMutation } from '@apollo/client';
import clientUser from '../apollo/clientUser';
import {
  GET_USERS,
  REGISTER_USER,
  UPDATE_USER,
  DELETE_USER,
} from '../graphql/userQueries';
import './GestionEtudiants.css';

const GestionEtudiantsContent = () => {
  // Query pour récupérer tous les utilisateurs (étudiants, et potentiellement professeurs)
  const { loading, error, data, refetch } = useQuery(GET_USERS);

  // Mutations
  const [registerUser] = useMutation(REGISTER_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  // State pour le formulaire d'ajout d'un nouvel étudiant
  const [newUser, setNewUser] = useState({
    email: '',
    pseudo: '',
    password: '',
    role: 'student', // Par défaut on crée des étudiants
  });

  // State pour la mise à jour d'un étudiant
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({
    email: '',
    pseudo: '',
    password: '',
  });

  // Fonction pour ajouter un étudiant
  const handleRegisterUser = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ variables: { ...newUser } });
      setNewUser({ email: '', pseudo: '', password: '', role: 'student' });
      refetch();
    } catch (err) {
      console.error('Erreur création utilisateur:', err);
    }
  };

  // Fonction pour mettre à jour un étudiant
  const handleUpdateUser = async (userId) => {
    try {
      await updateUser({
        variables: {
          id: userId,
          email: editedUser.email,
          pseudo: editedUser.pseudo,
          password: editedUser.password,
        },
      });
      setEditingUserId(null);
      setEditedUser({ email: '', pseudo: '', password: '' });
      refetch();
    } catch (err) {
      console.error('Erreur mise à jour utilisateur:', err);
    }
  };

  // Fonction pour supprimer un étudiant
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet étudiant ?")){
      try {
        await deleteUser({ variables: { id: userId } });
        refetch();
      } catch (err) {
        console.error('Erreur suppression utilisateur:', err);
      }
    }
    
  };

  if (loading) return <p>Chargement des étudiants...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="gestion-etudiants-container">
      <h1>Gestion des Étudiants</h1>

      {/* Formulaire pour ajouter un nouvel étudiant */}
      <div className="etudiants-actions">
        <h2>Ajouter un Étudiant</h2>
        <form onSubmit={handleRegisterUser} className="create-user-form">
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Pseudo"
            value={newUser.pseudo}
            onChange={(e) =>
              setNewUser({ ...newUser, pseudo: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
          />
          <select
            value={newUser.role}
            onChange={(e) =>
              setNewUser({ ...newUser, role: e.target.value })
            }
          >
            <option value="student">Étudiant</option>
            <option value="professor">Professeur</option>
          </select>
          <button type="submit" className="btn-action">
            Ajouter Étudiant
          </button>
        </form>
      </div>

      {/* Tableau listant tous les étudiants */}
      <table className="etudiants-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Pseudo</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editingUserId === user.id ? (
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, email: e.target.value })
                    }
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    value={editedUser.pseudo}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser, pseudo: e.target.value })
                    }
                  />
                ) : (
                  user.pseudo
                )}
              </td>
              <td>{user.role}</td>
              <td>
                {editingUserId === user.id ? (
                  <>
                    <button
                      onClick={() => handleUpdateUser(user.id)}
                      className="btn-secondary"
                    >
                      Valider
                    </button>
                    <button
                      onClick={() => setEditingUserId(null)}
                      className="btn-danger"
                    >
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingUserId(user.id);
                        setEditedUser({
                          email: user.email,
                          pseudo: user.pseudo,
                          password: '',
                        });
                      }}
                      className="btn-secondary"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="btn-danger"
                    >
                      Supprimer
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const GestionEtudiants = () => {
  return (
    <ApolloProvider client={clientUser}>
      <GestionEtudiantsContent />
    </ApolloProvider>
  );
};

export default GestionEtudiants;
