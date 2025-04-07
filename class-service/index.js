// src/index.js
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const sequelize = require('./config/database');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();
const PORT = process.env.PORT || 4003;

// Fonction pour extraire l'utilisateur depuis le token
const getUserFromToken = (token) => {
  try {
    if (token) {
      return jwt.verify(token, process.env.JWT_SECRET);
    }
    return null;
  } catch (err) {
    return null;
  }
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      const user = getUserFromToken(token.replace("Bearer ", ""));
      return { user };
    },
  });
  await server.start();
  server.applyMiddleware({ app });

  // Synchronisation de la base de données et démarrage du serveur
  sequelize.sync()
    .then(() => {
      console.log("Database synced for class-service.");
      app.listen(PORT, () => {
        console.log(`Class-service running at http://localhost:${PORT}${server.graphqlPath}`);
      });
    })
    .catch(err => {
      console.error("Database sync error:", err);
    });
}

startServer();
