// src/pages/MesCours.js
import React, { useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import clientClass from '../apollo/clientClasses';
import clientCourse from '../apollo/clientCourse';
import { GET_CLASSES } from '../graphql/queries';
import { GET_COURSES } from '../graphql/courseQueries';
import { AuthContext } from '../context/AuthContext';
import './MesCours.css';

const MesCours = () => {
  // Récupération de l'utilisateur connecté via AuthContext
  const { user } = useContext(AuthContext);

  // On initialise l'ID de la classe à partir de user.classId, s'il existe
  const [selectedClassId, setSelectedClassId] = useState(user?.classId || '');

  // Requête pour récupérer la liste de toutes les classes (clientClass)
  const { loading: classesLoading, error: classesError, data: classesData } = useQuery(GET_CLASSES, {
    client: clientClass,
  });

  // Requête pour récupérer les cours associés à la classe sélectionnée (clientCourse)
  const { loading: coursesLoading, error: coursesError, data: coursesData } = useQuery(GET_COURSES, {
    client: clientCourse,
    variables: { classId: selectedClassId ? Number(selectedClassId) : null },
    skip: !selectedClassId,
  });

  // Si l'utilisateur n'est pas connecté
  if (!user) {
    return <p>Vous devez être connecté pour consulter vos cours.</p>;
  }

  // Optionnel : vous pouvez afficher un message ou choisir manuellement une classe si user.classId n'est pas défini
  const renderSelectClass = () => {
    return (
      <div className="select-class-container">
        <p>Vous n'avez pas de classe associée. Veuillez sélectionner une classe :</p>
        {classesLoading ? (
          <p>Chargement des classes...</p>
        ) : classesError ? (
          <p>Erreur: {classesError.message}</p>
        ) : (
          <select
            className="select-field"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="">-- Choisir une classe --</option>
            {classesData?.classes?.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  return (
    <div className="mes-cours-container">
      <h1>Mes Cours</h1>
      
      {/* Si l'utilisateur n'a pas de classId dans son profil, affiche un select pour choisir une classe */}
      {!selectedClassId ? renderSelectClass() : null}
      
      {selectedClassId && (
        <>
          {coursesLoading ? (
            <p>Chargement des cours...</p>
          ) : coursesError ? (
            <p>Erreur: {coursesError.message}</p>
          ) : coursesData && coursesData.courses.length === 0 ? (
            <p>Aucun cours trouvé pour la classe sélectionnée.</p>
          ) : (
            <div className="cours-grid">
              {coursesData?.courses?.map((course) => (
                <div className="cours-card" key={course.id}>
                  <h2>{course.name}</h2>
                  <p>Classe : {course.classId}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MesCours;
