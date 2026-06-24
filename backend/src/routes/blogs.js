import express from 'express';
import { Blog, Book, getDbMode } from '../config/db.js';
import { generateBlog, getActiveAiProvider } from '../services/aiService.js';

const router = express.Router();

// GET /api/blogs - Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json({
      success: true,
      dbMode: getDbMode(),
      blogs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/blogs/:id - Get a specific blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    
    // Also fetch the associated book details
    const book = await Book.findById(blog.bookId);

    res.json({
      success: true,
      blog,
      book
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/blogs/generate - Trigger AI Blog Generation
router.post('/generate', async (req, res) => {
  try {
    const { bookId, bookTitle, notes, keyLessons, style } = req.body;

    if (!bookTitle) {
      return res.status(400).json({ success: false, message: 'Book title is required for generation' });
    }

    let targetBookId = bookId;

    // 1. If bookId is missing or "standalone", automatically create a Book entry
    if (!targetBookId || targetBookId === 'standalone') {
      const autoBook = await Book.create({
        title: bookTitle,
        author: req.body.bookAuthor || 'Unknown',
        notes: notes || '',
        keyLessons: keyLessons || [],
        status: 'completed', // standalone entries are assumed finished
        totalPages: 100,
        progressPages: 100,
        endDate: new Date().toISOString()
      });
      targetBookId = autoBook._id;
    } else {
      // If bookId is valid, make sure to update the book's notes & lessons with whatever the user input
      await Book.findByIdAndUpdate(targetBookId, {
        notes: notes || '',
        keyLessons: keyLessons || []
      });
    }

    // 2. Call the AI Service
    const aiOutput = await generateBlog({
      title: bookTitle,
      notes: notes || '',
      keyLessons: keyLessons || [],
      style: style || 'Casual'
    });

    // 3. Save the generated blog draft to the database
    const savedBlog = await Blog.create({
      bookId: String(targetBookId),
      title: aiOutput.title,
      style: style || 'Casual',
      content: aiOutput.content,
      introduction: aiOutput.introduction || '',
      insights: aiOutput.insights || '',
      reflections: aiOutput.reflections || '',
      conclusion: aiOutput.conclusion || '',
      linkedInPost: aiOutput.linkedInPost || '',
      twitterThread: aiOutput.twitterThread || []
    });

    res.status(201).json({
      success: true,
      aiProvider: getActiveAiProvider(),
      blog: savedBlog
    });
  } catch (error) {
    console.error('Generation Endpoint error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/blogs/:id - Update a blog (e.g. user manual edits to draft)
router.put('/:id', async (req, res) => {
  try {
    const { title, content, introduction, insights, reflections, conclusion, linkedInPost, twitterThread } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (introduction !== undefined) updateData.introduction = introduction;
    if (insights !== undefined) updateData.insights = insights;
    if (reflections !== undefined) updateData.reflections = reflections;
    if (conclusion !== undefined) updateData.conclusion = conclusion;
    if (linkedInPost !== undefined) updateData.linkedInPost = linkedInPost;
    if (twitterThread !== undefined) updateData.twitterThread = twitterThread;

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData);
    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.json({ success: true, blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/blogs/:id - Delete a blog
router.delete('/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
