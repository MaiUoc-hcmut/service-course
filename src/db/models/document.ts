const { sequelize } = require('../../config/db');
import { Model, DataTypes } from 'sequelize';
const Category = require('./category');
const Topic = require('./topic');
const Folder = require('./folder');

class Document extends Model {}

Document.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        id_teacher: {
            type: DataTypes.UUID,
            allowNull: false
        },
        parent_folder_id: {
            type: DataTypes.UUID,
        },
        name: {
            type: DataTypes.STRING(100),
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        views: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
        },
        downloads: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
        },
        createdAt :{
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE,
        }
    },
    {
        tableName: 'document',
        freezeTableName: true,
        sequelize
    }
);


Document.belongsToMany(Category, { through: 'documentcategory', foreignKey: "id_document" });
Category.belongsToMany(Document, { through: 'documentcategory', foreignKey: "id_category" });

Document.belongsToMany(Topic, { through: 'document-topic', foreignKey: "id_document", otherKey: "id_topic" });
Topic.belongsToMany(Document, { through: 'document-topic', foreignKey: "id_topic", otherKey: "id_document" });

Document.belongsTo(Folder, { foreignKey: 'parent_folder_id' });
Folder.hasMany(Document, { foreignKey: 'parent_folder_id' });

module.exports = Document;