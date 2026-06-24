import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb, getDbMode } from './config/db.js';
import { getActiveAiProvider } from './services/aiService.js';
import booksRouter from './routes/books.js';
import blogsRouter from './routes/blogs.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors({
  origin: '*', // Allow all origins for dev simplicity
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());

// Diagnostic status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    databaseMode: getDbMode(),
    aiProvider: getActiveAiProvider(),
    geminiKeyConfigured: !!process.env.GEMINI_API_KEY,
    openaiKeyConfigured: !!process.env.OPENAI_API_KEY
  });
});

// Register routers
app.use('/api/books', booksRouter);
app.use('/api/blogs', blogsRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred',
    error: err.message
  });
});

// Connect to Database first, then boot server
const startServer = async () => {
  try {
    await connectDb(process.env.MONGODB_URI);
    
    app.listen(PORT, () => {
      console.log(`===================================================`);
      console.log(`🚀 Book-to-Blog Backend running on: http://localhost:${PORT}`);
      console.log(`📂 DB Mode: [${getDbMode().toUpperCase()}]`);
      console.log(`🤖 AI Provider: [${getActiveAiProvider().toUpperCase()}]`);
      console.log(`===================================================`);
    });
  } catch (error) {
    console.error('Fatal: Failed to start backend server:', error);
    process.exit(1);
  }
};

startServer();
