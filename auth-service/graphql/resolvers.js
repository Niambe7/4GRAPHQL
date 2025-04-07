// src/graphql/resolvers.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }
      return user;
    }
  },
  Mutation: {
    login: async (_, { email, password }) => {
      // Recherche de l'utilisateur par email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error("User not found");
      }
      // Comparaison du mot de passe
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error("Incorrect password");
      }
      // Génération du token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, pseudo: user.pseudo, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      return { token, user };
    }
  }
};

module.exports = resolvers;
