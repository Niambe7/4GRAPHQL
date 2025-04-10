// src/apollo/clientClasses.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_CLASS_URL || 'http://localhost:4003/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token'); // Utilisé si besoin d'authentification sur ce microservice
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const clientClasses = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default clientClasses;
