const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';

const Topic = require('./topic');
const Course = require('./course');

class Progress extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Progress.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    id_student: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    id_topic: {
        type: DataTypes.UUID,
        allowNull: false
    },
    id_course: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    tableName: 'course-progress',
    sequelize
});

Progress.belongsTo(Topic, { foreignKey: 'id_topic' });
Topic.hasMany(Progress, { foreignKey: 'id_topic', as: 'progresses' });

Progress.belongsTo(Course, { foreignKey: 'id_course' });
Course.hasMany(Progress, { foreignKey: 'id_course', as: 'progresses' });

module.exports = Progress;