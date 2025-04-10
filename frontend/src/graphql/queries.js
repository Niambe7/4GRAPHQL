// Dans GestionClasses.js (ou dans un fichier séparé, ex: src/graphql/queries.js)
import { gql } from '@apollo/client';

export const GET_CLASSES = gql`
  query GetClasses($sortByName: Boolean) {
    classes(sortByName: $sortByName) {
      id
      name
      students
    }
  }
`;

export const CREATE_CLASS = gql`
  mutation CreateClass($name: String!) {
    createClass(name: $name) {
      id
      name
      students
    }
  }
`;

export const ADD_STUDENT_TO_CLASS = gql`
  mutation AddStudentToClass($classId: ID!, $studentId: ID!) {
    addStudentToClass(classId: $classId, studentId: $studentId) {
      id
      name
      students
    }
  }
`;
