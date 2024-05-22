const { sequelize } = require('../../config/db');
import { Model, DataTypes, CreationOptional } from 'sequelize';

const Course = require('./course');
const TopicForum = require('./topicforum');
const Answer = require('./answer');

class Forum extends Model {
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Forum.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    id_course: {
        type: DataTypes.UUID,
    },
    total_topic: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    total_answer: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'forum',
    sequelize
});

Course.hasOne(Forum, { foreignKey: 'id_course' });
Forum.belongsTo(Course, { foreignKey: 'id_course' });

Forum.hasMany(TopicForum, { foreignKey: 'id_forum', as: 'topics' });
TopicForum.belongsTo(Forum, { foreignKey: 'id_forum' });

TopicForum.hasMany(Answer, { foreignKey: 'id_topic_forum', as: 'answers' });
Answer.belongsTo(TopicForum, { foreignKey: 'id_topic_forum' });

module.exports = Forum;