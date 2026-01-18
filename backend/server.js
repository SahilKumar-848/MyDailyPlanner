import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || "@bdu!!@h$3cr3tk3y";

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Incoming ${req.method} request to ${req.url}`);
  next();
});

// --- UPDATED MONGODB CONNECTION ---
// Aapki Atlas Connection String yahan add kar di gayi hai
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://raheel:Badin123%40@cluster0.5p8qaoh.mongodb.net/MyDailyPlanner?retryWrites=true&w=majority&appName=Cluster0';

mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas (Cloud)!'))
  .catch(err => {
    console.error('❌ MongoDB connection error! Check your Internet or Atlas IP Whitelist.');
    console.error(err.message);
  });
// ----------------------------------

// Signup API
app.post('/signup', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email: normalizedEmail, password: hashedPassword, username });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error signing up', details: error.message });
  }
});

// Login API
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`Connected to Database: MyDailyPlanner`);
});