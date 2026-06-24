import express from 'express';
import { Book, Blog, getDbMode } from '../config/db.js';

const router = express.Router();

// GET /api/books - Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json({
      success: true,
      dbMode: getDbMode(),
      books
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/books/stats - Calculate reading statistics & timeline events
router.get('/stats', async (req, res) => {
  try {
    const books = await Book.find();
    const blogs = await Blog.find();

    const totalBooks = books.length;
    const completedBooks = books.filter(b => b.status === 'completed').length;
    const activeBooks = books.filter(b => b.status === 'reading').length;
    const toReadBooks = books.filter(b => b.status === 'to-read').length;

    // Calculate total pages read vs total pages
    let totalPagesRead = 0;
    let totalBookPages = 0;
    books.forEach(b => {
      totalPagesRead += b.progressPages || 0;
      totalBookPages += b.totalPages || 0;
    });

    // Construct Timeline Events dynamically
    const timelineEvents = [];

    books.forEach(book => {
      // 1. Started event
      if (book.startDate) {
        timelineEvents.push({
          type: 'book_started',
          date: book.startDate,
          title: `Started reading "${book.title}"`,
          description: book.author ? `by ${book.author}` : 'Began your reading journey',
          referenceId: book._id
        });
      }

      // 2. Completed event
      if (book.status === 'completed' && book.endDate) {
        timelineEvents.push({
          type: 'book_completed',
          date: book.endDate,
          title: `Finished reading "${book.title}"`,
          description: `Completed the book and logged insights.`,
          referenceId: book._id
        });
      }
    });

    // 3. Blog generated events
    blogs.forEach(blog => {
      const book = books.find(b => String(b._id) === String(blog.bookId));
      timelineEvents.push({
        type: 'blog_generated',
        date: blog.createdAt,
        title: `Published blog: "${blog.title}"`,
        description: book ? `Transformed notes from "${book.title}"` : 'Converted notes to blog',
        referenceId: blog._id
      });
    });

    // Sort timeline events: newest first
    timelineEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      stats: {
        totalBooks,
        completedBooks,
        activeBooks,
        toReadBooks,
        totalBlogsGenerated: blogs.length,
        totalPagesRead,
        totalBookPages,
        completionRate: totalBooks > 0 ? Math.round((completedBooks / totalBooks) * 100) : 0
      },
      timeline: timelineEvents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/books/:id - Get a specific book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    
    // Fetch associated blogs for this book
    const blogs = await Blog.find({ bookId: book._id });

    res.json({
      success: true,
      book,
      blogs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/books - Create a book
router.post('/', async (req, res) => {
  try {
    const { title, author, totalPages, progressPages, status, startDate } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, message: 'Book title is required' });
    }

    const bookData = {
      title,
      author: author || '',
      totalPages: totalPages || 1,
      progressPages: progressPages || 0,
      status: status || 'reading',
      startDate: startDate || new Date().toISOString()
    };

    if (bookData.status === 'completed') {
      bookData.endDate = new Date().toISOString();
      bookData.progressPages = bookData.totalPages; // match progress pages on complete
    }

    const newBook = await Book.create(bookData);
    res.status(201).json({ success: true, book: newBook });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/books/:id - Update a book
router.put('/:id', async (req, res) => {
  try {
    const { title, author, notes, keyLessons, status, progressPages, totalPages } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (notes !== undefined) updateData.notes = notes;
    if (keyLessons !== undefined) updateData.keyLessons = keyLessons;
    if (status !== undefined) updateData.status = status;
    if (progressPages !== undefined) updateData.progressPages = Number(progressPages);
    if (totalPages !== undefined) updateData.totalPages = Number(totalPages);

    // Auto-adjust progress pages if marked complete
    if (status === 'completed') {
      updateData.progressPages = totalPages !== undefined ? Number(totalPages) : undefined;
      updateData.endDate = new Date().toISOString();
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData);
    if (!updatedBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.json({ success: true, book: updatedBook });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/books/:id - Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, message: 'Book and its generated blogs deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
