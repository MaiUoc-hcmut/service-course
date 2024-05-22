const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional, UUID } from 'sequelize';

class Answer extends Model {
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Answer.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    id_topic_forum: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    id_parent: {
        type: DataTypes.UUID,
    },
    id_user: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING(600),
        allowNull: false,
    },
    file: {
        type: DataTypes.TEXT,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "student",
    }
}, {
    tableName: 'answer',
    sequelize
});

Answer.hasMany(Answer, {
    as: 'replies',
    foreignKey: 'id_parent',
    sourceKey: 'id'
});

module.exports = Answer;