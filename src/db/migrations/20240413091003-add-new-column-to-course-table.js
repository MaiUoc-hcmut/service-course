'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('course', 'registration', {
      type: Sequelize.INTEGER.UNSIGNED
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('course', 'registration');
  }
};
