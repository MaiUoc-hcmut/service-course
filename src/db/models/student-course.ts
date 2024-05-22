const { sequelize } = require('../../config/db');
import { Model, CreationOptional, DataTypes } from 'sequelize';

const Course = require('./course');

class StudentCourse extends Model {
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

StudentCourse.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        id_student: {
            type: DataTypes.UUID
        },
        id_course: {
            type: DataTypes.UUID
        }
    }, {
    tableName: 'student-course',
    sequelize
}
);

Course.hasOne(StudentCourse, { foreignKey: 'id_course' });
StudentCourse.belongsTo(Course, { foreignKey: 'id_course' });

module.exports = StudentCourse;