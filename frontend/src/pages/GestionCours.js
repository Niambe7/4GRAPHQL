// src/pages/GestionCours.jsx
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

// Import des requêtes pour les cours
import { GET_COURSES, CREATE_COURSE, UPDATE_COURSE, DELETE_COURSE } from '../graphql/courseQueries';
// Import de la query pour récupérer les classes
import { GET_CLASSES } from '../graphql/queries';

// Import des clients Apollo dédiés
import clientCourse from '../apollo/clientCourse';
import clientClasses from '../apollo/clientClasses';

import './GestionCours.css';

const GestionCours = () => {
  // État pour la création d'un nouveau cours
  const [newCourse, setNewCourse] = useState({ name: '', classId: '' });
  // État pour la modification d'un cours existant
  const [editCourse, setEditCourse] = useState(null);
  // Contrôle d'affichage de la modale d'édition
  const [showModal, setShowModal] = useState(false);
  // État pour le filtre de cours par classe (vide = tous)
  const [selectedFilter, setSelectedFilter] = useState('');

  // Récupération des cours avec clientCourse
  const {
    loading: loadingCourses,
    error: errorCourses,
    data: dataCourses,
    refetch: refetchCourses
  } = useQuery(GET_COURSES, { client: clientCourse });

  // Récupération des classes avec clientClasses
  const {
    loading: loadingClasses,
    error: errorClasses,
    data: dataClasses,
    refetch: refetchClasses
  } = useQuery(GET_CLASSES, { client: clientClasses });

  // Mutations pour les cours avec le client approprié
  const [createCourse] = useMutation(CREATE_COURSE, { client: clientCourse });
  const [updateCourse] = useMutation(UPDATE_COURSE, { client: clientCourse });
  const [deleteCourse] = useMutation(DELETE_COURSE, { client: clientCourse });

  // Gestion du changement des champs du formulaire de création
  const handleNewCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  // Création d'un nouveau cours
  const handleCreate = async () => {
    try {
      await createCourse({
        variables: {
          name: newCourse.name,
          classId: parseInt(newCourse.classId, 10)
        }
      });
      setNewCourse({ name: '', classId: '' });
      refetchCourses();
    } catch (error) {
      console.error('Erreur lors de la création :', error);
    }
  };

  // Ouvrir la modale d'édition pour un cours donné
  const handleEdit = (course) => {
    setEditCourse(course);
    setShowModal(true);
  };

  // Gestion du changement dans le formulaire d'édition
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCourse({ ...editCourse, [name]: value });
  };

  // Mise à jour d'un cours existant
  const handleUpdate = async () => {
    try {
      await updateCourse({
        variables: {
          id: editCourse.id,
          name: editCourse.name,
          classId: parseInt(editCourse.classId, 10)
        }
      });
      setShowModal(false);
      setEditCourse(null);
      refetchCourses();
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
    }
  };

  // Suppression d'un cours
  const handleDelete = async (id) => {
    try {
      await deleteCourse({
        variables: { id }
      });
      refetchCourses();
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  // Gestion du filtre : applique ou retire le filtre en fonction du bouton cliqué
  const handleFilterClick = (classId) => {
    setSelectedFilter(classId);
  };

  if (loadingCourses || loadingClasses) {
    return <div className="container"><p>Chargement...</p></div>;
  }
  if (errorCourses) {
    return <div className="container"><p>Erreur (cours) : {errorCourses.message}</p></div>;
  }
  if (errorClasses) {
    return <div className="container"><p>Erreur (classes) : {errorClasses.message}</p></div>;
  }

  // Filtrer les cours en fonction du filtre choisi (si aucun filtre, afficher tous)
  const filteredCourses = dataCourses.courses.filter(course =>
    selectedFilter === '' ? true : Number(course.classId) === Number(selectedFilter)
  );

  return (
    <div className="container">
      <h1 className="header">Gestion des Cours</h1>

      {/* Formulaire de création */}
      <div className="form-section">
        <h2>Créer un nouveau cours</h2>
        <input
          type="text"
          placeholder="Nom du cours"
          name="name"
          value={newCourse.name}
          onChange={handleNewCourseChange}
        />
        <select name="classId" value={newCourse.classId} onChange={handleNewCourseChange}>
          <option value="">Choisir une classe</option>
          {dataClasses.classes.map((classe) => (
            <option key={classe.id} value={classe.id}>
              {classe.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreate}>Ajouter</button>
      </div>

      {/* Filtre par classe (boutons) */}
      <div className="filter-section">
        <button
          className={`filter-button ${selectedFilter === '' ? 'active' : ''}`}
          onClick={() => handleFilterClick('')}
        >
          Tous
        </button>
        {dataClasses.classes.map((classe) => (
          <button
            key={classe.id}
            className={`filter-button ${Number(selectedFilter) === Number(classe.id) ? 'active' : ''}`}
            onClick={() => handleFilterClick(classe.id)}
          >
            {classe.name}
          </button>
        ))}
      </div>

      {/* Tableau des cours */}
      <table className="table-container">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom du cours</th>
            <th>Classe</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course) => {
            // Recherche du nom de la classe correspondant à l'ID associé au cours
            const classeAssociee = dataClasses.classes.find(c => Number(c.id) === Number(course.classId));
            const className = classeAssociee ? classeAssociee.name : 'N/A';
            return (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{className}</td>
                <td className="action-buttons">
                  <button className="edit-button" onClick={() => handleEdit(course)}>
                    Modifier
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(course.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Fenêtre modale pour modification */}
      {showModal && editCourse && (
        <div className="modal">
          <div className="modal-content">
            <h2>Modifier le cours</h2>
            <input
              type="text"
              placeholder="Nom du cours"
              name="name"
              value={editCourse.name}
              onChange={handleEditChange}
            />
            <select name="classId" value={editCourse.classId} onChange={handleEditChange}>
              <option value="">Choisir une classe</option>
              {dataClasses.classes.map((classe) => (
                <option key={classe.id} value={classe.id}>
                  {classe.name}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button className="cancel" onClick={() => setShowModal(false)}>
                Annuler
              </button>
              <button className="save" onClick={handleUpdate}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCours;
