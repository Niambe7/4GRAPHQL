// src/graphql/userQueries.js
import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      pseudo
      role
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($email: String!, $pseudo: String!, $password: String!, $role: String) {
    register(email: $email, pseudo: $pseudo, password: $password, role: $role) {
      id
      email
      pseudo
      role
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $email: String, $pseudo: String, $password: String) {
    updateUser(id: $id, email: $email, pseudo: $pseudo, password: $password) {
      id
      email
      pseudo
      role
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
