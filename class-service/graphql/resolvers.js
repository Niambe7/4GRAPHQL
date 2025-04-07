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
      // Pour simplifier, nous renvoyons des valeurs simulées.
      // En pratique, il faudrait agréger les notes depuis le note-service.
      return {
        median: 15.0,
        min: 10.0,
        max: 18.0
      };
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
      // Vérifier qu'aucun étudiant n'est inscrit dans cette classe
      const associated = await ClassStudent.findOne({ where: { classId: id } });
      if (associated) {
        throw new Error("Cannot delete class with enrolled students");
      }
      const deletedCount = await Class.destroy({ where: { id } });
      return deletedCount > 0;
    },
    addStudentToClass: async (_, { classId, studentId }, { user }) => {
      if (!user || user.role !== "professor") throw new Error("Not authorized");
      // Ajout de l'étudiant s'il n'est pas déjà associé à la classe
      await ClassStudent.findOrCreate({
        where: { classId, studentId },
        defaults: { classId, studentId }
      });
      // Optionnel : retourner la classe mise à jour
      return await Class.findByPk(classId);
    }
  },
  // Pour le champ "students" du type Class, on peut définir un resolver pour retourner
  // la liste des IDs des étudiants inscrits :
  Class: {
    students: async (parent) => {
      const associations = await ClassStudent.findAll({ where: { classId: parent.id } });
      return associations.map(a => a.studentId);
    }
  }
};

module.exports = resolvers;
