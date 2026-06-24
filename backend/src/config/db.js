import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database mode tracker
let dbMode = 'json'; // default to JSON file DB
let mongooseModels = {};

// Local JSON File DB Config
const JSON_DB_DIR = path.join(__dirname, '..', '..', 'data');
const JSON_DB_PATH = path.join(JSON_DB_DIR, 'db.json');

// Ensure JSON DB directory and file exist
async function initJsonDb() {
  try {
    await fs.mkdir(JSON_DB_DIR, { recursive: true });
    try {
      await fs.access(JSON_DB_PATH);
    } catch {
      // Create empty DB file if not exists
      await fs.writeFile(JSON_DB_PATH, JSON.stringify({ books: [], blogs: [] }, null, 2));
    }
  } catch (error) {
    console.error('Failed to initialize JSON Database folder:', error);
  }
}

// Read JSON DB file
async function readJsonDb() {
  await initJsonDb();
  try {
    const data = await fs.readFile(JSON_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON DB file, returning empty state:', error);
    return { books: [], blogs: [] };
  }
}

// Write JSON DB file
async function writeJsonDb(data) {
  await initJsonDb();
  try {
    await fs.writeFile(JSON_DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing JSON DB file:', error);
  }
}

// Define Mongoose Schemas
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, default: '' },
  notes: { type: String, default: '' },
  keyLessons: { type: [String], default: [] },
  status: { type: String, enum: ['reading', 'completed', 'to-read'], default: 'reading' },
  progressPages: { type: Number, default: 0 },
  totalPages: { type: Number, default: 1 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
  bookId: { type: String, required: true }, // Store as string to support both mongo _id and JSON string ids
  title: { type: String, required: true },
  style: { type: String, required: true },
  content: { type: String, required: true }, // Markdown formatted blog
  introduction: { type: String, default: '' },
  insights: { type: String, default: '' },
  reflections: { type: String, default: '' },
  conclusion: { type: String, default: '' },
  linkedInPost: { type: String, default: '' },
  twitterThread: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

// Setup Database Connection
export async function connectDb(uri) {
  if (!uri) {
    console.log('⚠️  No MONGODB_URI configured. Running in Local JSON Database Mode.');
    dbMode = 'json';
    await initJsonDb();
    return;
  }

  try {
    // Attempt Mongoose connection with a short 3-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('✅ Connected to MongoDB successfully.');
    dbMode = 'mongodb';
    
    // Register Models
    mongooseModels.Book = mongoose.model('Book', bookSchema);
    mongooseModels.Blog = mongoose.model('Blog', blogSchema);
  } catch (error) {
    console.warn('❌ MongoDB connection failed. Falling back to Local JSON Database Mode.\nError details:', error.message);
    dbMode = 'json';
    await initJsonDb();
  }
}

// Unified Database CRUD Interfaces
export const Book = {
  find: async (query = {}) => {
    if (dbMode === 'mongodb') {
      return mongooseModels.Book.find(query).sort({ createdAt: -1 });
    } else {
      const db = await readJsonDb();
      let results = [...db.books];
      // Simple exact-match query filter if provided
      for (const key in query) {
        results = results.filter(item => String(item[key]) === String(query[key]));
      }
      // Sort newest first
      return results.reverse();
    }
  },

  findById: async (id) => {
    if (dbMode === 'mongodb') {
      return mongooseModels.Book.findById(id);
    } else {
      const db = await readJsonDb();
      return db.books.find(item => String(item._id) === String(id)) || null;
    }
  },

  create: async (data) => {
    if (dbMode === 'mongodb') {
      const newBook = new mongooseModels.Book(data);
      return newBook.save();
    } else {
      const db = await readJsonDb();
      const newBook = {
        _id: `book_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        author: '',
        notes: '',
        keyLessons: [],
        status: 'reading',
        progressPages: 0,
        totalPages: 1,
        startDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        ...data
      };
      db.books.push(newBook);
      await writeJsonDb(db);
      return newBook;
    }
  },

  findByIdAndUpdate: async (id, data, options = {}) => {
    if (dbMode === 'mongodb') {
      return mongooseModels.Book.findByIdAndUpdate(id, data, { new: true, ...options });
    } else {
      const db = await readJsonDb();
      const index = db.books.findIndex(item => String(item._id) === String(id));
      if (index === -1) return null;
      
      const updatedBook = {
        ...db.books[index],
        ...data,
        // If status changed to completed, set endDate if not set
        endDate: data.status === 'completed' ? (data.endDate || new Date().toISOString()) : db.books[index].endDate
      };
      
      db.books[index] = updatedBook;
      await writeJsonDb(db);
      return updatedBook;
    }
  },

  findByIdAndDelete: async (id) => {
    if (dbMode === 'mongodb') {
      const result = await mongooseModels.Book.findByIdAndDelete(id);
      // Clean up associated blogs
      if (result) {
        await mongooseModels.Blog.deleteMany({ bookId: id });
      }
      return result;
    } else {
      const db = await readJsonDb();
      const initialCount = db.books.length;
      db.books = db.books.filter(item => String(item._id) !== String(id));
      
      // Clean up associated blogs
      db.blogs = db.blogs.filter(item => String(item.bookId) !== String(id));
      
      await writeJsonDb(db);
      return db.books.length < initialCount ? { _id: id } : null;
    }
  }
};

export const Blog = {
  find: async (query = {}) => {
    if (dbMode === 'mongodb') {
      return mongooseModels.Blog.find(query).sort({ createdAt: -1 });
    } else {
      const db = await readJsonDb();
      let results = [...db.blogs];
      for (const key in query) {
        results = results.filter(item => String(item[key]) === String(query[key]));
      }
      return results.reverse();
    }
  },

  findById: async (id) => {
    if (dbMode === 'mongodb') {
      return mongooseModels.Blog.findById(id);
    } else {
      const db = await readJsonDb();
      return db.blogs.find(item => String(item._id) === String(id)) || null;
    }
  },

  create: async (data) => {
    if (dbMode === 'mongodb') {
      const newBlog = new mongooseModels.Blog(data);
      return newBlog.save();
    } else {
      const db = await readJsonDb();
      const newBlog = {
        _id: `blog_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        introduction: '',
        insights: '',
        reflections: '',
        conclusion: '',
        linkedInPost: '',
        twitterThread: [],
        createdAt: new Date().toISOString(),
        ...data
      };
      db.blogs.push(newBlog);
      await writeJsonDb(db);
      return newBlog;
    }
  },

  findByIdAndUpdate: async (id, data, options = {}) => {
    if (dbMode === 'mongodb') {
      return mongooseModels.Blog.findByIdAndUpdate(id, data, { new: true, ...options });
    } else {
      const db = await readJsonDb();
      const index = db.blogs.findIndex(item => String(item._id) === String(id));
      if (index === -1) return null;
      
      const updatedBlog = {
        ...db.blogs[index],
        ...data
      };
      db.blogs[index] = updatedBlog;
      await writeJsonDb(db);
      return updatedBlog;
    }
  },

  findByIdAndDelete: async (id) => {
    if (dbMode === 'mongodb') {
      return mongooseModels.Blog.findByIdAndDelete(id);
    } else {
      const db = await readJsonDb();
      const initialCount = db.blogs.length;
      db.blogs = db.blogs.filter(item => String(item._id) !== String(id));
      await writeJsonDb(db);
      return db.blogs.length < initialCount ? { _id: id } : null;
    }
  }
};

export function getDbMode() {
  return dbMode;
}
