const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';
const Chapter = require('./chapter');
const Topic = require('./topic');
const Category = require('./category');

class TopicForum extends Model {
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TopicForum.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    id_forum: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    id_user: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    role: {
        type: DataTypes.UUID,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(600),
        allowNull: false,
    },
    file: {
        type: DataTypes.TEXT,
    },
    total_answer: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
}, {
    tableName: 'topicforum',
    sequelize
});

module.exports = TopicForum;