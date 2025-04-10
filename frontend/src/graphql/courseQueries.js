// src/graphql/courseQueries.js
import { gql } from '@apollo/client';

// Récupère la liste de cours, avec un filtre optionnel sur la classe
export const GET_COURSES = gql`
  query GetCourses($classId: Int) {
    courses(classId: $classId) {
      id
      name
      classId
    }
  }
`;

// Récupère un seul cours par ID
export const GET_COURSE = gql`
  query GetCourse($id: ID!) {
    course(id: $id) {
      id
      name
      classId
    }
  }
`;

// Crée un cours en fournissant un nom et un ID de classe
export const CREATE_COURSE = gql`
  mutation CreateCourse($name: String!, $classId: Int!) {
    createCourse(name: $name, classId: $classId) {
      id
      name
      classId
    }
  }
`;

// Met à jour un cours existant
export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $name: String, $classId: Int) {
    updateCourse(id: $id, name: $name, classId: $classId) {
      id
      name
      classId
    }
  }
`;

// Supprime un cours
export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;
