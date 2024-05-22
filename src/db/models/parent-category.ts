const { sequelize } = require('../../config/db');
import { Model, DataTypes } from 'sequelize';

const Category = require('./category');

class ParentCategory extends Model {}

ParentCategory.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    }, {
        tableName: 'par_category',
        freezeTableName: true,
        sequelize
    }
);

ParentCategory.hasMany(Category, { foreignKey: "id_par_category", as: "subcategories" });
Category.belongsTo(ParentCategory, { foreignKey: "id_par_category", as: "parentcategory" });

module.exports = ParentCategory;