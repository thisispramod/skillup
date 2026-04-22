// Only load .env in development. On Render, environment variables are set in the dashboard.
if (!process.env.RENDER) {
  require('dotenv').config();
}

const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

let sequelize;

// Database Configuration
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) {
  // Render PostgreSQL
  console.log('Using PostgreSQL connection (DATABASE_URL)');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // MySQL (Local or Remote)
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
    database: process.env.DB_NAME || 'e_test',
    port: process.env.DB_PORT || 3306,
    url: process.env.MYSQL_URL
  };

  // Diagnostic log for connection info (Safe: no password printed)
  if (process.env.RENDER) {
    console.log(`Render Environment: Attempting connection to ${dbConfig.host}:${dbConfig.port} as ${dbConfig.user} on DB ${dbConfig.database}`);
  }
  

  if (dbConfig.url) {
    sequelize = new Sequelize(dbConfig.url, {
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false
        }
      }
    });
  } else {
    sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        ssl: (process.env.DB_SSL === 'true') ? { rejectUnauthorized: false } : undefined
      }
    });
  }

  // Function to ensure database exists (Only runs for local development)
  var ensureDatabaseExists = async () => {
    // Only attempt to create database if we are connecting to localhost and not using a URL
    if (dbConfig.host !== 'localhost' && dbConfig.host !== '127.0.0.1' && !dbConfig.url) {
      console.log('Skipping database creation check for remote host.');
      return;
    }

    try {
      const mysql = require('mysql2/promise');
      const connConfig = dbConfig.url ? dbConfig.url : {
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        port: dbConfig.port
      };

      const connection = await mysql.createConnection(connConfig);
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
      await connection.end();
      console.log(`Database "${dbConfig.database}" ensured.`);
    } catch (error) {
      console.error('Database existence check failed (ignoring):', error.message);
    }
  };
}

// --- Models ---

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'student'), defaultValue: 'student' },
  total_xp: { type: DataTypes.INTEGER, defaultValue: 0 },
  current_streak: { type: DataTypes.INTEGER, defaultValue: 0 },
  last_active_date: { type: DataTypes.DATEONLY, allowNull: true },
  // User belongs to a specific Class and Batch
  // class_id is already added via association, but we can explicit it if we want, or rely on association methods
  // We'll rely on Sequelize associations for class_id and batch_id
});

const Class = sequelize.define('Class', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

const Batch = sequelize.define('Batch', {
  name: { type: DataTypes.STRING, allowNull: false } // e.g., "Batch A", "Batch B"
});

const Test = sequelize.define('Test', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  duration_minutes: { type: DataTypes.INTEGER, allowNull: false },
  start_time: { type: DataTypes.DATE, allowNull: true },
  end_time: { type: DataTypes.DATE, allowNull: true },
  test_type: { type: DataTypes.ENUM('standard', 'auto', 'ai'), defaultValue: 'standard' },
  test_mode: { type: DataTypes.ENUM('NORMAL', 'SCHEDULED'), defaultValue: 'NORMAL' },
  schedule_type: { type: DataTypes.ENUM('FLEXIBLE', 'STRICT'), allowNull: true },
  max_attempt: { type: DataTypes.INTEGER, defaultValue: 1 }
});

const Question = sequelize.define('Question', {
  text: { type: DataTypes.TEXT, allowNull: false },
  option_a: { type: DataTypes.STRING, allowNull: false },
  option_b: { type: DataTypes.STRING, allowNull: false },
  option_c: { type: DataTypes.STRING, allowNull: false },
  option_d: { type: DataTypes.STRING, allowNull: false },
  correct_option: { type: DataTypes.ENUM('A', 'B', 'C', 'D'), allowNull: false },
  marks: { type: DataTypes.INTEGER, defaultValue: 1 },
  topic: { type: DataTypes.STRING, defaultValue: 'General' },
  explanation: { type: DataTypes.TEXT, allowNull: false }
});

const Attempt = sequelize.define('Attempt', {
  score: { type: DataTypes.INTEGER, defaultValue: 0 },
  total_questions: { type: DataTypes.INTEGER, defaultValue: 0 },
  correct_answers: { type: DataTypes.INTEGER, defaultValue: 0 },
  wrong_answers: { type: DataTypes.INTEGER, defaultValue: 0 },
  completed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  answers_json: { type: DataTypes.TEXT }, // JSON string of selected answers
  // Snapshot for historical reporting
  class_id: { type: DataTypes.INTEGER },
  batch_id: { type: DataTypes.INTEGER },
  total_time: { type: DataTypes.INTEGER, defaultValue: 0 }, // Total time in seconds
  status: { type: DataTypes.ENUM('IN_PROGRESS', 'PAUSED', 'SUBMITTED', 'EXPIRED'), defaultValue: 'SUBMITTED' },
  time_left: { type: DataTypes.INTEGER, allowNull: true },
  last_saved_question_index: { type: DataTypes.INTEGER, defaultValue: 0 },
  time_spent_json: { type: DataTypes.TEXT },
  marked_review_json: { type: DataTypes.TEXT }
});

// --- Mock Test Models ---
const MockTest = sequelize.define('MockTest', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  duration_minutes: { type: DataTypes.INTEGER, allowNull: false },
  exam_type: { type: DataTypes.STRING, defaultValue: 'SSC CGL' },
  start_time: { type: DataTypes.DATE, allowNull: true },
  end_time: { type: DataTypes.DATE, allowNull: true },
  total_marks: { type: DataTypes.FLOAT },
  total_questions: { type: DataTypes.INTEGER },
  positive_marks: { type: DataTypes.FLOAT, defaultValue: 2 },
  negative_marks: { type: DataTypes.FLOAT, defaultValue: 0.5 },
  status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'draft' }
});

const MockTestSection = sequelize.define('MockTestSection', {
  name: { type: DataTypes.STRING, allowNull: false },
  total_questions: { type: DataTypes.INTEGER, defaultValue: 0 },
  marks_per_question: { type: DataTypes.FLOAT }, // override default if needed
  negative_marks: { type: DataTypes.FLOAT },
  order_index: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const MockTestQuestion = sequelize.define('MockTestQuestion', {
  text: { type: DataTypes.TEXT, allowNull: false },
  image_url: { type: DataTypes.STRING, allowNull: true },
  option_a: { type: DataTypes.STRING, allowNull: false },
  option_a_image: { type: DataTypes.STRING, allowNull: true },
  option_b: { type: DataTypes.STRING, allowNull: false },
  option_b_image: { type: DataTypes.STRING, allowNull: true },
  option_c: { type: DataTypes.STRING, allowNull: false },
  option_c_image: { type: DataTypes.STRING, allowNull: true },
  option_d: { type: DataTypes.STRING, allowNull: false },
  option_d_image: { type: DataTypes.STRING, allowNull: true },
  correct_option: { type: DataTypes.ENUM('A', 'B', 'C', 'D'), allowNull: false },
  explanation: { type: DataTypes.TEXT, allowNull: true },
  explanation_image: { type: DataTypes.STRING, allowNull: true }
});

const MockTestAttempt = sequelize.define('MockTestAttempt', {
  score: { type: DataTypes.FLOAT, defaultValue: 0 },
  total_questions: { type: DataTypes.INTEGER, defaultValue: 0 },
  correct_answers: { type: DataTypes.INTEGER, defaultValue: 0 },
  wrong_answers: { type: DataTypes.INTEGER, defaultValue: 0 },
  skipped_answers: { type: DataTypes.INTEGER, defaultValue: 0 },
  total_time: { type: DataTypes.INTEGER, defaultValue: 0 }, // seconds
  completed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  answers_json: { type: DataTypes.TEXT }, // JSON: { qId: { ans: 'A', time: 10, markedReview: false } }
  status: { type: DataTypes.ENUM('IN_PROGRESS', 'PAUSED', 'SUBMITTED', 'EXPIRED'), defaultValue: 'SUBMITTED' },
  time_left: { type: DataTypes.INTEGER, allowNull: true },
  last_saved_question_index: { type: DataTypes.INTEGER, defaultValue: 0 },
  marked_review_json: { type: DataTypes.TEXT }
});

const QuestionTime = sequelize.define('QuestionTime', {
  time_spent: { type: DataTypes.INTEGER, defaultValue: 0 }, // in seconds
});

// --- Relationships ---

// --- Mistake Book Model ---
const Mistake = sequelize.define('Mistake', {
  is_incorrect: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_slow: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_bookmarked: { type: DataTypes.BOOLEAN, defaultValue: false },
  retry_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  consecutive_correct_retries: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.ENUM('active', 'improved', 'revised'), defaultValue: 'active' },
  // Timestamps are automatic
});

// --- Habit Tracker Models ---
const Habit = sequelize.define('Habit', {
  habit_name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  goal: { type: DataTypes.STRING, allowNull: true },
  points: { type: DataTypes.INTEGER, defaultValue: 0 },
  weekly_target: { type: DataTypes.INTEGER, defaultValue: 7 } // Added for weekly goal system (e.g., 5 days/week)
});

const HabitLog = sequelize.define('HabitLog', {
  date: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.BOOLEAN, defaultValue: false } // 0 = Not Done, 1 = Done
});

// --- XP Log Model ---
const XPLog = sequelize.define('XPLog', {
  amount: { type: DataTypes.INTEGER, allowNull: false },
  reason: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// --- AI Service Related Models ---

const UserQuestionStat = sequelize.define('UserQuestionStat', {
  topic: { type: DataTypes.STRING, allowNull: false },
  correct_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  incorrect_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  avg_time_spent: { type: DataTypes.FLOAT, defaultValue: 0 },
  difficulty_score: { type: DataTypes.FLOAT, defaultValue: 0.5 }, // 0 to 1
});

const AITestCache = sequelize.define('AITestCache', {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  performance_data: { type: DataTypes.TEXT }, // JSON string of performance metadata
  test_data: { type: DataTypes.TEXT, allowNull: false }, // JSON string of generated questions
  date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW }
});

const AIUsageLimit = sequelize.define('AIUsageLimit', {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  count: { type: DataTypes.INTEGER, defaultValue: 0 }
});

// --- Relationships ---

User.hasMany(Test, { foreignKey: 'created_by' });
Test.belongsTo(User, { foreignKey: 'created_by' });

// User-Class Relationship
Class.hasMany(User, { foreignKey: 'class_id' });
User.belongsTo(Class, { foreignKey: 'class_id' });

// Class-Batch Relationship
Class.hasMany(Batch, { foreignKey: 'class_id' });
Batch.belongsTo(Class, { foreignKey: 'class_id' });

// User-Batch Relationship
Batch.hasMany(User, { foreignKey: 'batch_id' });
User.belongsTo(Batch, { foreignKey: 'batch_id' });

// Test-Class Relationship (Many-to-Many)
Test.belongsToMany(Class, { through: 'TestClasses', foreignKey: 'test_id' });
Class.belongsToMany(Test, { through: 'TestClasses', foreignKey: 'class_id' });

// Test-Batch Relationship (Many-to-Many)
Test.belongsToMany(Batch, { through: 'TestBatches', foreignKey: 'test_id' });
Batch.belongsToMany(Test, { through: 'TestBatches', foreignKey: 'batch_id' });

Test.hasMany(Question, { foreignKey: 'test_id', onDelete: 'CASCADE' });
Question.belongsTo(Test, { foreignKey: 'test_id' });

User.hasMany(Attempt, { foreignKey: 'user_id' });
Attempt.belongsTo(User, { foreignKey: 'user_id' });

Test.hasMany(Attempt, { foreignKey: 'test_id', onDelete: 'CASCADE' });
Attempt.belongsTo(Test, { foreignKey: 'test_id' });

// QuestionTime Relationships
Attempt.hasMany(QuestionTime, { foreignKey: 'attempt_id', onDelete: 'CASCADE' });
QuestionTime.belongsTo(Attempt, { foreignKey: 'attempt_id' });

Question.hasMany(QuestionTime, { foreignKey: 'question_id', onDelete: 'CASCADE' });
QuestionTime.belongsTo(Question, { foreignKey: 'question_id' });

User.hasMany(QuestionTime, { foreignKey: 'user_id' });
QuestionTime.belongsTo(User, { foreignKey: 'user_id' });

Test.hasMany(QuestionTime, { foreignKey: 'test_id' });
QuestionTime.belongsTo(Test, { foreignKey: 'test_id' });

// Mistake Relationships
User.hasMany(Mistake, { foreignKey: 'user_id' });
Mistake.belongsTo(User, { foreignKey: 'user_id' });

Test.hasMany(Mistake, { foreignKey: 'test_id', onDelete: 'CASCADE' });
Mistake.belongsTo(Test, { foreignKey: 'test_id' });

Question.hasMany(Mistake, { foreignKey: 'question_id', onDelete: 'CASCADE' });
Mistake.belongsTo(Question, { foreignKey: 'question_id' });

// Mock Test Relationships
User.hasMany(MockTest, { foreignKey: 'created_by' });
MockTest.belongsTo(User, { foreignKey: 'created_by' });

MockTest.hasMany(MockTestSection, { foreignKey: 'mock_test_id', onDelete: 'CASCADE' });
MockTestSection.belongsTo(MockTest, { foreignKey: 'mock_test_id' });

MockTestSection.hasMany(MockTestQuestion, { foreignKey: 'section_id', onDelete: 'CASCADE' });
MockTestQuestion.belongsTo(MockTestSection, { foreignKey: 'section_id' });

MockTest.hasMany(MockTestQuestion, { foreignKey: 'mock_test_id', onDelete: 'CASCADE' });
MockTestQuestion.belongsTo(MockTest, { foreignKey: 'mock_test_id' });

User.hasMany(MockTestAttempt, { foreignKey: 'user_id' });
MockTestAttempt.belongsTo(User, { foreignKey: 'user_id' });

MockTest.hasMany(MockTestAttempt, { foreignKey: 'mock_test_id', onDelete: 'CASCADE' });
MockTestAttempt.belongsTo(MockTest, { foreignKey: 'mock_test_id' });

// Habit Tracker Relationships
User.hasMany(Habit, { foreignKey: 'user_id' });
Habit.belongsTo(User, { foreignKey: 'user_id' });

Habit.hasMany(HabitLog, { foreignKey: 'habit_id', onDelete: 'CASCADE' });
HabitLog.belongsTo(Habit, { foreignKey: 'habit_id' });

User.hasMany(HabitLog, { foreignKey: 'user_id' });
HabitLog.belongsTo(User, { foreignKey: 'user_id' });

// XP Log Relationships
User.hasMany(XPLog, { foreignKey: 'user_id', onDelete: 'CASCADE' });
XPLog.belongsTo(User, { foreignKey: 'user_id' });

// AI Service Relationships
User.hasMany(UserQuestionStat, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserQuestionStat.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(AITestCache, { foreignKey: 'user_id', onDelete: 'CASCADE' });
AITestCache.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(AIUsageLimit, { foreignKey: 'user_id', onDelete: 'CASCADE' });
AIUsageLimit.belongsTo(User, { foreignKey: 'user_id' });


// --- Initialization ---

const initDB = async () => {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log('Connected to MySQL successfully.');

    await sequelize.sync({ alter: true });
    console.log('Database synced');

    // Seed default classes
    const classCount = await Class.count();
    if (classCount === 0) {
      await Class.bulkCreate([
        { name: 'Class 10' },
        { name: 'Class 12' },
        { name: 'Class 11' },
      ]);
      console.log('Default classes created.');
    }

    // Seed default batches for Class 10
    const class10 = await Class.findOne({ where: { name: 'Class 10' } });
    if (class10) {
      const batchCount = await Batch.count({ where: { class_id: class10.id } });
      if (batchCount === 0) {
        await Batch.bulkCreate([
          { name: 'Batch A', class_id: class10.id },
          { name: 'Batch B', class_id: class10.id }
        ]);
        console.log('Default batches created for Class 10.');
      }
    }

    // Seed default admin
    const adminExists = await User.findOne({ where: { email: 'admin@test.com' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Super Admin',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin user created: admin@test.com / admin123');
    }

    // Seed default student
    const student = await User.findOne({ where: { email: 'pramod@test.com' } });
    // Refetch class10 in case it wasn't fetched above (if we didn't enter that block)
    const class10ForStudent = await Class.findOne({ where: { name: 'Class 10' } });

    if (class10ForStudent) {
      const batchA = await Batch.findOne({ where: { name: 'Batch A', class_id: class10ForStudent.id } });

      if (!student) {
        const hashedPassword = await bcrypt.hash('student123', 10);
        await User.create({
          name: 'pramod',
          email: 'pramod@test.com',
          password: hashedPassword,
          role: 'student',
          class_id: class10ForStudent.id,
          batch_id: batchA ? batchA.id : null
        });
        console.log('Student user created: pramod@test.com / student123 (Class 10, Batch A)');
      } else {
        // Update existing student to be in Class 10 and Batch A if not set
        if (student.class_id !== class10ForStudent.id || !student.batch_id) {
          await student.update({
            class_id: class10ForStudent.id,
            batch_id: batchA ? batchA.id : student.batch_id
          });
          console.log('Updated existing student to Class 10 / Batch A.');
        }
      }
    }

    // Seed Sample Test and Questions if no tests exist
    const testCount = await Test.count();
    let sampleTest;
    if (testCount === 0) {
      const admin = await User.findOne({ where: { role: 'admin' } });
      sampleTest = await Test.create({
        title: 'General Knowledge Quiz',
        description: 'A basic quiz to test your general knowledge. Assigned to Class 10.',
        duration_minutes: 10,
        created_by: admin.id
      });
      console.log('Sample test created.');

      await Question.bulkCreate([
        {
          text: 'What is the capital of France?',
          option_a: 'Berlin', option_b: 'Madrid', option_c: 'Paris', option_d: 'Rome',
          correct_option: 'C', marks: 5, test_id: sampleTest.id, explanation: 'Paris is the capital and most populous city of France.'
        },
        {
          text: 'Which planet is known as the Red Planet?',
          option_a: 'Earth', option_b: 'Mars', option_c: 'Jupiter', option_d: 'Venus',
          correct_option: 'B', marks: 5, test_id: sampleTest.id, explanation: 'Mars is often called the "Red Planet" because of iron oxide on its surface.'
        },
        {
          text: 'What is 5 + 7?',
          option_a: '10', option_b: '11', option_c: '12', option_d: '13',
          correct_option: 'C', marks: 5, test_id: sampleTest.id, explanation: 'Simple addition: 5 plus 7 equals 12.'
        }
      ]);
      console.log('Sample questions created.');
    } else {
      sampleTest = await Test.findOne({ where: { title: 'General Knowledge Quiz' } });
    }

    // Ensure sample test is linked to Class 10
    if (sampleTest) {
      const class10 = await Class.findOne({ where: { name: 'Class 10' } });
      if (class10) {
        const hasClass = await sampleTest.hasClass(class10);
        if (!hasClass) {
          await sampleTest.addClass(class10);
          console.log('Sample test assigned to Class 10.');
        }
      }
    }

  } catch (error) {
    console.error('DB Init Error:', error);
  }
};

module.exports = { sequelize, User, Test, Question, Attempt, QuestionTime, Class, Batch, Mistake, MockTest, MockTestSection, MockTestQuestion, MockTestAttempt, Habit, HabitLog, XPLog, UserQuestionStat, AITestCache, AIUsageLimit, initDB };
