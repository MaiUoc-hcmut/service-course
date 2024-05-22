'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('course', 'start_time', {
      type: Sequelize.DATE
    });
    await queryInterface.addColumn('course', 'end_time', {
      type: Sequelize.DATE
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('course', 'start_time');
    await queryInterface.removeColumn('course', 'end_time');
  }
};
