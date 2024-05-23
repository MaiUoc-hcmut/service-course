
const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';

class Comment extends Model {
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    id_parent: {
      type: DataTypes.UUID
    },
    id_topic: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "student",
    },
    content: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: 'comment',
    sequelize,
  },
);

Comment.hasMany(Comment, {
  as: 'replies',
  foreignKey: 'id_parent',
  sourceKey: 'id'
});

module.exports = Comment
