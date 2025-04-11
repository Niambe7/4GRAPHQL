// src/graphql/schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Class {
    id: ID!
    name: String!
    # Retourne la liste des IDs des étudiants inscrits à la classe
    students: [Int]
  }

  type ClassStudent {
    classId: ID!
    studentId: ID!
  }

  type GradeStats {
    median: Float!
    min: Float!
    max: Float!
  }

  type Query {
    classes(sortByName: Boolean): [Class]
    class(id: ID!): Class
    classGrades(classId: ID!): GradeStats
    # Nouvelle query pour récupérer toutes les associations classe/étudiant
    classStudents: [ClassStudent]
  }

  type Mutation {
    createClass(name: String!): Class
    updateClass(id: ID!, name: String): Class
    deleteClass(id: ID!): Boolean
    addStudentToClass(classId: ID!, studentId: ID!): Class
    removeStudentFromClass(classId: ID!, studentId: ID!): Class
  }
`;

module.exports = typeDefs;
