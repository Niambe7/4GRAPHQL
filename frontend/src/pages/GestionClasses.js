// src/pages/GestionClasses.js
import React, { useState } from 'react';
import { useQuery, useMutation, ApolloProvider } from '@apollo/client';
import clientClasses from '../apollo/clientClasses';
import clientUser from '../apollo/clientUser';
import { GET_CLASSES, CREATE_CLASS, ADD_STUDENT_TO_CLASS, DELETE_CLASS, REMOVE_STUDENT_FROM_CLASS } from '../graphql/queries'; // Les queries/mutations pour les classes
import { GET_USERS } from '../graphql/userQueries'; // Pour récupérer la liste des utilisateurs
import './GestionClasses.css';

const GestionClassesContent = () => {
  // Récupération des classes triées par nom
  const { loading: classesLoading, error: classesError, data: classesData, refetch } = useQuery(GET_CLASSES, {
    variables: { sortByName: true },
  });

  // Mutation pour créer une classe
  const [createClass] = useMutation(CREATE_CLASS);
  // Mutation pour ajouter un étudiant à une classe
  const [addStudent] = useMutation(ADD_STUDENT_TO_CLASS);
  // Mutation pour supprimer une classe
  const [deleteClass] = useMutation(DELETE_CLASS);
  // Mutation pour supprimer un étudiant d'une classe
  const [removeStudent] = useMutation(REMOVE_STUDENT_FROM_CLASS);

  // État pour le formulaire de création d'une nouvelle classe
  const [newClassName, setNewClassName] = useState('');

  // État pour gérer la sélection d'ajout d’étudiant (par classe)
  const [studentSelections, setStudentSelections] = useState({});

  // État pour gérer la sélection de suppression d’étudiant (par classe)
  const [removeSelections, setRemoveSelections] = useState({});

  // Récupérer la liste des utilisateurs, et en filtrer uniquement ceux qui ont le rôle 'student'
  const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_USERS, { client: clientUser });
  const studentList = usersData?.users?.filter(u => u.role === 'student') || [];

  // Fonction pour créer une nouvelle classe
  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await createClass({ variables: { name: newClassName } });
      setNewClassName('');
      refetch();
    } catch (err) {
      console.error('Erreur création classe :', err);
    }
  };

  // Fonction pour ajouter un étudiant à une classe (par pseudo via son id)
  const handleAddStudent = async (e, classId) => {
    e.preventDefault();
    try {
      const studentId = studentSelections[classId];
      if (!studentId) return;
      await addStudent({ variables: { classId, studentId } });
      // Réinitialiser la sélection d'ajout pour cette classe
      setStudentSelections(prev => ({ ...prev, [classId]: '' }));
      refetch();
    } catch (err) {
      console.error('Erreur ajout étudiant :', err);
    }
  };

  // Fonction pour supprimer un étudiant d'une classe, avec confirmation
  const handleRemoveStudent = async (e, classId) => {
    e.preventDefault();
    const studentId = removeSelections[classId];
    if (!studentId) return;
    if (!window.confirm("Voulez-vous vraiment retirer cet étudiant de la classe ?")) return;
    try {
      await removeStudent({ variables: { classId, studentId } });
      // Réinitialiser la sélection de suppression pour cette classe
      setRemoveSelections(prev => ({ ...prev, [classId]: '' }));
      refetch();
    } catch (err) {
      console.error('Erreur suppression étudiant :', err);
    }
  };

  // Optionnel: fonction pour supprimer une classe entière (si nécessaire)
  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette classe ?")) return;
    try {
      await deleteClass({ variables: { id: classId } });
      refetch();
    } catch (err) {
      console.error('Erreur suppression classe :', err);
    }
  };

  // Gestion des erreurs et chargements
  if (classesLoading || usersLoading) return <p>Chargement en cours...</p>;
  if (classesError) return <p>Erreur chargement classes: {classesError.message}</p>;
  if (usersError) return <p>Erreur chargement utilisateurs: {usersError.message}</p>;

  return (
    <div className="gestion-container">
      <h1>Gestion des Classes</h1>

      {/* Formulaire pour créer une nouvelle classe */}
      <div className="create-class-section">
        <form onSubmit={handleCreateClass} className="create-class-form">
          <input
            type="text"
            placeholder="Nom de la classe"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            required
          />
          <button type="submit" className="btn-action">
            Créer une nouvelle classe
          </button>
        </form>
      </div>

      {/* Affichage des classes sous forme de cartes */}
      <div className="classes-grid">
        {classesData.classes.map((classe) => (
          <div className="class-card" key={classe.id}>
            <div className="card-content">
              <h2>{classe.name}</h2>
              <p>
                <strong>Étudiants :</strong>{' '}
                {classe.students && classe.students.length > 0
                  ? // Pour chaque étudiant inscrit (stocké dans classe.students en tant qu'IDs), afficher le pseudo en recherchant dans studentList
                    classe.students
                      .map(id => {
                        const student = studentList.find(s => s.id.toString() === id.toString());
                        return student ? student.pseudo : null;
                      })
                      .filter(Boolean)
                      .join(', ')
                  : 'Aucun étudiant'}
              </p>
            </div>
            <div className="card-actions">
              {/* Bouton pour supprimer la classe */}
              <button onClick={() => handleDeleteClass(classe.id)} className="btn-danger">
                Supprimer cette classe
              </button>
              
              {/* Formulaire pour ajouter un étudiant */}
              <form onSubmit={(e) => handleAddStudent(e, classe.id)} className="add-student-form">
                <select
                  value={studentSelections[classe.id] || ''}
                  onChange={(e) => setStudentSelections(prev => ({ ...prev, [classe.id]: e.target.value }))}
                  className="select-field"
                  required
                >
                  <option value="">-- Ajouter un etudiant --</option>
                  {studentList.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.pseudo}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn-secondary">
                  Ajouter
                </button>
              </form>
              
              {/* Formulaire pour retirer un étudiant */}
              {classe.students && classe.students.length > 0 && (
                <form onSubmit={(e) => handleRemoveStudent(e, classe.id)} className="remove-student-form">
                  <select
                    value={removeSelections[classe.id] || ''}
                    onChange={(e) => setRemoveSelections(prev => ({ ...prev, [classe.id]: e.target.value }))}
                    className="select-field"
                    required
                  >
                    <option value="">-- Supprimer un etudiant --</option>
                    {classe.students
                      .map(id => {
                        const student = studentList.find(s => s.id.toString() === id.toString());
                        return student ? { id: student.id, pseudo: student.pseudo } : null;
                      })
                      .filter(Boolean)
                      .map(student => (
                        <option key={student.id} value={student.id}>
                          {student.pseudo}
                        </option>
                      ))}
                  </select>
                  <button type="submit" className="btn-danger">
                    Supprimer
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Le composant GestionClasses est enveloppé dans ApolloProvider utilisant clientClasses
const GestionClasses = () => {
  return (
    <ApolloProvider client={clientClasses}>
      <GestionClassesContent />
    </ApolloProvider>
  );
};

export default GestionClasses;
