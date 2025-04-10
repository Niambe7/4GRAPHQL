// GestionNotes.js
import React, { useState } from 'react';
import { ApolloProvider, useQuery, useMutation } from '@apollo/client';
import clientNote from '../apollo/clientNote';
import clientClass from '../apollo/clientClasses';
import clientCourse from '../apollo/clientCourse';
import clientUser from '../apollo/clientUser';
import { GET_GRADES, CREATE_GRADE, UPDATE_GRADE, DELETE_GRADE } from '../graphql/noteQueries';
import { GET_CLASSES } from '../graphql/queries';       // Pour récupérer les classes
import { GET_COURSES } from '../graphql/courseQueries';       // Pour récupérer les cours
import { GET_USERS } from '../graphql/userQueries';           // Pour récupérer les utilisateurs
import './GestionNotes.css';

const GestionNotesContent = () => {
  // 1. Récupérer les notes depuis le service note
  const { loading: gradesLoading, error: gradesError, data: gradesData, refetch: refetchGrades } = useQuery(GET_GRADES, { client: clientNote });
  
  // 2. Récupérer les classes depuis le service classe
  const { loading: classesLoading, error: classesError, data: classesData } = useQuery(GET_CLASSES, { client: clientClass });
  
  // 3. État pour le formulaire de création d'une note
  // On stocke ici: classId, courseId, studentId, note
  const [newGrade, setNewGrade] = useState({
    classId: '',
    courseId: '',
    studentId: '',
    grade: '',
  });
  
  // 4. État pour la modification d'une note
  const [editingGradeId, setEditingGradeId] = useState(null);
  const [editedGrade, setEditedGrade] = useState({
    course: '',
    grade: '',
  });

  // 5. État pour le filtre d'affichage (filtrer les notes par classe)
  const [filterClassId, setFilterClassId] = useState('');
  
  // 6. Pour le formulaire, récupérer les cours de la classe sélectionnée
  const { loading: coursesLoading, error: coursesError, data: coursesData } = useQuery(GET_COURSES, {
    client: clientCourse,
    variables: { classId: newGrade.classId ? parseInt(newGrade.classId, 10) : null },
    skip: !newGrade.classId,
  });
  
  // 7. Pour le filtre, récupérer les cours de la classe filtrée
  const { data: filterCoursesData, loading: filterCoursesLoading, error: filterCoursesError } = useQuery(GET_COURSES, {
    client: clientCourse,
    variables: { classId: filterClassId ? parseInt(filterClassId, 10) : null },
    skip: !filterClassId,
  });
  
  // 8. Récupérer les utilisateurs depuis le service user (pour avoir la liste des étudiants)
  const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_USERS, { client: clientUser });
  const studentList = usersData ? usersData.users.filter(u => u.role === 'student') : [];
  
  // 9. Mutations pour les notes (service note)
  const [createGrade] = useMutation(CREATE_GRADE, { client: clientNote });
  const [updateGrade] = useMutation(UPDATE_GRADE, { client: clientNote });
  const [deleteGrade] = useMutation(DELETE_GRADE, { client: clientNote });
  
  // Fonction pour créer une note
  const handleCreateGrade = async (e) => {
    e.preventDefault();
    try {
      // Récupérer le nom du cours à partir des cours chargés pour le formulaire
      let courseName = '';
      if (coursesData && coursesData.courses) {
        const selectedCourse = coursesData.courses.find(c => c.id.toString() === newGrade.courseId);
        if (selectedCourse) {
          courseName = selectedCourse.name;
        }
      }
      await createGrade({
        variables: {
          course: courseName,
          grade: parseFloat(newGrade.grade),
          studentId: newGrade.studentId,
        },
      });
      setNewGrade({ classId: '', courseId: '', studentId: '', grade: '' });
      refetchGrades();
    } catch (err) {
      console.error('Erreur création note:', err);
    }
  };
  
  // Fonction pour mettre à jour une note
  const handleUpdateGrade = async (id) => {
    try {
      await updateGrade({
        variables: {
          id,
          course: editedGrade.course,
          grade: parseFloat(editedGrade.grade),
        },
      });
      setEditingGradeId(null);
      setEditedGrade({ course: '', grade: '' });
      refetchGrades();
    } catch (err) {
      console.error('Erreur mise à jour note:', err);
    }
  };
  
  // Fonction pour supprimer une note
  const handleDeleteGrade = async (id) => {
    try {
      await deleteGrade({ variables: { id } });
      refetchGrades();
    } catch (err) {
      console.error('Erreur suppression note:', err);
    }
  };
  
  // Filtrage du tableau des notes en fonction de la classe sélectionnée dans le filtre
  let filteredGrades = gradesData?.grades || [];
  if (filterClassId && filterCoursesData && filterCoursesData.courses) {
    // Créez un ensemble des noms de cours associés à la classe filtrée
    const courseNamesSet = new Set(filterCoursesData.courses.map(course => course.name));
    filteredGrades = filteredGrades.filter(grade => courseNamesSet.has(grade.course));
  }
  
  if (gradesLoading || classesLoading || coursesLoading || usersLoading || filterCoursesLoading)
    return <p>Chargement des données...</p>;
  if (gradesError) return <p>Erreur : {gradesError.message}</p>;
  if (classesError) return <p>Erreur : {classesError.message}</p>;
  if (coursesError) return <p>Erreur : {coursesError.message}</p>;
  if (usersError) return <p>Erreur : {usersError.message}</p>;
  if (filterCoursesError) return <p>Erreur : {filterCoursesError.message}</p>;
  
  return (
    <div className="gestion-notes-container">
      <h1>Gestion des Notes</h1>
      
      {/* Filtre pour le tableau : Filtrer par classe */}
      
      
      {/* Formulaire pour attribuer une nouvelle note */}
      <div className="notes-actions">
        <h2>Attribuer une Note</h2>
        <form onSubmit={handleCreateGrade} className="create-grade-form">
          {/* Sélection de la classe pour la note */}
          <select
            value={newGrade.classId}
            onChange={(e) => {
              setNewGrade({ ...newGrade, classId: e.target.value, courseId: '' });
            }}
            required
            className="select-field"
          >
            <option value="">-- Choisir une classe --</option>
            {classesData.classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
          
          {/* Sélection du cours correspondant à la classe */}
          <select
            value={newGrade.courseId}
            onChange={(e) => setNewGrade({ ...newGrade, courseId: e.target.value })}
            disabled={!newGrade.classId}
            required
            className="select-field"
          >
            <option value="">-- Choisir un cours --</option>
            {coursesData && coursesData.courses && coursesData.courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
          
          {/* Sélection de l'étudiant */}
          <select
            value={newGrade.studentId}
            onChange={(e) => setNewGrade({ ...newGrade, studentId: e.target.value })}
            required
            className="select-field"
          >
            <option value="">-- Choisir un étudiant --</option>
            {studentList.map(student => (
              <option key={student.id} value={student.id}>{student.pseudo}</option>
            ))}
          </select>
          
          {/* Champ de saisie de la note (placé en dernier) */}
          <input
            type="number"
            step="0.1"
            placeholder="Note"
            value={newGrade.grade}
            onChange={(e) => setNewGrade({ ...newGrade, grade: e.target.value })}
            required
          />
          
          <button type="submit" className="btn-action">Attribuer la Note</button>
        </form>
      </div>

      <div className="filter-section">
        <label htmlFor="filterClass">Filtrer par Classe:</label>
        <select
          id="filterClass"
          value={filterClassId}
          onChange={(e) => setFilterClassId(e.target.value)}
          className="select-field"
        >
          <option value="">-- Toutes les classes --</option>
          {classesData.classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>
      
      {/* Tableau listant les notes filtrées */}
      <table className="notes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cours</th>
            <th>Note</th>
            <th>ID Étudiant</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredGrades.map((grade) => (
            <tr key={grade.id}>
              <td>{grade.id}</td>
              <td>
                {editingGradeId === grade.id ? (
                  <input
                    type="text"
                    value={editedGrade.course}
                    onChange={(e) =>
                      setEditedGrade({ ...editedGrade, course: e.target.value })
                    }
                  />
                ) : (
                  grade.course
                )}
              </td>
              <td>
                {editingGradeId === grade.id ? (
                  <input
                    type="number"
                    step="0.1"
                    value={editedGrade.grade}
                    onChange={(e) =>
                      setEditedGrade({ ...editedGrade, grade: e.target.value })
                    }
                  />
                ) : (
                  grade.grade
                )}
              </td>
              <td>{grade.studentId}</td>
              <td>
                {editingGradeId === grade.id ? (
                  <>
                    <button onClick={() => handleUpdateGrade(grade.id)} className="btn-secondary">Valider</button>
                    <button onClick={() => setEditingGradeId(null)} className="btn-danger">Annuler</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingGradeId(grade.id);
                        setEditedGrade({
                          course: grade.course,
                          grade: grade.grade.toString(),
                        });
                      }}
                      className="btn-secondary"
                    >
                      Modifier
                    </button>
                    <button onClick={() => handleDeleteGrade(grade.id)} className="btn-danger">Supprimer</button>
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

const GestionNotes = () => {
  return (
    <ApolloProvider client={clientNote}>
      <GestionNotesContent />
    </ApolloProvider>
  );
};

export default GestionNotes;
