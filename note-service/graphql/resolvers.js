// src/graphql/resolvers.js
const { Op } = require('sequelize');
const Grade = require('../models/Grade');

const resolvers = {
  Query: {
    grades: async (_, { courses }, { user }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }
      // Pour les étudiants, ne retourner que leurs propres notes
      const whereClause = {};
      if (user.role !== "professor") {
        whereClause.studentId = user.id;
      }
      // Si on spécifie un ou plusieurs cours, filtrer par ceux-ci
      if (courses && courses.length > 0) {
        whereClause.course = { [Op.in]: courses };
      }
      const grades = await Grade.findAll({ where: whereClause });
      return grades;
    }
  },
  Mutation: {
    createGrade: async (_, { course, grade, studentId }, { user }) => {
      if (!user || user.role !== "professor") {
        throw new Error("Not authorized");
      }
      const newGrade = await Grade.create({ course, grade, studentId });
      return newGrade;
    },
    updateGrade: async (_, { id, course, grade }, { user }) => {
      if (!user || user.role !== "professor") {
        throw new Error("Not authorized");
      }
      const gradeToUpdate = await Grade.findByPk(id);
      if (!gradeToUpdate) {
        throw new Error("Grade not found");
      }
      if (course !== undefined) gradeToUpdate.course = course;
      if (grade !== undefined) gradeToUpdate.grade = grade;
      await gradeToUpdate.save();
      return gradeToUpdate;
    },
    deleteGrade: async (_, { id }, { user }) => {
      if (!user || user.role !== "professor") {
        throw new Error("Not authorized");
      }
      const deletedCount = await Grade.destroy({ where: { id } });
      return deletedCount > 0;
    }
  }
};

module.exports = resolvers;
