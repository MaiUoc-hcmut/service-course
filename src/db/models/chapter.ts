
const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';

class Chapter extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Chapter.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        id_course: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        order: DataTypes.INTEGER.UNSIGNED,
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "public",
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
        tableName: 'chapter',
        sequelize,
    },
);


module.exports = Chapter
