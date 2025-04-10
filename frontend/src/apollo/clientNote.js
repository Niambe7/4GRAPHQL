// src/apollo/clientNote.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  // Utilise la variable d'environnement ou la valeur par défaut si non définie
  uri: process.env.REACT_APP_GRAPHQL_NOTE_URL || 'http://localhost:4002/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Récupère le token si nécessaire
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const clientNote = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default clientNote;
