// src/index.js
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const sequelize = require('./config/database');
const Course = require('./models/Course'); // Pour s'assurer que le modèle est chargé

const app = express();
const PORT = process.env.PORT || 4004; // Par exemple, utilisez le port 4004 pour le service cours

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  // Synchronisation avec la base de données
  sequelize.sync()
    .then(() => {
      console.log("Base de données synchronisée pour course-service.");
      app.listen(PORT, () => {
        console.log(`Course-service est en cours d'exécution sur http://localhost:${PORT}${server.graphqlPath}`);
      });
    })
    .catch(err => {
      console.error("Erreur de synchronisation de la base :", err);
    });
}

startServer();
