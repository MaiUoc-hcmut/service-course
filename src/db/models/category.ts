const { sequelize } = require('../../config/db');
import { Model, DataTypes } from 'sequelize';

class Category extends Model {}

Category.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        id_par_category: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    }, {
        tableName: 'category',
        freezeTableName: true,
        sequelize
    }
)

module.exports = Category;