import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Save, Plus, X, ArrowLeft, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

export default function BookNotesEditor({ selectedBookId, onNavigate, setSelectedBookId }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('reading');
  const [progressPages, setProgressPages] = useState(0);
  const [totalPages, setTotalPages] = useState(100);
  const [notes, setNotes] = useState('');
  const [keyLessons, setKeyLessons] = useState([]);
  const [newLesson, setNewLesson] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Load existing book data if editing
  useEffect(() => {
    if (selectedBookId) {
      fetchBookDetails();
    } else {
      // Clear form for new book
      setTitle('');
      setAuthor('');
      setStatus('reading');
      setProgressPages(0);
      setTotalPages(100);
      setNotes('');
      setKeyLessons([]);
      setError(null);
    }
  }, [selectedBookId]);

  const fetchBookDetails = async () => {
    try {
      setFetching(true);
      const res = await api.getBook(selectedBookId);
      if (res.success && res.book) {
        setTitle(res.book.title);
        setAuthor(res.book.author || '');
        setStatus(res.book.status || 'reading');
        setProgressPages(res.book.progressPages || 0);
        setTotalPages(res.book.totalPages || 100);
        setNotes(res.book.notes || '');
        setKeyLessons(res.book.keyLessons || []);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching book details:', err);
      setError('Failed to load book data.');
    } finally {
      setFetching(false);
    }
  };

  const handleAddLesson = (e) => {
    e.preventDefault();
    if (newLesson.trim()) {
      setKeyLessons([...keyLessons, newLesson.trim()]);
      setNewLesson('');
    }
  };

  const handleRemoveLesson = (index) => {
    setKeyLessons(keyLessons.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setError('Book title is required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const bookData = {
        title: title.trim(),
        author: author.trim(),
        status,
        progressPages: Number(progressPages),
        totalPages: Number(totalPages),
        notes: notes.trim(),
        keyLessons
      };

      if (selectedBookId) {
        await api.updateBook(selectedBookId, bookData);
      } else {
        const res = await api.createBook(bookData);
        if (res.success && res.book) {
          setSelectedBookId(res.book._id);
        }
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving book notes:', err);
      setError('Failed to save book notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndGenerate = async () => {
    if (!title.trim()) {
      setError('Book title is required to generate a blog.');
      return;
    }
    
    // First save the current data
    await handleSave();
    
    // Then navigate to generator
    onNavigate('generator');
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
        <p className="text-slate-400 font-medium">Fetching details from bookshelf...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Shelf
        </button>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-emerald-400 text-sm font-medium flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              ✓ Notes saved successfully
            </span>
          )}
          <button 
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-slate-800 border border-slate-700/80 hover:bg-slate-700/90 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save size={16} /> {loading ? 'Saving...' : 'Save Notes'}
          </button>
          
          <button 
            type="button"
            onClick={handleSaveAndGenerate}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-600/25 disabled:opacity-50"
          >
            Write Blog <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="glass-panel p-8 rounded-2xl space-y-8">
        
        {/* Section Header */}
        <div className="border-b border-slate-850 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <BookOpen size={22} />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {selectedBookId ? 'Edit Book Notes & Highlights' : 'Log New Book Details'}
            </h2>
          </div>
          <p className="text-slate-400 text-sm">Log your quotes, key points, and completion progress to compile your learning history.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 text-red-400 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">Error saving notes</h4>
              <p className="text-red-400/90 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Title & Author Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Book Title *</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Atomic Habits" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Author</label>
              <input 
                type="text" 
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. James Clear" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Reading Status & Page Progress Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-850 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Reading Status</label>
              <select 
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  if (e.target.value === 'completed') {
                    setProgressPages(totalPages);
                  }
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                <option value="reading">Currently Reading</option>
                <option value="completed">Completed / Finished</option>
                <option value="to-read">Plan to Read (To-Read)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Pages Read</label>
              <input 
                type="number" 
                value={progressPages}
                onChange={(e) => setProgressPages(Math.max(0, Number(e.target.value)))}
                disabled={status === 'to-read'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Total Book Pages</label>
              <input 
                type="number" 
                value={totalPages}
                onChange={(e) => setTotalPages(Math.max(1, Number(e.target.value)))}
                disabled={status === 'to-read'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Book Notes & Highlights */}
          <div className="space-y-2 border-t border-slate-850 pt-6">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-slate-300">Book Notes / Key Highlights</label>
              <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80">Markdown Supported</span>
            </div>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste quotes, memorable passages, summary points, or direct highlights from the book..." 
              rows={8}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-sans text-sm leading-relaxed"
            />
          </div>

          {/* Key Lessons Learnt (Interactive tag list) */}
          <div className="space-y-4 border-t border-slate-850 pt-6">
            <div>
              <label className="text-sm font-semibold text-slate-300 block mb-1">Key Lessons Learned</label>
              <span className="text-xs text-slate-500">Core actionable insights (will be used by AI as primary talking points for the blog).</span>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={newLesson}
                onChange={(e) => setNewLesson(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddLesson(e);
                  }
                }}
                placeholder="e.g. Identity-based habits build better systems than goal-based habits." 
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
              />
              <button 
                type="button"
                onClick={handleAddLesson}
                className="px-4 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white rounded-xl flex items-center justify-center transition-all active:scale-95"
              >
                <Plus size={20} />
              </button>
            </div>

            {keyLessons.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No specific lessons logged yet. Add one to guide the blog output.</p>
            ) : (
              <div className="space-y-2">
                {keyLessons.map((lesson, idx) => (
                  <div 
                    key={idx}
                    className="flex justify-between items-center bg-slate-950 border border-slate-800/80 px-4 py-3 rounded-xl gap-4 text-sm"
                  >
                    <span className="text-slate-300 font-medium">
                      <span className="text-indigo-400 mr-2">#{idx + 1}</span> {lesson}
                    </span>
                    <button 
                      type="button"
                      onClick={() => handleRemoveLesson(idx)}
                      className="p-1 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}
