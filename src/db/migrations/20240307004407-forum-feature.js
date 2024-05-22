'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('forum', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
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
      total_topic: {
        type: Sequelize.INTEGER
      },
      total_answer: {
        type: Sequelize.INTEGER
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
    await queryInterface.createTable('topicforum', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      id_forum: {
        type: Sequelize.UUID,
        references: {
          model: 'Forum',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      id_user: {
        type: Sequelize.UUID,
      },
      role: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING(100),
      },
      description: {
        type: Sequelize.STRING(600),
      },
      file: {
        type: Sequelize.TEXT
      },
      total_answer: {
        type: Sequelize.INTEGER
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
    await queryInterface.createTable('answer', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      id_topic_forum: {
        type: Sequelize.UUID,
        references: {
          model: 'TopicForum',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      id_parent: {
        type: Sequelize.UUID,
        references: {
          model: 'Answer',
          key: 'id',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      id_user: {
        type: Sequelize.UUID
      },
      content: {
        type: Sequelize.STRING(600),
      },
      file: {
        type: Sequelize.TEXT,
      },
      role: {
        type: Sequelize.STRING
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('answer');
    await queryInterface.dropTable('topicforum');
    await queryInterface.dropTable('forum');
  }
};
