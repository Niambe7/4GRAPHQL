// src/pages/GestionClasses.js
import React, { useState } from 'react';
import { useQuery, useMutation, ApolloProvider } from '@apollo/client';
import clientClasses from '../apollo/clientClasses';
import clientUser from '../apollo/clientUser';
import { GET_CLASSES, CREATE_CLASS, ADD_STUDENT_TO_CLASS } from '../graphql/queries'; // Query et mutations pour les classes
import { GET_USERS } from '../graphql/userQueries'; // Query pour récupérer les utilisateurs
import './GestionClasses.css';

const GestionClassesContent = () => {
  // 1. Récupération des classes (triées par nom)
  const { loading: classesLoading, error: classesError, data: classesData, refetch } = useQuery(GET_CLASSES, {
    variables: { sortByName: true },
  });

  // 2. Mutation pour créer une classe
  const [createClass] = useMutation(CREATE_CLASS);
  // 3. Mutation pour ajouter un étudiant à une classe
  const [addStudent] = useMutation(ADD_STUDENT_TO_CLASS);

  // 4. État pour créer une nouvelle classe
  const [newClassName, setNewClassName] = useState('');

  // 5. État pour stocker la sélection d’étudiant par classe
  // On utilisera un objet où la clé est l'id de la classe et la valeur l'id de l’étudiant sélectionné
  const [studentSelections, setStudentSelections] = useState({});

  // 6. Récupérer la liste des utilisateurs, et filtrer pour obtenir uniquement les étudiants
  const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_USERS, { client: clientUser });
  const studentList = usersData?.users?.filter(u => u.role === 'student') || [];

  // 7. Fonction pour créer une nouvelle classe
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

  // 8. Fonction pour ajouter un étudiant à une classe (ici par pseudo via son id)
  const handleAddStudent = async (e, classId) => {
    e.preventDefault();
    try {
      const studentId = studentSelections[classId];
      if (!studentId) return;
      await addStudent({ variables: { classId, studentId } });
      // Réinitialiser la sélection pour cette classe
      setStudentSelections(prev => ({ ...prev, [classId]: '' }));
      refetch();
    } catch (err) {
      console.error('Erreur ajout étudiant :', err);
    }
  };

  const handleStudentSelectChange = (classId, studentId) => {
    setStudentSelections(prev => ({ ...prev, [classId]: studentId }));
  };

  if (classesLoading || usersLoading) return <p>Chargement en cours...</p>;
  if (classesError) return <p>Erreur chargement classes: {classesError.message}</p>;
  if (usersError) return <p>Erreur chargement utilisateurs: {usersError.message}</p>;

  return (
    <div className="gestion-container">
      <h1>Gestion des Classes</h1>

      {/* Formulaire de création d'une nouvelle classe */}
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

      {/* Affichage des classes dans une grille sans afficher l'ID */}
      <div className="classes-grid">
        {classesData.classes.map((classe) => (
          <div className="class-card" key={classe.id}>
            <div className="card-content">
              <h2>{classe.name}</h2>
              <p>
                <strong>Étudiants :</strong>{' '}
                {classe.students && classe.students.length > 0
                  ? classe.students.join(', ')
                  : 'Aucun étudiant'}
              </p>
            </div>
            <div className="card-actions">
              <form onSubmit={(e) => handleAddStudent(e, classe.id)} className="add-student-form">
                {/* Menu déroulant pour sélectionner un étudiant par pseudo */}
                <select
                  value={studentSelections[classe.id] || ''}
                  onChange={(e) => handleStudentSelectChange(classe.id, e.target.value)}
                  className="select-field"
                  required
                >
                  <option value="">-- Sélectionner un étudiant --</option>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Le composant GestionClasses est enveloppé avec ApolloProvider utilisant clientClasses
const GestionClasses = () => {
  return (
    <ApolloProvider client={clientClasses}>
      <GestionClassesContent />
    </ApolloProvider>
  );
};

export default GestionClasses;
