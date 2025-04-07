// schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    pseudo: String!
    role: String!
  }

  type Query {
    user(id: ID!): User
    users: [User]
  }

  type Mutation {
    register(email: String!, pseudo: String!, password: String!, role: String): User
    updateUser(id: ID!, email: String, pseudo: String, password: String): User
    deleteUser(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
