'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('coupon', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      id_teacher: {
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING
      },
      percent: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      expire: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
    await queryInterface.createTable('coupon_course', {
      id_coupon: {
        type: Sequelize.UUID,
        references: {
          model: 'Coupon',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      id_course: {
        type: Sequelize.UUID,
        references: {
          model: 'Course',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('coupon_course');
    await queryInterface.dropTable('coupon');
  }
};
