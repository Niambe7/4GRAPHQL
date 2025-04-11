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

export const DELETE_CLASS = gql`
  mutation DeleteClass($id: ID!) {
    deleteClass(id: $id)
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

export const REMOVE_STUDENT_FROM_CLASS = gql`
  mutation RemoveStudentFromClass($classId: ID!, $studentId: ID!) {
    removeStudentFromClass(classId: $classId, studentId: $studentId) {
      id
      name
      students
    }
  }
`;


export const GET_CLASS_STUDENTS = gql`
  query GetClassStudents {
    classStudents {
      classId
      studentId
    }
  }
`;