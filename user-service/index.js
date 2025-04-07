// index.js
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const sequelize = require('./config/database');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();
const PORT = process.env.PORT || 4000;

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  // Synchronisation automatique des modèles avec la base de données
  sequelize.sync()
    .then(() => {
      console.log('Base de données synchronisée pour le user-service.');
      app.listen(PORT, () => {
        console.log(`User-service démarré sur http://localhost:${PORT}${server.graphqlPath}`);
      });
    })
    .catch(err => {
      console.error('Erreur de synchronisation de la base de données:', err);
    });
}

startServer();
