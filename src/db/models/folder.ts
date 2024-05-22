const { sequelize } = require('../../config/db');
import { Model, DataTypes } from 'sequelize';

class Folder extends Model {}

Folder.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        parent_folder_id: {
            type: DataTypes.UUID,
        },
        id_teacher: {
            type: DataTypes.UUID,
        },
        name: {
            type: DataTypes.STRING(100)
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
        tableName: 'folder',
        freezeTableName: true,
        sequelize
    }
);

module.exports = Folder;