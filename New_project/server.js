const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const WebSocket = require('ws');
const http = require('http');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3002", "http://127.0.0.1:5500", "http://localhost:5500"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// WebSocket connection handling
wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');

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

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Successfully connected to MongoDB.");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        // Don't exit the process, just log the error
        console.log("Attempting to continue without database connection...");
    }
};

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

// Test route to check if server is running
app.get("/api/test", (req, res) => {
    res.json({ 
        message: "Backend server is running",
        dbStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
    });
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
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Email and password are required" 
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                message: "User not found" 
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ 
                message: "Invalid password" 
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("User logged in successfully:", { email });
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
            error: error.message 
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

const PORT = process.env.PORT || 5000;
const WS_PORT = 3001;

// Start the servers
server.listen(WS_PORT, () => {
    console.log(`WebSocket Server running on port ${WS_PORT}`);
});

app.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
});