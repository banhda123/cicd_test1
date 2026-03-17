const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AiDocument = sequelize.define('AiDocument', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'course_id',
    },
    chapterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'chapter_id',
    },
    lectureId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'lecture_id',
    },
    sourceHash: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'source_hash',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
  }, {
    tableName: 'ai_documents',
  });

  return AiDocument;
};
