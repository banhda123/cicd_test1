const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ForumReport = sequelize.define('ForumReport', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'topic_id',
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'post_id',
    },
    reporterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'reporter_id',
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'resolved', 'dismissed'),
      allowNull: false,
      defaultValue: 'pending',
    },
  }, {
    tableName: 'forum_reports',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['status', 'created_at'],
      },
      {
        fields: ['reporter_id'],
      },
      {
        fields: ['topic_id'],
      },
      {
        fields: ['post_id'],
      },
    ],
  });

  return ForumReport;
};
