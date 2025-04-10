// src/graphql/schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Course {
    id: ID!
    name: String!
    classId: Int!
  }

  type Query {
    # Liste tous les cours, optionnellement filtrés par classId
    courses(classId: Int): [Course]
    # Obtenir un cours spécifique par id
    course(id: ID!): Course
  }

  type Mutation {
    # Créer un nouveau cours et l'associer à une classe
    createCourse(name: String!, classId: Int!): Course
    # Mettre à jour un cours (on peut modifier le nom ou la classe)
    updateCourse(id: ID!, name: String, classId: Int): Course
    # Supprimer un cours
    deleteCourse(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
