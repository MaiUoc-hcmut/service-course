const { sequelize } = require('../../config/db');
import { Model, DataTypes } from 'sequelize';

class CourseDraft extends Model {}

CourseDraft.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  url: {
    type: DataTypes.TEXT
  },
  topic_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  chapter_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  id_course: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  id_topic: {
    type: DataTypes.UUID,
  },
  id_document: {
    type: DataTypes.UUID
  },
  type: {
    type: DataTypes.STRING(20),
  },
  duration: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize,
  tableName: 'course-draft',
});

module.exports = CourseDraft;