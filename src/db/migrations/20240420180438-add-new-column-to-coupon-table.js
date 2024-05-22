'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('coupon', 'start_time', {
      type: Sequelize.DATE
    })
  },

  async down (queryInterface, Sequelize) {
    await Sequelize.removeColumn('coupon', 'start_time');
  }
};
