const { sequelize } = require('../../config/db');
import { Model, DataTypes } from 'sequelize';

const Course = require('./course');

class Review extends Model {}

Review.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        id_student: {
            type: DataTypes.UUID,
            allowNull: false
        },
        id_teacher: DataTypes.UUID,
        id_course: DataTypes.UUID,
        id_exam: DataTypes.UUID,
        content: DataTypes.STRING(1000),
        image: DataTypes.STRING(255),
        rating: {
            type: DataTypes.FLOAT.UNSIGNED,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'review',
        freezeTableName: true,
        sequelize
    }
);

Review.belongsTo(Course, {
    foreignKey: 'id_course'
});

Course.hasMany(Review, {
    foreignKey: 'id_course',
    as: 'ratings'
});
module.exports = Review;