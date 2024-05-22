'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('course-draft', 'duration', {
      type: Sequelize.INTEGER
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('course-draft', 'duration');
  }
};
