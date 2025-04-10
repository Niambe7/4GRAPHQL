// src/apollo/clientCourse.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Lit la variable d'env REACT_APP_GRAPHQL_COURSE_URL ou utilise http://localhost:4004/graphql
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_COURSE_URL || 'http://localhost:4004/graphql',
});

// Ajoute un header Authorization si besoin (token)
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const clientCourse = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default clientCourse;
