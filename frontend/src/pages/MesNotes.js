// src/pages/MesNotes.js
import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import clientNote from '../apollo/clientNote';
// Supposez que GET_STUDENT_GRADES est une requête qui prend studentId en variable
import { GET_STUDENT_GRADES } from '../graphql/noteQueries';
import { AuthContext } from '../context/AuthContext';
import './MesNotes.css';

const MesNotes = () => {
  // Récupérer l'ID de l'utilisateur depuis le contexte (où user.id correspond à l'étudiant)
  const { user } = useContext(AuthContext);
  console.log("User connecté dans MesNotes:", user);

  // Requête pour récupérer les notes de l'étudiant
  const { loading, error, data } = useQuery(GET_STUDENT_GRADES, {
    client: clientNote,
    variables: { studentId: user?.id },
    skip: !user?.id, // on saute la requête si l'user.id n'est pas défini
  });

  if (!user || user.role !== 'student') {
    return <p>Vous devez être connecté en tant qu'étudiant pour voir vos notes.</p>;
  }

  if (loading) return <p>Chargement de vos notes...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  // data.studentGrades (ou data.grades si vous avez nommé la query différemment)
  const notes = data?.gradesByStudent || []; // ou data?.studentGrades

  console.log("Notes récupérées :", data?.gradesByStudent);

  return (
    <div className="mes-notes-container">
      <h1>Mes Notes</h1>
      <div className="notes-grid">
        {notes.map((note) => (
          <div className="note-card" key={note.id}>
            <h2>{note.course}</h2>
            <p className="note-value">Note : {note.grade}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MesNotes;
