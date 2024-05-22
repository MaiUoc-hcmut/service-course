'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('student-course', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      id_student: {
        type: Sequelize.UUID,
      },
      id_course: {
        type: Sequelize.UUID,
        references: {
          model: 'Course',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('student-course')
  }
};
