import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../utils/api';
import { 
  Search, BookOpen, FileText, CheckCircle2, 
  Trash2, Copy, Download, X, Calendar, ArrowRight,
  TrendingUp, Compass, Award
} from 'lucide-react';

export default function KnowledgeBase({ onNavigate, setSelectedBookId }) {
  const [books, setBooks] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, books, blogs
  
  // Modal states for deep-viewing
  const [selectedItem, setSelectedItem] = useState(null); // { type: 'book'|'blog', data: obj }
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchArchiveData();
  }, []);

  const fetchArchiveData = async () => {
    try {
      setLoading(true);
      const booksRes = await api.getBooks();
      const blogsRes = await api.getBlogs();
      
      if (booksRes.success) setBooks(booksRes.books);
      if (blogsRes.success) setBlogs(blogsRes.blogs);
      setError(null);
    } catch (err) {
      console.error('Error fetching archive:', err);
      setError('Could not retrieve knowledge archive.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenItem = (type, data) => {
    setSelectedItem({ type, data });
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setCopySuccess(false);
  };

  const handleCopyContent = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownloadMarkdown = (title, content) => {
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDeleteItem = async (e, type, id) => {
    e.stopPropagation();
    const itemLabel = type === 'book' ? 'book and its blogs' : 'blog draft';
    if (window.confirm(`Are you sure you want to delete this ${itemLabel}?`)) {
      try {
        if (type === 'book') {
          await api.deleteBook(id);
        } else {
          await api.deleteBlog(id);
        }
        handleCloseModal();
        fetchArchiveData(); // Reload list
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  const handleEditNotes = (bookId) => {
    setSelectedBookId(bookId);
    onNavigate('editor');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Search logic filtering
  const filteredBooks = books.filter(book => {
    const term = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(term) ||
      (book.author && book.author.toLowerCase().includes(term)) ||
      (book.notes && book.notes.toLowerCase().includes(term)) ||
      book.keyLessons.some(l => l.toLowerCase().includes(term))
    );
  });

  const filteredBlogs = blogs.filter(blog => {
    const term = searchQuery.toLowerCase();
    const associatedBook = books.find(b => String(b._id) === String(blog.bookId));
    const bookTitle = associatedBook ? associatedBook.title.toLowerCase() : '';
    
    return (
      blog.title.toLowerCase().includes(term) ||
      bookTitle.includes(term) ||
      blog.content.toLowerCase().includes(term)
    );
  });

  // Interleave and sort to show unified archive items if 'all' is selected
  const unifiedArchive = [];
  if (filterType === 'all' || filterType === 'books') {
    filteredBooks.forEach(b => unifiedArchive.push({ type: 'book', date: b.createdAt || b.startDate, data: b }));
  }
  if (filterType === 'all' || filterType === 'blogs') {
    filteredBlogs.forEach(b => unifiedArchive.push({ type: 'blog', date: b.createdAt, data: b }));
  }
  // Sort newest first
  unifiedArchive.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
        <p className="text-slate-400 font-medium">Opening your digital knowledge vaults...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-white mb-2 bg-gradient-to-r from-indigo-200 via-indigo-100 to-purple-200 bg-clip-text text-transparent">
          Personal Knowledge Base
        </h1>
        <p className="text-slate-400">Search and access your reading notes database, summaries, and generated drafts in one portal.</p>
      </div>

      {/* Control panel: Search & Filter Tabs */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, book titles, lessons, or content..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filters Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 shrink-0">
          <button 
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              filterType === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Archives ({unifiedArchive.length})
          </button>
          <button 
            onClick={() => setFilterType('books')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              filterType === 'books' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Book Logs ({filteredBooks.length})
          </button>
          <button 
            onClick={() => setFilterType('blogs')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              filterType === 'blogs' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Blog Articles ({filteredBlogs.length})
          </button>
        </div>
      </div>

      {/* Archive Grid */}
      {unifiedArchive.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border-dashed border-slate-800">
          <Compass size={44} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-300 mb-1">No matching entries found</h3>
          <p className="text-slate-500 max-w-sm mx-auto text-sm">Clear your search filter or add content to populate the digital vault.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unifiedArchive.map((item, idx) => {
            const isBook = item.type === 'book';
            
            if (isBook) {
              const book = item.data;
              return (
                <div 
                  key={`book_${book._id}_${idx}`}
                  onClick={() => handleOpenItem('book', book)}
                  className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                        <BookOpen size={10} /> Book Log
                      </span>
                      <span className="text-[10px] text-slate-500">{formatDate(book.startDate)}</span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-lg text-white mb-0.5 line-clamp-1">{book.title}</h3>
                      <p className="text-xs text-slate-400">{book.author ? `by ${book.author}` : 'Unknown Author'}</p>
                    </div>

                    <div className="flex gap-2">
                      <span className="bg-slate-950 px-2.5 py-1 border border-slate-850 rounded-md text-[10px] text-slate-400 font-semibold">
                        {book.keyLessons?.length || 0} Lessons
                      </span>
                      <span className="bg-slate-950 px-2.5 py-1 border border-slate-850 rounded-md text-[10px] text-slate-400 font-semibold capitalize">
                        Status: {book.status}
                      </span>
                    </div>

                    {book.notes ? (
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed italic bg-slate-950/20 p-2.5 rounded border border-slate-900">
                        "{book.notes}"
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No notes logged.</p>
                    )}
                  </div>
                  
                  <div className="border-t border-slate-850 mt-5 pt-4 flex justify-between items-center text-xs text-indigo-400 font-bold">
                    <span>View Highlights</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            } else {
              const blog = item.data;
              const parentBook = books.find(b => String(b._id) === String(blog.bookId));

              return (
                <div 
                  key={`blog_${blog._id}_${idx}`}
                  onClick={() => handleOpenItem('blog', blog)}
                  className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                        <FileText size={10} /> Blog Draft
                      </span>
                      <span className="text-[10px] text-slate-500">{formatDate(blog.createdAt)}</span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-lg text-white mb-0.5 line-clamp-1">{blog.title}</h3>
                      <p className="text-xs text-slate-400">
                        Source: {parentBook ? parentBook.title : 'Standalone Draft'}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span className="bg-slate-950 px-2.5 py-1 border border-slate-850 rounded-md text-[10px] text-slate-400 font-semibold capitalize">
                        Style: {blog.style || 'Casual'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {blog.introduction || blog.content?.substring(0, 150) + '...'}
                    </p>
                  </div>
                  
                  <div className="border-t border-slate-850 mt-5 pt-4 flex justify-between items-center text-xs text-purple-400 font-bold">
                    <span>Read Article</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}

      {/* DETAIL MODAL OVERLAY */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col animate-slide-up shadow-2xl overflow-hidden border border-slate-800">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-850 flex justify-between items-start">
              <div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mb-1.5 inline-block ${
                  selectedItem.type === 'book' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-purple-500/10 text-purple-400'
                }`}>
                  {selectedItem.type === 'book' ? 'Book Library Item' : 'AI Blog Draft'}
                </span>
                <h2 className="text-2xl font-bold text-white leading-tight">
                  {selectedItem.type === 'book' ? selectedItem.data.title : selectedItem.data.title}
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  {selectedItem.type === 'book' 
                    ? (selectedItem.data.author ? `by ${selectedItem.data.author}` : '')
                    : `Generated Style: ${selectedItem.data.style}`
                  }
                </p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Content (Scrollable) */}
            <div className="p-8 overflow-y-auto flex-1 select-text">
              {selectedItem.type === 'book' ? (
                /* BOOK DETAILS VIEW */
                <div className="space-y-6">
                  {/* Progress & Meta details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-4 border border-slate-850 rounded-xl text-sm text-slate-300">
                    <div className="space-y-2">
                      <div className="text-xs text-slate-500">Reading Status</div>
                      <div className="font-bold flex items-center gap-1.5 capitalize">
                        {selectedItem.data.status === 'completed' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Calendar size={16} className="text-indigo-400" />}
                        {selectedItem.data.status}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-slate-500">Pages Progress</div>
                      <div className="font-bold">{selectedItem.data.progressPages} of {selectedItem.data.totalPages} pages</div>
                    </div>
                  </div>

                  {/* Highlights notes */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Book Highlights</h3>
                    {selectedItem.data.notes ? (
                      <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl text-sm leading-relaxed text-slate-200 whitespace-pre-wrap font-sans italic">
                        "{selectedItem.data.notes}"
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No notes logged for this book.</p>
                    )}
                  </div>

                  {/* Key lessons */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Key Takeaways ({selectedItem.data.keyLessons?.length || 0})</h3>
                    {selectedItem.data.keyLessons?.length > 0 ? (
                      <div className="space-y-2">
                        {selectedItem.data.keyLessons.map((lesson, idx) => (
                          <div key={idx} className="bg-slate-950/20 border border-slate-900 p-3 rounded-lg text-sm text-slate-300">
                            <span className="text-indigo-400 font-bold mr-2">#{idx + 1}</span> {lesson}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No specific lessons logged yet.</p>
                    )}
                  </div>
                </div>
              ) : (
                /* BLOG DETAILS VIEW */
                <div className="space-y-6">
                  {/* Blog Prose Markdown Render */}
                  <div className="blog-prose border border-slate-850/50 bg-slate-950/10 p-6 rounded-xl">
                    <ReactMarkdown>{selectedItem.data.content}</ReactMarkdown>
                  </div>

                  {/* Social media content preview panels */}
                  {(selectedItem.data.linkedInPost || (selectedItem.data.twitterThread && selectedItem.data.twitterThread.length > 0)) && (
                    <div className="border-t border-slate-850 pt-6 space-y-6">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Associated Social Media Assets</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedItem.data.linkedInPost && (
                          <div className="bg-slate-950 border border-slate-855 rounded-xl p-4 space-y-2">
                            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                              <span className="text-[10px] font-bold text-indigo-400">LinkedIn Summary</span>
                              <button 
                                onClick={() => handleCopyContent(selectedItem.data.linkedInPost)}
                                className="text-[10px] font-bold text-slate-500 hover:text-white"
                              >
                                Copy
                              </button>
                            </div>
                            <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                              {selectedItem.data.linkedInPost}
                            </p>
                          </div>
                        )}

                        {selectedItem.data.twitterThread?.length > 0 && (
                          <div className="bg-slate-950 border border-slate-855 rounded-xl p-4 space-y-3">
                            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                              <span className="text-[10px] font-bold text-sky-400">Twitter Thread</span>
                              <button 
                                onClick={() => handleCopyContent(selectedItem.data.twitterThread.join('\n\n'))}
                                className="text-[10px] font-bold text-slate-500 hover:text-white"
                              >
                                Copy All
                              </button>
                            </div>
                            <div className="space-y-3 overflow-y-auto max-h-48 pr-1">
                              {selectedItem.data.twitterThread.map((tweet, idx) => (
                                <div key={idx} className="border-l border-slate-800 pl-3 py-1 text-xs text-slate-400 leading-relaxed">
                                  <div className="text-[10px] text-indigo-400/80 mb-0.5">Tweet {idx + 1}</div>
                                  {tweet}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-850 bg-slate-950/50 flex justify-between items-center">
              <div>
                <button 
                  onClick={(e) => handleDeleteItem(e, selectedItem.type, selectedItem.data._id)}
                  className="px-4 py-2 hover:bg-red-500/10 text-xs font-semibold text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                >
                  Delete Entry
                </button>
              </div>

              <div className="flex items-center gap-3">
                {selectedItem.type === 'book' ? (
                  <button 
                    onClick={() => handleEditNotes(selectedItem.data._id)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all active:scale-95 flex items-center gap-1.5 shadow"
                  >
                    Edit Log Notes <ArrowRight size={14} />
                  </button>
                ) : (
                  <>
                    {copySuccess && (
                      <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                        Copied to Clipboard
                      </span>
                    )}
                    <button 
                      onClick={() => handleCopyContent(selectedItem.data.content)}
                      className="px-4 py-2 border border-slate-800 hover:bg-slate-900 text-xs font-bold text-slate-300 hover:text-white rounded-lg transition-all"
                    >
                      Copy Markdown
                    </button>
                    <button 
                      onClick={() => handleDownloadMarkdown(selectedItem.data.title, selectedItem.data.content)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
                    >
                      <Download size={14} /> Export .md
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
