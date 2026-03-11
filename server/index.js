if (!process.env.RENDER) {
    require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User, Test, Question, Attempt, QuestionTime, Class, Batch, Mistake, MockTest, MockTestSection, MockTestQuestion, MockTestAttempt, initDB } = require('./database');
const { Op } = require('sequelize');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: 'uploads/' });

const app = express();
const PORT = process.env.PORT || 5005;
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_jwt_key_should_be_in_env'; // Fallback for dev only
const allowedOrigins = [
    "https://thisispramod-etests-app.vercel.app",
    "https://tuts-etests.vercel.app",
    "http://localhost:5174",
    "http://92.4.67.31",
    "https://opc.dedyn.io",
    "http://52.66.205.65"
];

app.use(express.json());

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error("CORS not allowed"), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
// Middleware to verify Token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    next();
};

// --- UTILS ---
const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
};

// --- AUTH ROUTES ---

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, SECRET_KEY, { expiresIn: '4h' });
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/register', async (req, res) => {
    // Simple registration for students
    const { name, email, password, class_id, batch_id } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, role: 'student', class_id, batch_id });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Email likely already exists' });
    }
});

// --- CLASS ROUTES ---

// Get All Classes (Public for Registration)
app.get('/api/public/classes', async (req, res) => {
    try {
        const classes = await Class.findAll({
            include: [{ model: Batch }]
        });
        res.json(classes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Classes with Batches (protected)
app.get('/api/classes', authenticateToken, async (req, res) => {
    try {
        const classes = await Class.findAll({
            include: [{ model: Batch }]
        });
        res.json(classes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Batch
app.post('/api/batches', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, class_id } = req.body;
        const newBatch = await Batch.create({ name, class_id });
        res.status(201).json(newBatch);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Batch
app.delete('/api/batches/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await Batch.destroy({ where: { id: req.params.id } });
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Class
app.post('/api/classes', authenticateToken, isAdmin, async (req, res) => {
    try {
        const newClass = await Class.create(req.body);
        res.status(201).json(newClass);
    } catch (err) {
        res.status(400).json({ error: 'Class name likely already exists' });
    }
});

// Delete Class
app.delete('/api/classes/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await Class.destroy({ where: { id: req.params.id } });
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Students (for Admin to assign classes)
app.get('/api/admin/students', authenticateToken, isAdmin, async (req, res) => {
    try {
        const students = await User.findAll({
            where: { role: 'student' },
            include: [
                { model: Class, attributes: ['id', 'name'] },
                { model: Batch, attributes: ['id', 'name'] }
            ],
            attributes: ['id', 'name', 'email', 'class_id', 'batch_id']
        });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Assign Class and Batch to Student
app.put('/api/admin/students/:id/class', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { class_id, batch_id } = req.body;
        await User.update({ class_id, batch_id }, { where: { id: req.params.id } });
        res.json({ message: 'Class and Batch assigned successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- ADMIN ROUTES ---

// Create Test (with Class Assignment)
app.post('/api/tests', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { classIds, batchIds, ...testData } = req.body;
        const test = await Test.create({ ...testData, created_by: req.user.id });

        if (classIds && classIds.length > 0) {
            await test.setClasses(classIds);
        }
        if (batchIds && batchIds.length > 0) {
            await test.setBatches(batchIds);
        }

        res.status(201).json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Tests (for Admin)
app.get('/api/admin/tests', authenticateToken, isAdmin, async (req, res) => {
    try {
        const tests = await Test.findAll({
            include: [
                { model: Class, attributes: ['id', 'name'] },
                { model: Batch, attributes: ['id', 'name'] }
            ]
        });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Test (with Class Assignment)
app.put('/api/tests/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { classIds, batchIds, ...testData } = req.body;
        const test = await Test.findByPk(req.params.id);
        if (!test) return res.status(404).json({ message: 'Test not found' });

        await test.update(testData);
        if (classIds) {
            await test.setClasses(classIds);
        }
        if (batchIds) {
            await test.setBatches(batchIds);
        }

        res.json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Test
app.delete('/api/tests/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const test = await Test.findByPk(req.params.id);
        if (!test) return res.status(404).json({ message: 'Test not found' });
        await test.destroy();
        res.json({ message: 'Test deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get Single Test (with questions for editing)
app.get('/api/tests/:id', authenticateToken, async (req, res) => {
    try {
        const includeQuestions = req.user.role === 'admin';
        // Students normally shouldn't fetch all questions with answers immediately if secure, 
        // but typically we send questions without 'correct_option' to student.

        // However, for simplicity, we fetch them here. 
        // If student, we should sanitize.

        const test = await Test.findByPk(req.params.id, {
            include: [
                ...(includeQuestions ? [Question] : []),
                { model: Class, attributes: ['id', 'name'] },
                { model: Batch, attributes: ['id', 'name'] }
            ]
        });

        if (!test) return res.status(404).json({ message: 'Test not found' });
        res.json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Question
app.post('/api/questions', authenticateToken, isAdmin, async (req, res) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Question
app.put('/api/questions/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const question = await Question.findByPk(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });

        await question.update(req.body);
        res.json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Question
app.delete('/api/questions/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await Question.destroy({ where: { id: req.params.id } });
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- IMPORT / EXPORT QUESTIONS ---

// Download Sample Template
app.get('/api/admin/sample-question-sheet', authenticateToken, isAdmin, (req, res) => {
    try {
        const wb = xlsx.utils.book_new();
        const wsData = [
            ['text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_option', 'marks', 'topic', 'explanation'],
            ['What is 2+2?', '3', '4', '5', '6', 'B', 1, 'Math', 'Simple addition'],
            ['Capital of India?', 'Mumbai', 'Delhi', 'Kolkata', 'Chennai', 'B', 1, 'GK', 'New Delhi is the capital']
        ];
        const ws = xlsx.utils.aoa_to_sheet(wsData);
        xlsx.utils.book_append_sheet(wb, ws, 'Template');

        const tempFilePath = path.join(__dirname, 'uploads', 'question_import_template.xlsx');

        // Ensure uploads dir exists
        if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
            fs.mkdirSync(path.join(__dirname, 'uploads'));
        }

        xlsx.writeFile(wb, tempFilePath);

        res.download(tempFilePath, 'question_import_template.xlsx', (err) => {
            if (err) console.error('Error sending file:', err);
            // Optionally delete template after sending, but it's small and reusable, so maybe keep or overwrite next time
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate template' });
    }
});

// Import Questions
app.post('/api/tests/:id/import-questions', authenticateToken, isAdmin, upload.single('file'), async (req, res) => {
    const filePath = req.file?.path;
    if (!filePath) return res.status(400).json({ message: 'No file uploaded' });

    try {
        const testId = req.params.id;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet);

        if (jsonData.length === 0) {
            return res.status(400).json({ message: 'The uploaded sheet is empty.' });
        }

        const questionsToInsert = [];
        const errors = [];

        // Validation & Preparation
        jsonData.forEach((row, index) => {
            // Normalize keys to lowercase just in case
            const r = {};
            Object.keys(row).forEach(k => {
                r[k.toLowerCase().trim()] = row[k];
            });

            // Required fields
            if (!r.text || !r.option_a || !r.option_b || !r.option_c || !r.option_d || !r.correct_option) {
                errors.push(`Row ${index + 2}: Missing required fields (text, options A-D, correct_option)`);
                return;
            }

            // Validate Correct Option
            const validOptions = ['A', 'B', 'C', 'D'];
            const correctOpt = r.correct_option.toString().toUpperCase().trim();
            if (!validOptions.includes(correctOpt)) {
                errors.push(`Row ${index + 2}: Invalid correct_option '${r.correct_option}'. Must be A, B, C, or D.`);
                return;
            }

            questionsToInsert.push({
                text: r.text,
                option_a: r.option_a,
                option_b: r.option_b,
                option_c: r.option_c,
                option_d: r.option_d,
                correct_option: correctOpt,
                marks: r.marks || 1,
                topic: r.topic || 'General',
                explanation: r.explanation || '',
                test_id: testId,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });

        if (errors.length > 0) {
            // If any errors, fail the batch? Or insert valid ones?
            // User requirement: "Show error if file format is wrong."
            // Usually safest to fail all if there are format errors to let user fix file.
            return res.status(400).json({ message: 'Validation Errors', details: errors });
        }

        // Bulk Insert
        await Question.bulkCreate(questionsToInsert);

        res.json({
            success: true,
            message: `${questionsToInsert.length} Questions imported successfully`,
            count: questionsToInsert.length
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process file', details: err.message });
    } finally {
        // Cleanup uploaded file
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
});

// Get All Reports (Admin)
app.get('/api/admin/reports', authenticateToken, isAdmin, async (req, res) => {
    try {
        const attempts = await Attempt.findAll({
            include: [
                { model: User, attributes: ['name', 'email'] },
                { model: Test, attributes: ['title'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(attempts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN MOCK TEST ROUTES ---

app.post('/api/admin/mock-tests', authenticateToken, isAdmin, async (req, res) => {
    try {
        const test = await MockTest.create({ ...req.body, created_by: req.user.id });
        res.status(201).json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/mock-tests', authenticateToken, isAdmin, async (req, res) => {
    try {
        const tests = await MockTest.findAll({
            include: [{ model: MockTestSection }]
        });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/mock-tests/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const test = await MockTest.findByPk(req.params.id);
        if (!test) return res.status(404).json({ message: 'Mock Test not found' });
        await test.update(req.body);
        res.json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/mock-tests/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await MockTest.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Mock Test deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/mock-tests/:testId', authenticateToken, isAdmin, async (req, res) => {
    try {
        const test = await MockTest.findByPk(req.params.testId, {
            include: [{
                model: MockTestSection,
                include: [MockTestQuestion]
            }]
        });
        if (!test) return res.status(404).json({ message: 'Mock Test not found' });
        res.json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mock Test Sections
app.post('/api/admin/mock-tests/:testId/sections', authenticateToken, isAdmin, async (req, res) => {
    try {
        const section = await MockTestSection.create({ ...req.body, mock_test_id: req.params.testId });
        res.status(201).json(section);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/mock-test-sections/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const section = await MockTestSection.findByPk(req.params.id);
        if (!section) return res.status(404).json({ message: 'Section not found' });
        await section.update(req.body);
        res.json(section);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/mock-test-sections/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await MockTestSection.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Section deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Import Questions for Mock Test Section
app.post('/api/admin/mock-test-sections/:sectionId/import', authenticateToken, isAdmin, upload.single('file'), async (req, res) => {
    const filePath = req.file?.path;
    if (!filePath) return res.status(400).json({ message: 'No file uploaded' });

    try {
        const sectionId = req.params.sectionId;
        const section = await MockTestSection.findByPk(sectionId);
        if (!section) return res.status(404).json({ message: 'Section not found' });

        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet);

        if (jsonData.length === 0) {
            return res.status(400).json({ message: 'Empty sheet' });
        }

        const questionsToInsert = [];
        jsonData.forEach((row) => {
            const r = {};
            Object.keys(row).forEach(k => r[k.toLowerCase().trim()] = row[k]);

            if (!r.text || !r.option_a || !r.option_b || !r.option_c || !r.option_d || !r.correct_option) return;

            questionsToInsert.push({
                text: r.text,
                image_url: r.image_url || null,
                option_a: r.option_a, option_a_image: r.option_a_image || null,
                option_b: r.option_b, option_b_image: r.option_b_image || null,
                option_c: r.option_c, option_c_image: r.option_c_image || null,
                option_d: r.option_d, option_d_image: r.option_d_image || null,
                correct_option: r.correct_option.toString().toUpperCase().trim(),
                explanation: r.explanation || null,
                explanation_image: r.explanation_image || null,
                section_id: sectionId,
                mock_test_id: section.mock_test_id,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });

        await MockTestQuestion.bulkCreate(questionsToInsert);
        const count = await MockTestQuestion.count({ where: { section_id: sectionId } });
        await section.update({ total_questions: count });

        let totalQuestionsTest = await MockTestQuestion.count({ where: { mock_test_id: section.mock_test_id } });
        await MockTest.update({ total_questions: totalQuestionsTest }, { where: { id: section.mock_test_id } });

        res.json({ success: true, count: questionsToInsert.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
});

// Download Mock Test Sample Template
app.get('/api/admin/mock-test-sample-sheet', authenticateToken, isAdmin, (req, res) => {
    try {
        const wb = xlsx.utils.book_new();
        const wsData = [
            ['text', 'image_url', 'option_a', 'option_a_image', 'option_b', 'option_b_image', 'option_c', 'option_c_image', 'option_d', 'option_d_image', 'correct_option', 'explanation', 'explanation_image'],
            ['What is the capital of France?', '', 'Berlin', '', 'Madrid', '', 'Paris', '', 'Rome', '', 'C', 'Paris is the capital.', ''],
            ['Identify the shape', 'http://example.com/triangle.png', 'Square', '', 'Circle', '', 'Triangle', '', 'Rectangle', '', 'C', 'It has 3 sides.', '']
        ];
        const ws = xlsx.utils.aoa_to_sheet(wsData);
        xlsx.utils.book_append_sheet(wb, ws, 'Template');

        const tempFilePath = path.join(__dirname, 'uploads', 'mock_question_template.xlsx');
        if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
            fs.mkdirSync(path.join(__dirname, 'uploads'));
        }
        xlsx.writeFile(wb, tempFilePath);
        res.download(tempFilePath, 'mock_test_question_template.xlsx');
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate template' });
    }
});

// Add Single Mock Test Question Manually
app.post('/api/admin/mock-test-sections/:sectionId/questions', authenticateToken, isAdmin, async (req, res) => {
    try {
        const sectionId = req.params.sectionId;
        const section = await MockTestSection.findByPk(sectionId);
        if (!section) return res.status(404).json({ message: 'Section not found' });

        const question = await MockTestQuestion.create({
            ...req.body,
            section_id: sectionId,
            mock_test_id: section.mock_test_id
        });

        // Update counts
        const sectionCount = await MockTestQuestion.count({ where: { section_id: sectionId } });
        await section.update({ total_questions: sectionCount });
        
        const testCount = await MockTestQuestion.count({ where: { mock_test_id: section.mock_test_id } });
        await MockTest.update({ total_questions: testCount }, { where: { id: section.mock_test_id } });

        res.status(201).json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit Mock Test Question
app.put('/api/admin/mock-test-questions/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const question = await MockTestQuestion.findByPk(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });
        
        await question.update(req.body);
        res.json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Mock Test Question
app.delete('/api/admin/mock-test-questions/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const question = await MockTestQuestion.findByPk(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });
        
        const sectionId = question.section_id;
        const mockTestId = question.mock_test_id;
        
        await question.destroy();

        // Update counts
        const sectionCount = await MockTestQuestion.count({ where: { section_id: sectionId } });
        await MockTestSection.update({ total_questions: sectionCount }, { where: { id: sectionId } });
        
        const testCount = await MockTestQuestion.count({ where: { mock_test_id: mockTestId } });
        await MockTest.update({ total_questions: testCount }, { where: { id: mockTestId } });

        res.json({ message: 'Question deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- STUDENT ROUTES ---

// Get My Profile (with Class)
app.get('/api/student/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [
                { model: Class, attributes: ['id', 'name'] },
                { model: Batch, attributes: ['id', 'name'] }
            ],
            attributes: ['id', 'name', 'email', 'role', 'class_id', 'batch_id']
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Overall Rank
app.get('/api/student/rank', authenticateToken, async (req, res) => {
    try {
        const attempts = await Attempt.findAll({
            attributes: [
                'user_id',
                [sequelize.fn('SUM', sequelize.col('score')), 'totalScore'],
                [sequelize.fn('SUM', sequelize.col('correct_answers')), 'totalCorrect'],
                [sequelize.fn('SUM', sequelize.col('total_questions')), 'totalQs'],
                [sequelize.fn('SUM', sequelize.col('total_time')), 'totalTime']
            ],
            group: ['user_id'],
            raw: true
        });

        attempts.sort((a, b) => {
            // 1. Total Score (Highest first)
            if (parseFloat(b.totalScore) !== parseFloat(a.totalScore)) {
                return parseFloat(b.totalScore) - parseFloat(a.totalScore);
            }
            // 2. Accuracy (Highest first)
            const accA = a.totalQs > 0 ? a.totalCorrect / a.totalQs : 0;
            const accB = b.totalQs > 0 ? b.totalCorrect / b.totalQs : 0;
            if (accB !== accA) return accB - accA;

            // 3. Time Taken (Lower is better)
            return parseFloat(a.totalTime) - parseFloat(b.totalTime);
        });

        const index = attempts.findIndex(att => att.user_id === req.user.id);
        const rank = index !== -1 ? `#${index + 1}` : '--';

        res.json({ rank });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Available Tests (Filtered by Student's Class)
app.get('/api/student/tests', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.json([]);

        // Fetch tests assigned to user's class OR user's batch
        const tests = await Test.findAll({
            include: [
                {
                    model: Class,
                    attributes: [],
                    through: { attributes: [] }
                },
                {
                    model: Batch,
                    attributes: [],
                    through: { attributes: [] }
                }
            ],
            where: {
                [Op.or]: [
                    { '$Classes.id$': user.class_id },
                    { '$Batches.id$': user.batch_id }
                ]
            },
            attributes: ['id', 'title', 'description', 'duration_minutes', 'start_time', 'end_time']
        });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Test (Get Questions without Answers)
app.get('/api/student/test/:id/questions', authenticateToken, async (req, res) => {
    try {
        const test = await Test.findByPk(req.params.id, {
            include: [{
                model: Question,
                attributes: ['id', 'text', 'option_a', 'option_b', 'option_c', 'option_d', 'marks', 'explanation'] // Exclude correct_option and explanation for security during test
            }]
        });

        // Check timing logic here if needed (e.g., is it too early/late?)

        if (!test) return res.status(404).json({ message: 'Test not found' });
        const testData = test.toJSON();
        if (testData.Questions && testData.Questions.length > 0) {
            const seed = req.user.id + parseInt(req.params.id);
            testData.Questions = shuffleArray(testData.Questions);
        }
        res.json(testData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit Test
app.post('/api/student/submit', authenticateToken, async (req, res) => {
    const { test_id, answers, timeSpentPerQuestion } = req.body; // answers: { id: 'A' }, timeSpentPerQuestion: { id: seconds }

    try {
        // 1. Fetch real questions
        const questions = await Question.findAll({ where: { test_id } });

        let score = 0;
        let correct = 0;
        let wrong = 0;
        let totalQuestions = questions.length;

        // 2. Calculate Score
        questions.forEach(q => {
            const userAns = answers[q.id];
            if (userAns === q.correct_option) {
                score += q.marks;
                correct++;
            } else if (userAns) {
                wrong++;
            }
        });

        // 3. Save Attempt
        const user = await User.findByPk(req.user.id);
        let totalTime = 0;
        if (timeSpentPerQuestion) {
            totalTime = Object.values(timeSpentPerQuestion).reduce((a, b) => a + b, 0);
        }

        const attempt = await Attempt.create({
            user_id: req.user.id,
            test_id,
            score,
            total_questions: totalQuestions,
            correct_answers: correct,
            wrong_answers: wrong,
            answers_json: JSON.stringify(answers),
            class_id: user.class_id,
            batch_id: user.batch_id,
            total_time: totalTime
        });

        // 4. Save Time and Handle Mistakes
        if (timeSpentPerQuestion) {
            // Fetch historical average times (before this attempt)
            const avgTimes = await QuestionTime.findAll({
                attributes: ['question_id', [sequelize.fn('AVG', sequelize.col('time_spent')), 'avg_time']],
                where: { test_id },
                group: ['question_id'],
                raw: true
            });
            const avgTimeMap = {};
            avgTimes.forEach(t => avgTimeMap[t.question_id] = parseFloat(t.avg_time));

            const timeRecords = [];
            const mistakePromises = questions.map(async (q) => {
                const timeSpent = timeSpentPerQuestion[q.id] || 0;
                timeRecords.push({
                    attempt_id: attempt.id,
                    question_id: q.id,
                    time_spent: timeSpent,
                    user_id: req.user.id,
                    test_id: test_id
                });

                // Mistake Logic
                const userAns = answers[q.id];
                const isIncorrect = userAns && userAns !== q.correct_option;
                const avgTime = avgTimeMap[q.id] || 0;
                const isSlow = avgTime > 0 && timeSpent > avgTime;

                // Only treat as a mistake if it's actually incorrect
                if (isIncorrect) {
                    const [mistake, created] = await Mistake.findOrCreate({
                        where: { user_id: req.user.id, question_id: q.id, test_id },
                        defaults: {
                            is_incorrect: true,
                            is_slow: isSlow,
                            status: 'active',
                            retry_count: 0,
                            consecutive_correct_retries: 0
                        }
                    });

                    if (!created) {
                        mistake.is_incorrect = true;
                        mistake.is_slow = isSlow;
                        mistake.consecutive_correct_retries = 0;
                        mistake.status = 'active';
                        await mistake.save();
                    }
                }
            });

            await QuestionTime.bulkCreate(timeRecords);
            await Promise.all(mistakePromises);
        }

        res.json({ success: true, attempt_id: attempt.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get My Results
app.get('/api/student/results', authenticateToken, async (req, res) => {
    try {
        const attempts = await Attempt.findAll({
            where: { user_id: req.user.id },
            include: [{ model: Test, attributes: ['title'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(attempts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Specific Result Details (Review)
app.get('/api/student/result/:id', authenticateToken, async (req, res) => {
    try {
        const attempt = await Attempt.findByPk(req.params.id, {
            include: [
                {
                    model: Test,
                    include: [Question]
                },
                {
                    model: QuestionTime
                }
            ]
        });

        if (!attempt) return res.status(404).json({ message: 'Result not found' });

        if (attempt.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json(attempt);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Analytics: Get difficult questions based on average time and accuracy
app.get('/api/admin/analytics/questions/:testId', authenticateToken, isAdmin, async (req, res) => {
    try {
        const testId = req.params.testId;
        const questions = await Question.findAll({ where: { test_id: testId } });
        const timeData = await QuestionTime.findAll({ where: { test_id: testId } });
        const attempts = await Attempt.findAll({ where: { test_id: testId } });

        const analytics = questions.map(q => {
            const qTimes = timeData.filter(t => t.question_id === q.id);
            const avgTime = qTimes.length > 0 ? (qTimes.reduce((acc, curr) => acc + curr.time_spent, 0) / qTimes.length).toFixed(2) : 0;

            let correctCount = 0;
            let attemptCount = 0;

            attempts.forEach(att => {
                const answers = JSON.parse(att.answers_json || '{}');
                if (answers[q.id]) {
                    attemptCount++;
                    if (answers[q.id] === q.correct_option) {
                        correctCount++;
                    }
                }
            });

            const accuracy = attemptCount > 0 ? ((correctCount / attemptCount) * 100).toFixed(2) : 0;

            return {
                id: q.id,
                text: q.text,
                topic: q.topic,
                avgTimeSpent: parseFloat(avgTime),
                accuracy: parseFloat(accuracy),
                totalAttempts: attemptCount
            };
        });

        res.json(analytics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/student/performance', authenticateToken, async (req, res) => {
    try {
        const attempts = await Attempt.findAll({
            where: { user_id: req.user.id },
            include: [{ model: Test, attributes: ['title'] }],
            order: [['createdAt', 'DESC']]
        });

        const totalTests = attempts.length;
        const totalScore = attempts.reduce((acc, curr) => acc + curr.score, 0);
        const avgScore = totalTests > 0 ? (totalScore / totalTests).toFixed(2) : 0;

        res.json({
            attempts,
            stats: {
                totalTests,
                avgScore,
                totalScore
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- STUDENT MOCK TEST ROUTES ---

// Get Available Mock Tests
app.get('/api/student/mock-tests', authenticateToken, async (req, res) => {
    try {
        const tests = await MockTest.findAll({
            attributes: ['id', 'title', 'description', 'duration_minutes', 'exam_type', 'total_marks', 'total_questions', 'positive_marks', 'negative_marks']
        });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Mock Test Info before starting
app.get('/api/student/mock-tests/:id/info', authenticateToken, async (req, res) => {
    try {
        const test = await MockTest.findByPk(req.params.id, {
            include: [{ model: MockTestSection }]
        });
        if (!test) return res.status(404).json({ message: 'Mock Test not found' });
        res.json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Mock Test (Questions without correct answers)
app.get('/api/student/mock-tests/:id/start', authenticateToken, async (req, res) => {
    try {
        const test = await MockTest.findByPk(req.params.id, {
            include: [{
                model: MockTestSection,
                include: [{
                    model: MockTestQuestion,
                    attributes: ['id', 'text', 'image_url', 'option_a', 'option_a_image', 'option_b', 'option_b_image', 'option_c', 'option_c_image', 'option_d', 'option_d_image', 'section_id']
                }]
            }]
        });
        if (!test) return res.status(404).json({ message: 'Mock Test not found' });
        res.json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit Mock Test
app.post('/api/student/mock-tests/:id/submit', authenticateToken, async (req, res) => {
    const { answers, totalTime } = req.body;
    // answers format: { questionId: { ans: 'A', status: 'answered'|'markedReview' } }

    try {
        const testId = req.params.id;
        const test = await MockTest.findByPk(testId);
        if (!test) return res.status(404).json({ message: 'Mock Test not found' });

        const questions = await MockTestQuestion.findAll({ where: { mock_test_id: testId } });

        let score = 0;
        let correct = 0;
        let wrong = 0;
        let skipped = 0;
        let totalQs = questions.length;

        questions.forEach(q => {
            const userState = answers[q.id];
            const userAns = userState?.ans;

            if (!userAns) {
                skipped++;
            } else if (userAns === q.correct_option) {
                correct++;
                score += test.positive_marks;
            } else {
                wrong++;
                score -= test.negative_marks;
            }
        });

        score = parseFloat(score.toFixed(2));

        const attempt = await MockTestAttempt.create({
            user_id: req.user.id,
            mock_test_id: test.id,
            score,
            total_questions: totalQs,
            correct_answers: correct,
            wrong_answers: wrong,
            skipped_answers: skipped,
            answers_json: JSON.stringify(answers),
            total_time: totalTime || 0
        });

        res.json({ success: true, attempt_id: attempt.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get All Mock Test Results for Student
app.get('/api/student/mock-test-results', authenticateToken, async (req, res) => {
    try {
        const attempts = await MockTestAttempt.findAll({
            where: { user_id: req.user.id },
            include: [{ model: MockTest, attributes: ['title', 'exam_type', 'total_marks', 'total_questions', 'positive_marks'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(attempts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/student/mock-test-results/:attemptId', authenticateToken, async (req, res) => {
    try {
        const attempt = await MockTestAttempt.findByPk(req.params.attemptId, {
            include: [{
                model: MockTest,
                include: [{
                    model: MockTestSection,
                    include: [MockTestQuestion]
                }]
            }]
        });

        if (!attempt) return res.status(404).json({ message: 'Attempt not found' });
        if (attempt.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        res.json(attempt);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- RANKING / LEADERBOARD ---

app.get('/api/rankings/:testId', authenticateToken, async (req, res) => {
    try {
        const testId = req.params.testId;
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        // Fetch all attempts for this test
        const attempts = await Attempt.findAll({
            where: { test_id: testId },
            include: [{ model: User, attributes: ['id', 'name', 'batch_id', 'class_id'] }]
        });

        // Helper to calculate accuracy
        const getAccuracy = (att) => {
            const attempted = att.correct_answers + att.wrong_answers;
            return attempted > 0 ? (att.correct_answers / attempted) : 0;
        };

        // Sort logic: 
        // 1. Higher correct answers
        // 2. Higher accuracy
        // 3. Lower total_time
        const sortedAttempts = attempts.sort((a, b) => {
            if (b.correct_answers !== a.correct_answers) {
                return b.correct_answers - a.correct_answers;
            }
            const accA = getAccuracy(a);
            const accB = getAccuracy(b);
            if (accB !== accA) {
                return accB - accA;
            }
            return a.total_time - b.total_time;
        });

        // Assign Ranks
        const globalRankings = sortedAttempts.map((att, index) => ({
            rank: index + 1,
            user_id: att.user_id,
            name: att.User ? att.User.name : 'Unknown',
            score: att.score,
            correct_answers: att.correct_answers,
            accuracy: (getAccuracy(att) * 100).toFixed(2),
            time_taken: att.total_time,
            class_id: att.class_id,
            batch_id: att.batch_id
        }));

        // Filter for specific views
        const getMyRank = (list) => {
            const found = list.find(r => r.user_id === userId);
            return found ? found.rank : '-';
        };

        const overallRank = getMyRank(globalRankings);

        const classRankings = globalRankings.filter(r => r.class_id === user.class_id);
        const classRank = getMyRank(classRankings);

        const batchRankings = globalRankings.filter(r => r.batch_id === user.batch_id);
        const batchRank = getMyRank(batchRankings);

        // Top 10 lists
        res.json({
            myRanks: {
                overall: overallRank,
                class: classRank,
                batch: batchRank
            },
            leaderboard: globalRankings.slice(0, 10), // Top 10 Overall
            stats: {
                correct: globalRankings.find(r => r.user_id === userId)?.correct_answers || 0,
                accuracy: globalRankings.find(r => r.user_id === userId)?.accuracy || 0,
                time: globalRankings.find(r => r.user_id === userId)?.time_taken || 0
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start
// --- MISTAKE BOOK ROUTES ---

// Get Mistakes
app.get('/api/student/mistakes', authenticateToken, async (req, res) => {
    try {
        const { test_id, status } = req.query;
        const whereClause = {
            user_id: req.user.id,
            is_incorrect: true // Only show actual wrong answers
        };
        if (test_id) whereClause.test_id = test_id;
        if (status) whereClause.status = status;

        const mistakes = await Mistake.findAll({
            where: whereClause,
            include: [
                {
                    model: Question,
                    attributes: ['id', 'text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_option', 'explanation', 'topic', 'test_id']
                },
                {
                    model: Test,
                    attributes: ['id', 'title']
                }
            ],
            order: [['updatedAt', 'DESC']]
        });

        res.json(mistakes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bookmark Mistake (Toggle)
app.post('/api/student/mistakes/:questionId/bookmark', authenticateToken, async (req, res) => {
    try {
        const { questionId } = req.params;
        const { test_id } = req.body;

        // Ensure we handle case where user manually bookmarks a question that wasn't a mistake yet
        const [mistake, created] = await Mistake.findOrCreate({
            where: { user_id: req.user.id, question_id: questionId, test_id },
            defaults: {
                is_bookmarked: true,
                status: 'active'
            }
        });

        if (!created) {
            mistake.is_bookmarked = !mistake.is_bookmarked;
            await mistake.save();
        }

        res.json(mistake);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Retry Mistake
app.post('/api/student/mistakes/:id/retry', authenticateToken, async (req, res) => {
    try {
        const { answer } = req.body;
        const mistake = await Mistake.findByPk(req.params.id, {
            include: [Question]
        });

        if (!mistake) return res.status(404).json({ message: 'Mistake not found' });
        if (mistake.user_id !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        const isCorrect = answer === mistake.Question.correct_option;

        if (isCorrect) {
            mistake.consecutive_correct_retries += 1;
            if (mistake.consecutive_correct_retries >= 2) {
                mistake.status = 'improved';
            }
        } else {
            mistake.consecutive_correct_retries = 0;
            mistake.status = 'active';
        }

        mistake.retry_count += 1;
        await mistake.save();

        res.json({
            success: true,
            isCorrect,
            correctOption: mistake.Question.correct_option,
            explanation: mistake.Question.explanation,
            status: mistake.status
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark Revised
app.put('/api/student/mistakes/:id/revise', authenticateToken, async (req, res) => {
    try {
        const mistake = await Mistake.findByPk(req.params.id);
        if (!mistake) return res.status(404).json({ message: 'Mistake not found' });
        if (mistake.user_id !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        mistake.status = 'revised';
        await mistake.save();
        res.json(mistake);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN MISTAKE ROUTES ---

// Admin: Get Analytics (Most Common Mistakes & Batch Weakness)
app.get('/api/admin/mistakes/analytics', authenticateToken, isAdmin, async (req, res) => {
    try {
        // 1. Top Common Mistakes (Questions)
        const commonMistakes = await Mistake.findAll({
            attributes: [
                'question_id',
                [sequelize.fn('COUNT', sequelize.col('Mistake.id')), 'count']
            ],
            include: [{ model: Question, attributes: ['text', 'topic'], required: true }],
            group: ['question_id', 'Question.id'],
            order: [[sequelize.col('count'), 'DESC']],
            limit: 10
        });

        // 2. Weakness by Batch (Count of active mistakes per batch)
        const batchWeakness = await Mistake.findAll({
            where: { status: 'active' },
            include: [{
                model: User,
                attributes: ['batch_id'],
                include: [{ model: Batch, attributes: ['name'] }]
            }],
            attributes: [
                [sequelize.col('User.batch_id'), 'batch_id'],
                [sequelize.fn('COUNT', sequelize.col('Mistake.id')), 'mistake_count']
            ],
            group: ['User.batch_id', 'User.Batch.id']
        });

        res.json({
            commonQuestions: commonMistakes,
            batchWeakness: batchWeakness
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get Student Mistake Book
app.get('/api/admin/mistakes/student/:studentId', authenticateToken, isAdmin, async (req, res) => {
    try {
        const mistakes = await Mistake.findAll({
            where: { user_id: req.params.studentId },
            include: [
                {
                    model: Question,
                    attributes: ['id', 'text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_option', 'explanation', 'topic', 'test_id']
                },
                {
                    model: Test,
                    attributes: ['id', 'title']
                }
            ],
            order: [['updatedAt', 'DESC']]
        });
        res.json(mistakes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

initDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
