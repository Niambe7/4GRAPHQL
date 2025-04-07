// src/models/Grade.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Grade = sequelize.define('Grade', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  course: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grade: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Grade;
