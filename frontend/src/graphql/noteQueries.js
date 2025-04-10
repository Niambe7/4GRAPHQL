// src/graphql/noteQueries.js
import { gql } from '@apollo/client';

export const GET_GRADES = gql`
  query GetGrades {
    grades {
      id
      course
      grade
      studentId
    }
  }
`;

export const CREATE_GRADE = gql`
  mutation CreateGrade($course: String!, $grade: Float!, $studentId: ID!) {
    createGrade(course: $course, grade: $grade, studentId: $studentId) {
      id
      course
      grade
      studentId
    }
  }
`;

export const UPDATE_GRADE = gql`
  mutation UpdateGrade($id: ID!, $course: String, $grade: Float) {
    updateGrade(id: $id, course: $course, grade: $grade) {
      id
      course
      grade
      studentId
    }
  }
`;

export const DELETE_GRADE = gql`
  mutation DeleteGrade($id: ID!) {
    deleteGrade(id: $id)
  }
`;

export const GET_STUDENT_GRADES = gql`
  query GetStudentGrades($studentId: ID!) {
    gradesByStudent(studentId: $studentId) {
      id
      course
      grade
      studentId
    }
  }
`;
