// src/graphql/resolvers.js
const { Op } = require('sequelize');
const Grade = require('../models/Grade');

const resolvers = {
  Query: {
    // Query pour récupérer les notes. Pour un utilisateur non professeur, seules ses notes sont retournées.
    grades: async (_, { courses }, { user }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }
      const whereClause = {};
      // Si l'utilisateur n'est pas professeur, on compare les identifiants sous forme de nombre
      if (user.role !== "professor") {
        whereClause.studentId = Number(user.id);
      }
      if (courses && courses.length > 0) {
        whereClause.course = { [Op.in]: courses };
      }
      const grades = await Grade.findAll({ where: whereClause });
      return grades;
    },
    
    // Query pour récupérer les notes pour un étudiant donné
    gradesByStudent: async (_, { studentId }, { user }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }
      // Si l'utilisateur n'est pas professeur, il ne peut accéder qu'à ses propres notes (conversion via Number())
      if (user.role !== "professor" && Number(user.id) !== Number(studentId)) {
        throw new Error("Not authorized");
      }
      const grades = await Grade.findAll({ where: { studentId: Number(studentId) } });
      return grades;
    }
  },
  Mutation: {
    createGrade: async (_, { course, grade, studentId }, { user }) => {
      if (!user || user.role !== "professor") {
        throw new Error("Not authorized");
      }
      const newGrade = await Grade.create({
        course,
        grade,
        studentId: Number(studentId),
      });
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
