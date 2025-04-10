// src/graphql/resolvers.js
const Course = require('../models/Course');

const resolvers = {
  Query: {
    // Si classId est fourni, on retourne seulement les cours correspondants
    courses: async (_, { classId }) => {
      const whereClause = classId ? { classId } : {};
      return await Course.findAll({ where: whereClause });
    },
    course: async (_, { id }) => {
      return await Course.findByPk(id);
    },
  },
  Mutation: {
    createCourse: async (_, { name, classId }) => {
      return await Course.create({ name, classId });
    },
    updateCourse: async (_, { id, name, classId }) => {
      const course = await Course.findByPk(id);
      if (!course) {
        throw new Error('Course not found');
      }
      if (name !== undefined) course.name = name;
      if (classId !== undefined) course.classId = classId;
      await course.save();
      return course;
    },
    deleteCourse: async (_, { id }) => {
      const deleted = await Course.destroy({ where: { id } });
      return deleted > 0;
    },
  },
};

module.exports = resolvers;
