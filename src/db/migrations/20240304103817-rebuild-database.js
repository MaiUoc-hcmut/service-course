'use strict';
/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require('sequelize');
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('course', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      id_teacher: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(600),
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      object: {
        type: DataTypes.STRING(400),
        allowNull: false,
      },
      goal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      requirement: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      thumbnail: DataTypes.TEXT,
      cover_image: DataTypes.TEXT,
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_lecture: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_exam: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_duration: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      total_chapter: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_review: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      average_rating: {
        type: DataTypes.FLOAT,
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
    });
    await queryInterface.createTable('chapter', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      id_course: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Course',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
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
    });
    await queryInterface.createTable('topic', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      id_chapter: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Chapter',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_exam: DataTypes.UUID,
      video: {
        type: DataTypes.TEXT,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      duration: {
        type: DataTypes.BIGINT,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
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
    });
    await queryInterface.createTable('folder', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      id_teacher: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      parent_folder_id: {
        type: DataTypes.UUID,
        references: {
          model: 'Folder',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: {
        type: DataTypes.STRING(100)
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
    await queryInterface.createTable('document', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      id_teacher: {
        allowNull: false,
        type: DataTypes.UUID
      },
      parent_folder_id: {
        type: DataTypes.UUID,
        references: {
          model: 'Folder',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: {
        type: DataTypes.STRING(100)
      },
      url: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      views: {
        type: DataTypes.INTEGER.UNSIGNED
      },
      downloads: {
        type: DataTypes.INTEGER.UNSIGNED
      },
      createdAt :{
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    });
    await queryInterface.createTable('comment', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      id_parent: {
        type: DataTypes.UUID,
        references: {
          model: 'Comment',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_topic: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Topic',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_user: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING(1000),
      },
      image: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('par_category', {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(20),
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('category', {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      id_par_category: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: 'Par_category',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(30),
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('category-course', {
      id_course: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: 'Course',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_category: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: 'Category',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
    await queryInterface.createTable('review', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      id_student: {
        type: DataTypes.UUID,
      },
      id_teacher: {
        type: DataTypes.UUID,
      },
      id_course: {
        type: DataTypes.UUID,
        references: {
          model: 'Course',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_exam: {
        type: DataTypes.UUID,
      },
      image: {
        type: DataTypes.TEXT,
      },
      content: {
        type: DataTypes.STRING(1000),
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
    await queryInterface.createTable('course-draft', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      topic_order: {
        type: DataTypes.INTEGER,
      },
      chapter_order: {
        type: DataTypes.INTEGER,
      },
      id_course: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      id_topic: {
        type: DataTypes.UUID
      },
      id_document: {
        type: DataTypes.UUID
      },
      type: {
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
    await queryInterface.createTable('course-progress', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      id_student: DataTypes.UUID,
      id_topic: {
        type: DataTypes.UUID,
        references: {
          model: 'Topic',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_course: {
        type: DataTypes.UUID,
        references: {
          model: 'Course',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      }
    });
    await queryInterface.createTable('document-topic', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      id_document: {
        type: Sequelize.UUID,
        references: {
          model: 'Document',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      id_topic: {
        type: Sequelize.UUID,
        references: {
          model: 'Topic',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('document-topic');
    await queryInterface.dropTable('course-progress');
    await queryInterface.dropTable('category-course');
    await queryInterface.dropTable('document');
    await queryInterface.dropTable('folder');
    await queryInterface.dropTable('review');
    await queryInterface.dropTable('comment');
    await queryInterface.dropTable('topic');
    await queryInterface.dropTable('chapter');
    await queryInterface.dropTable('course');
    await queryInterface.dropTable('category');
    await queryInterface.dropTable('par_category');
    await queryInterface.dropTable('course-draft');
  },
};
