const { Sequelize, DataTypes } = require('sequelize'); // ✅ Đã thêm DataTypes ở đây

// Use SQLite for testing, PostgreSQL for production, MySQL for development
const isTest = process.env.NODE_ENV === 'test';
const isProd = process.env.NODE_ENV === 'production';

let sequelize;

if (isTest) {
  sequelize = new Sequelize('sqlite::memory:', {
    logging: false,
    define: { timestamps: true }
  });
} else if (isProd) {
  // Ưu tiên dùng DATABASE_URL nếu có (chuỗi kết nối nhanh trên Render)
  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // Bắt buộc để kết nối SSL trên Render
        }
      }
    });
  } else {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      }
    );
  }
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: false,
    }
  );
}

// ----- models setup -----
const models = {};
const modelNames = [
  'user', 'course', 'category', 'chapter', 'lecture',
  'forumTopic', 'forumPost', 'forumReport', 'aiSetting',
  'aiRolePolicy', 'aiPromptTemplate', 'aiDocument', 'aiChunk',
  'aiConversation', 'aiMessage', 'aiAuditLog', 'enrollment',
  'payment', 'quiz', 'question', 'attempt', 'review',
  'notification', 'scheduleEvent',
];

modelNames.forEach((name) => {
  // Đã truyền cả sequelize và DataTypes vào các model con
  const model = require(`./${name}.model`)(sequelize, DataTypes);
  models[name.charAt(0).toUpperCase() + name.slice(1)] = model;
});

// Export DataTypes để các model có thể import
module.exports.DataTypes = DataTypes;

// Giải nén models để thiết lập association
const {
  User, Course, Category, Chapter, Lecture,
  ForumTopic, ForumPost, ForumReport,
  AiDocument, AiChunk, AiPromptTemplate, AiAuditLog,
  AiConversation, AiMessage, Enrollment, Payment,
  Quiz, Question, Attempt, Review, Notification, ScheduleEvent
} = models;

// --- THIẾT LẬP ASSOCIATIONS ---
User.hasMany(Course, { foreignKey: 'createdBy', as: 'createdCourses' });
Course.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Category.hasMany(Course, { foreignKey: 'categoryId' });
Course.belongsTo(Category, { foreignKey: 'categoryId' });

Course.hasMany(Chapter, { foreignKey: 'courseId' });
Chapter.belongsTo(Course, { foreignKey: 'courseId' });
Chapter.hasMany(Lecture, { foreignKey: 'chapterId' });
Lecture.belongsTo(Chapter, { foreignKey: 'chapterId' });

User.hasMany(AiConversation, { foreignKey: 'userId', as: 'aiConversations' });
AiConversation.belongsTo(User, { foreignKey: 'userId', as: 'user' });
AiConversation.hasMany(AiMessage, { foreignKey: 'conversationId', as: 'messages' });
AiMessage.belongsTo(AiConversation, { foreignKey: 'conversationId', as: 'conversation' });

Course.hasMany(AiConversation, { foreignKey: 'courseId', as: 'aiConversations' });
AiConversation.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Lecture.hasMany(AiConversation, { foreignKey: 'lectureId', as: 'aiConversations' });
AiConversation.belongsTo(Lecture, { foreignKey: 'lectureId', as: 'lecture' });

User.hasMany(ForumTopic, { foreignKey: 'userId', as: 'forumTopics' });
ForumTopic.belongsTo(User, { foreignKey: 'userId', as: 'author' });

ForumTopic.hasMany(ForumPost, { foreignKey: 'topicId', as: 'posts' });
ForumPost.belongsTo(ForumTopic, { foreignKey: 'topicId', as: 'topic' });

User.hasMany(ForumPost, { foreignKey: 'userId', as: 'forumPosts' });
ForumPost.belongsTo(User, { foreignKey: 'userId', as: 'author' });

ForumPost.hasMany(ForumPost, { foreignKey: 'parentId', as: 'replies' });
ForumPost.belongsTo(ForumPost, { foreignKey: 'parentId', as: 'parent' });

User.hasMany(ForumReport, { foreignKey: 'reporterId', as: 'forumReports' });
ForumReport.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });

ForumTopic.hasMany(ForumReport, { foreignKey: 'topicId', as: 'reports' });
ForumReport.belongsTo(ForumTopic, { foreignKey: 'topicId', as: 'topic' });

ForumPost.hasMany(ForumReport, { foreignKey: 'postId', as: 'reports' });
ForumReport.belongsTo(ForumPost, { foreignKey: 'postId', as: 'post' });

Course.hasMany(ForumTopic, { foreignKey: 'courseId', as: 'forumTopics' });
ForumTopic.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Lecture.hasMany(ForumTopic, { foreignKey: 'lectureId', as: 'forumTopics' });
ForumTopic.belongsTo(Lecture, { foreignKey: 'lectureId', as: 'lecture' });

AiDocument.hasMany(AiChunk, { foreignKey: 'documentId', as: 'chunks' });
AiChunk.belongsTo(AiDocument, { foreignKey: 'documentId', as: 'document' });

User.hasMany(AiPromptTemplate, { foreignKey: 'createdByAdminId', as: 'aiPromptTemplates' });
AiPromptTemplate.belongsTo(User, { foreignKey: 'createdByAdminId', as: 'createdByAdmin' });

User.hasMany(AiAuditLog, { foreignKey: 'userId', as: 'aiAuditLogs' });
AiAuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Enrollment, { foreignKey: 'userId' });
Enrollment.belongsTo(User, { foreignKey: 'userId' });
Course.hasMany(Enrollment, { foreignKey: 'courseId' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId' });

Course.hasMany(ScheduleEvent, { foreignKey: 'courseId', as: 'scheduleEvents' });
ScheduleEvent.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

Enrollment.hasOne(Payment, { foreignKey: 'enrollmentId' });
Payment.belongsTo(Enrollment, { foreignKey: 'enrollmentId' });
User.hasMany(Payment, { foreignKey: 'userId' });
Course.hasMany(Payment, { foreignKey: 'courseId' });

// Gọi hàm associate cho các model đặc thù
for (const model of [Payment, Review, Notification, Quiz, Question, Attempt]) {
  if (model && typeof model.associate === 'function') {
    model.associate(models);
  }
}

// Extra relations
User.hasMany(Quiz, { foreignKey: 'createdBy', as: 'createdQuizzes' });
Course.hasMany(Quiz, { foreignKey: 'courseId', as: 'quizzes' });
User.hasMany(Attempt, { foreignKey: 'userId', as: 'attempts' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Course.hasMany(Review, { foreignKey: 'courseId', as: 'reviews' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    if (process.env.NODE_ENV === 'test') {
      await sequelize.sync({ force: true });
      console.log('✅ Test database synced');
    }
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
};

module.exports = { sequelize, connectDB, models };