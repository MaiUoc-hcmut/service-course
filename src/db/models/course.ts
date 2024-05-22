
const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';
const Chapter = require('./chapter');
const Topic = require('./topic');
const Category = require('./category');

class Course extends Model {
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Course.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    id_teacher: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      allowNull: false,
    },
    goal: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    object: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    requirement: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    thumbnail: DataTypes.STRING,
    cover_image: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "public",
    },
    total_lecture: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    total_exam: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    total_chapter: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_duration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    average_rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    total_review: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    registration: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'course',
    sequelize,
  },
);
Course.hasMany(Chapter, { foreignKey: "id_course", as: "chapters" })
Chapter.belongsTo(Course, {
  foreignKey: "id_course",
});


Chapter.hasMany(Topic, { foreignKey: "id_chapter", as: "topics" })
Topic.belongsTo(Chapter, {
  foreignKey: "id_chapter"
});

Course.belongsToMany(Category, { 
  through: 'category-course',
  foreignKey: 'id_course',
  otherKey: 'id_category'
});
Category.belongsToMany(Course, { 
  through: 'categoty-course',
  foreignKey: 'id_category',
  otherKey: 'id_course'
});

module.exports = Course
