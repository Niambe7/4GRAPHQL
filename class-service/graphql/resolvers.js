// src/graphql/resolvers.js
const { Op } = require('sequelize');
const Class = require('../models/Class');
const ClassStudent = require('../models/ClassStudent');

const resolvers = {
  Query: {
    classes: async (_, { sortByName }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const order = sortByName ? [['name', 'ASC']] : undefined;
      return await Class.findAll({ order });
    },
    class: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await Class.findByPk(id);
    },
    classGrades: async (_, { classId }, { user }) => {
      if (!user || user.role !== "professor") throw new Error("Not authorized");
      return {
        median: 15.0,
        min: 10.0,
        max: 18.0
      };
    },
    // Nouveau resolver pour récupérer la liste des associations classe/étudiant
    classStudents: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await ClassStudent.findAll();
    }
  },
  Mutation: {
    createClass: async (_, { name }, { user }) => {
      if (!user || user.role !== "professor") throw new Error("Not authorized");
      const newClass = await Class.create({ name });
      return newClass;
    },
    updateClass: async (_, { id, name }, { user }) => {
      if (!user || user.role !== "professor") throw new Error("Not authorized");
      const cls = await Class.findByPk(id);
      if (!cls) throw new Error("Class not found");
      if (name !== undefined) cls.name = name;
      await cls.save();
      return cls;
    },
    deleteClass: async (_, { id }, { user }) => {
      if (!user || user.role !== "professor") throw new Error("Not authorized");
      const associated = await ClassStudent.findOne({ where: { classId: id } });
      if (associated) {
        throw new Error("Cannot delete class with enrolled students");
      }
      const deletedCount = await Class.destroy({ where: { id } });
      return deletedCount > 0;
    },
    addStudentToClass: async (_, { classId, studentId }, { user }) => {
      if (!user || user.role !== "professor") throw new Error("Not authorized");
      await ClassStudent.findOrCreate({
        where: { classId, studentId },
        defaults: { classId, studentId }
      });
      return await Class.findByPk(classId);
    },
    removeStudentFromClass: async (_, { classId, studentId }, { user }) => {
      if (!user || user.role !== "professor") throw new Error("Not authorized");
      // Supprimer l'association entre la classe et l'étudiant
      const deletedCount = await ClassStudent.destroy({
        where: { classId, studentId }
      });
      if (deletedCount === 0) {
        throw new Error("Aucun étudiant trouvé dans cette classe pour cet ID");
      }
      return await Class.findByPk(classId);
    }
  },
  Class: {
    students: async (parent) => {
      // Récupérer toutes les associations pour cette classe et retourner uniquement les studentId
      const associations = await ClassStudent.findAll({ where: { classId: parent.id } });
      return associations.map(a => a.studentId);
    }
  }
};

module.exports = resolvers;
