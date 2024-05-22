
const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';

const Comment = require('./comment');

class Topic extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Topic.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        id_chapter: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        id_exam: DataTypes.UUID,
        video: {
            type: DataTypes.TEXT,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        duration: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        order: DataTypes.INTEGER.UNSIGNED,
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "public",
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: 'lecture',
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
        tableName: 'topic',
        sequelize,
    },
);

Comment.belongsTo(Topic, { foreignKey: "id_topic" });
Topic.hasMany(Comment, { foreignKey: "id_topic", as: "topics" })


module.exports = Topic;
