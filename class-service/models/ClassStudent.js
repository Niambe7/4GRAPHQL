// src/models/ClassStudent.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClassStudent = sequelize.define('ClassStudent', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = ClassStudent;
