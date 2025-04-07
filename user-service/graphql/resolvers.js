// resolvers.js
const bcrypt = require('bcrypt');
const User = require('../models/User');

const resolvers = {
  Query: {
    user: async (_, { id }) => {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      return user;
    },
    users: async () => {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      });
      return users;
    }
  },
  Mutation: {
    register: async (_, { email, pseudo, password, role }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        pseudo,
        password: hashedPassword,
        role: role || 'student'
      });
      return user;
    },
    updateUser: async (_, { id, email, pseudo, password }) => {
      // Dans une application réelle, il faut vérifier que l'utilisateur authentifié correspond bien à celui qui effectue la modification
      const updateData = {};
      if (email) updateData.email = email;
      if (pseudo) updateData.pseudo = pseudo;
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
      await User.update(updateData, { where: { id } });
      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      return updatedUser;
    },
    deleteUser: async (_, { id }) => {
      // Vérification de l'utilisateur authentifié à implémenter pour la sécurité
      const deleted = await User.destroy({ where: { id } });
      return deleted ? true : false;
    }
  }
};

module.exports = resolvers;
