// src/graphql/schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Class {
    id: ID!
    name: String!
    # Pour simplifier, on retourne la liste des IDs des étudiants inscrits
    students: [Int]
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
  }

  type Mutation {
    createClass(name: String!): Class
    updateClass(id: ID!, name: String): Class
    deleteClass(id: ID!): Boolean
    addStudentToClass(classId: ID!, studentId: ID!): Class
  }
`;

module.exports = typeDefs;
