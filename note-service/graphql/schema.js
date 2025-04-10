// src/graphql/schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Grade {
    id: ID!
    course: String!
    grade: Float!
    studentId: ID!
  }

  type Query {
    # Retourne les notes. Si l'argument "courses" est fourni, on filtre par les cours indiqués.
    grades(courses: [String]): [Grade]
    
    # Retourne les notes pour un étudiant donné
    gradesByStudent(studentId: ID!): [Grade]
  }

  type Mutation {
    # Seul un professeur peut créer une note
    createGrade(course: String!, grade: Float!, studentId: ID!): Grade

    # Seul un professeur peut modifier une note
    updateGrade(id: ID!, course: String, grade: Float): Grade

    # Seul un professeur peut supprimer une note
    deleteGrade(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
