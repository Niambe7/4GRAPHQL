// src/config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,       // Nom de la base, par exemple "schoolinc_course"
  process.env.DB_USER,       // Nom d'utilisateur
  process.env.DB_PASSWORD,   // Mot de passe
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = sequelize;
