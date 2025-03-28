const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const WebSocket = require('ws');
const http = require('http');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3002", "http://127.0.0.1:5500", "http://localhost:5500"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/public', express.static(path.join(__dirname, 'public')));

// WebSocket connection handling
wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');

    // Set a ping interval to keep the connection alive
    const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        }
    }, 30000); // Ping every 30 seconds

    // Send a welcome message
    ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to WebSocket server'
    }));

    // Handle incoming messages
    ws.on('message', (message) => {
        console.log('Received:', message.toString());
        
        // Echo the message back
        ws.send(JSON.stringify({
            type: 'message',
            message: message.toString()
        }));
    });

    // Handle client disconnect
    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(pingInterval);
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clearInterval(pingInterval);
    });
});

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Successfully connected to MongoDB.");
        console.log("Database URL:", process.env.MONGODB_URI);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        console.log("Please make sure MongoDB is running on your system");
        console.log("Connection URL being used:", process.env.MONGODB_URI);
    }
};

// Test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        res.json({
            status: 'success',
            database: states[dbState],
            mongodb_uri: process.env.MONGODB_URI
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

connectDB();

// Define User Schema if not already defined in models/User.js
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Test route to check if server is running
app.get('/api/test', async (req, res) => {
    try {
        // Check MongoDB connection
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        res.json({
            message: 'Server is running',
            dbStatus: dbStatus
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});

// Signup endpoint
app.post("/api/auth/signup", async (req, res) => {
    console.log("Signup request received:", req.body);
    const { username, email, password } = req.body;

    try {
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: "All fields are required" 
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: "User already exists" 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword 
        });
        await newUser.save();

        // Create JWT token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("User created successfully:", { username, email });
        res.status(201).json({ 
            message: "Signup successful",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ 
            message: "Signup failed", 
            error: error.message 
        });
    }
});

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
    console.log("Login request received:", { email: req.body.email });
    const { email, password } = req.body;

    try {
        // Check database connection first
        if (mongoose.connection.readyState !== 1) {
            console.error("Database not connected");
            return res.status(500).json({
                message: "Database connection error",
                details: "MongoDB is not connected"
            });
        }

        // Validate input
        if (!email || !password) {
            console.log("Missing credentials:", { email: !!email, password: !!password });
            return res.status(400).json({ 
                message: "Email and password are required",
                details: "Both email and password must be provided"
            });
        }

        // Find user
        const user = await User.findOne({ email });
        console.log("User lookup result:", { found: !!user, email });

        if (!user) {
            console.log("User not found:", { email });
            return res.status(400).json({ 
                message: "Login failed",
                details: "Invalid email or password"
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log("Password verification:", { isValid: isValidPassword });

        if (!isValidPassword) {
            console.log("Invalid password for user:", { email });
            return res.status(400).json({ 
                message: "Login failed",
                details: "Invalid email or password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("Login successful:", { email, userId: user._id });
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            message: "Login failed", 
            error: error.message,
            details: "An unexpected error occurred"
        });
    }
});

// Protected profile endpoint
app.get("/api/auth/profile", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ 
                message: "No token provided" 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        res.json(user);
    } catch (error) {
        console.error("Profile error:", error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: "Invalid token" 
            });
        }
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
});

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Ensure uploads directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function(req, file, cb) {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type. Allowed types: PDF, DOC, DOCX, TXT, XLS, XLSX. Received: ${file.mimetype}`));
        }
    }
}).single('file'); // Changed to single file upload

// Course Schema
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    duration: { type: Number, required: true },
    materials: [{ type: String }],
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', courseSchema);

// Document Schema
const documentSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Document = mongoose.model('Document', documentSchema);

// Course upload endpoint with error handling
app.post('/api/courses', authenticateToken, upload.array('materials', 5), async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Files:', req.files);

        const { title, description, category, subcategory, duration } = req.body;

        // Validate required fields
        if (!title || !description || !category || !subcategory || !duration) {
            console.error('Missing required fields:', { title, description, category, subcategory, duration });
            return res.status(400).json({ 
                message: 'All fields are required',
                missing: Object.entries({ title, description, category, subcategory, duration })
                    .filter(([_, value]) => !value)
                    .map(([key]) => key)
            });
        }

        // Process uploaded files
        const materialPaths = req.files ? req.files.map(file => '/public/uploads/materials/' + file.filename) : [];

        const course = new Course({
            title,
            description,
            category,
            subcategory,
            duration: parseInt(duration),
            materials: materialPaths,
            instructor: req.user.userId
        });

        console.log('Creating course:', course);
        await course.save();

        // Handle uploaded files
        if (req.files && req.files.length > 0) {
            const documentPromises = req.files.map(file => {
                const document = new Document({
                    filename: file.filename,
                    originalName: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                    userId: req.user.id
                });
                return document.save();
            });

            await Promise.all(documentPromises);
        }

        res.status(201).json({
            message: 'Course created successfully',
            course: course
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ 
            message: 'Error creating course',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Get courses endpoint
app.get('/api/courses/:category?', async (req, res) => {
    try {
        const { category } = req.params;
        const { subject } = req.query;

        let query = {};
        if (category) {
            query.category = category;
        }
        if (subject) {
            query.subject = subject;
        }

        const courses = await Course.find(query).populate('instructor', 'username');
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Error fetching courses' });
    }
});

// Get single course endpoint
app.get('/api/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate({
                path: 'instructor',
                select: 'username email'
            });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // If instructor is not found, provide default values
        if (!course.instructor) {
            course.instructor = {
                username: 'Unknown Instructor',
                email: ''
            };
        }

        res.json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Error fetching course details' });
    }
});

// Document endpoints
app.post('/api/documents', authenticateToken, (req, res) => {
    upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            return res.status(400).json({ 
                message: 'File upload error',
                error: err.message
            });
        } else if (err) {
            // An unknown error occurred
            return res.status(400).json({ 
                message: 'Invalid file type or upload error',
                error: err.message
            });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const document = new Document({
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                userId: req.user.userId
            });

            await document.save();
            res.status(201).json({
                message: 'Document uploaded successfully',
                document: {
                    id: document._id,
                    filename: document.filename,
                    originalName: document.originalName,
                    uploadDate: document.uploadDate,
                    size: document.size,
                    mimetype: document.mimetype
                }
            });
        } catch (error) {
            console.error('Document upload error:', error);
            res.status(500).json({ 
                message: 'Error saving document to database',
                error: error.message
            });
        }
    });
});

app.get('/api/documents', authenticateToken, async (req, res) => {
    try {
        const documents = await Document.find({ userId: req.user.userId })
            .sort({ uploadDate: -1 });
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ message: 'Error fetching documents' });
    }
});

app.delete('/api/documents/:id', authenticateToken, async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Delete file from filesystem
        const filePath = path.join(__dirname, 'uploads', document.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Document.deleteOne({ _id: req.params.id });
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Error deleting document' });
    }
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enrollment Schema
const enrollmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'dropped'],
        default: 'active'
    }
});

// Create a compound unique index to prevent duplicate enrollments
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// Course enrollment endpoint
app.post('/api/courses/:id/enroll', authenticateToken, async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.userId;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is already enrolled
        const existingEnrollment = await Enrollment.findOne({ userId, courseId });
        if (existingEnrollment) {
            return res.status(400).json({ message: 'You are already enrolled in this course' });
        }

        // Create new enrollment
        const enrollment = new Enrollment({
            userId,
            courseId
        });

        await enrollment.save();

        res.status(201).json({
            message: 'Successfully enrolled in course',
            enrollment: {
                id: enrollment._id,
                courseTitle: course.title,
                enrollmentDate: enrollment.enrollmentDate,
                status: enrollment.status
            }
        });
    } catch (error) {
        console.error('Enrollment error:', error);
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'You are already enrolled in this course' });
        }
        res.status(500).json({ message: 'Error enrolling in course', error: error.message });
    }
});

// Get user's enrolled courses
app.get('/api/enrollments', authenticateToken, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ userId: req.user.userId })
            .populate('courseId')
            .sort({ enrollmentDate: -1 });

        res.json(enrollments.map(enrollment => ({
            id: enrollment._id,
            course: enrollment.courseId,
            enrollmentDate: enrollment.enrollmentDate,
            status: enrollment.status
        })));
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        res.status(500).json({ message: 'Error fetching enrollments' });
    }
});

const PORT = process.env.PORT || 5000;
const WS_PORT = 3001;

// Start the servers
server.listen(WS_PORT, () => {
    console.log(`WebSocket Server running on port ${WS_PORT}`);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use. Please try a different port or stop the existing server.`);
    } else {
        console.error('Server error:', err);
    }
});