import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { BookOpen, Award, FileText, CheckCircle, Clock, BookMarked, Trash2, ArrowRight } from 'lucide-react';

export default function Dashboard({ onNavigate, setSelectedBookId }) {
  const [stats, setStats] = useState({
    totalBooks: 0,
    completedBooks: 0,
    activeBooks: 0,
    toReadBooks: 0,
    totalBlogsGenerated: 0,
    totalPagesRead: 0,
    totalBookPages: 0,
    completionRate: 0
  });
  const [timeline, setTimeline] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await api.getStats();
      const booksRes = await api.getBooks();
      
      if (statsRes.success) {
        setStats(statsRes.stats);
        setTimeline(statsRes.timeline);
      }
      if (booksRes.success) {
        setBooks(booksRes.books);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this book? This will also delete any generated blogs associated with it.')) {
      try {
        await api.deleteBook(id);
        fetchDashboardData(); // Refresh list & stats
      } catch (err) {
        alert('Failed to delete book');
      }
    }
  };

  const handleStartNotes = (bookId) => {
    setSelectedBookId(bookId);
    onNavigate('editor');
  };

  const handleGenerateBlog = (bookId) => {
    setSelectedBookId(bookId);
    onNavigate('generator');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1"><CheckCircle size={12} /> Read</span>;
      case 'reading':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1"><Clock size={12} /> Reading</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20 flex items-center gap-1"><BookMarked size={12} /> To Read</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
        <p className="text-slate-400 font-medium">Analyzing your reading library...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 rounded-xl max-w-xl mx-auto mt-12 text-center border-red-500/20">
        <div className="text-red-400 text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold mb-2">Connection Failure</h3>
        <p className="text-slate-400 mb-6">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white rounded-lg font-medium shadow-lg shadow-indigo-600/20"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-white mb-2 bg-gradient-to-r from-indigo-200 via-indigo-100 to-purple-200 bg-clip-text text-transparent">
          Reading Journey
        </h1>
        <p className="text-slate-400">Track your knowledge archive and convert lessons into medium-ready posts.</p>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden transition-all hover:border-slate-700/80">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-8 -mt-8"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
              <BookOpen size={24} />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">Total Books</span>
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">{stats.totalBooks}</div>
          <div className="text-xs text-slate-500 flex gap-2">
            <span>{stats.completedBooks} read</span>
            <span>•</span>
            <span>{stats.activeBooks} active</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden transition-all hover:border-slate-700/80">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-8 -mt-8"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Award size={24} />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">Completion</span>
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">{stats.completionRate}%</div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden transition-all hover:border-slate-700/80">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-8 -mt-8"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
              <BookMarked size={24} />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">Pages Read</span>
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">{stats.totalPagesRead.toLocaleString()}</div>
          <div className="text-xs text-slate-500">
            Out of {stats.totalBookPages.toLocaleString()} total library pages
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden transition-all hover:border-slate-700/80">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -mr-8 -mt-8"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
              <FileText size={24} />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">Blogs Written</span>
          </div>
          <div className="text-3xl font-extrabold text-white mb-1">{stats.totalBlogsGenerated}</div>
          <div className="text-xs text-slate-500">
            Drafts optimized for publishing
          </div>
        </div>
      </div>

      {/* Main Grid: Books Shelf & Reading Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Books List Shelf */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-200">My Reading Shelf</h2>
            <button 
              onClick={() => { setSelectedBookId(null); onNavigate('editor'); }}
              className="px-4 py-2 bg-indigo-600/90 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2"
            >
              + Add Book
            </button>
          </div>

          {books.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl border-dashed border-slate-800">
              <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-300 mb-1">Your bookshelf is empty</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6 text-sm">Add a book you are reading or have finished to start tracking your notes and drafting blog posts.</p>
              <button 
                onClick={() => { setSelectedBookId(null); onNavigate('editor'); }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-indigo-400 border border-slate-700/80 rounded-xl font-medium text-sm shadow-md"
              >
                Log Your First Book
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {books.map(book => {
                const progressPercent = book.totalPages > 0 
                  ? Math.round((book.progressPages / book.totalPages) * 100) 
                  : 0;

                return (
                  <div 
                    key={book._id}
                    onClick={() => handleStartNotes(book._id)}
                    className="glass-panel glass-panel-hover p-6 rounded-2xl transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                          {book.title}
                        </h3>
                        {getStatusBadge(book.status)}
                      </div>

                      {/* Author */}
                      <p className="text-sm text-slate-400 mb-5">
                        {book.author ? `by ${book.author}` : 'Unknown Author'}
                      </p>
                      
                      {/* Book Notes Snippet */}
                      {book.notes ? (
                        <div className="bg-slate-950/40 border border-slate-800/40 rounded-lg p-3 text-xs text-slate-400 line-clamp-3 mb-5 leading-relaxed font-sans italic">
                          "{book.notes}"
                        </div>
                      ) : (
                        <div className="border border-dashed border-slate-800/60 rounded-lg p-3 text-xs text-slate-500 text-center mb-5 italic">
                          No notes written yet. Click to add highlights.
                        </div>
                      )}
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                          <span>Progress: {progressPercent}%</span>
                          <span>{book.progressPages}/{book.totalPages} pgs</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              book.status === 'completed' 
                                ? 'bg-emerald-500' 
                                : 'bg-indigo-500 progress-pulse bg-gradient-to-r from-indigo-500 to-purple-400'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="border-t border-slate-800/60 pt-4 flex justify-between items-center">
                        <button 
                          onClick={(e) => handleDeleteBook(e, book._id)}
                          className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors active:scale-90"
                          title="Delete book"
                        >
                          <Trash2 size={16} />
                        </button>
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleGenerateBlog(book._id); }}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-1 shadow-sm"
                        >
                          Write Blog <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reading Journey Timeline (1 xl column) */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-200">Journey History</h2>
          
          <div className="glass-panel p-6 rounded-2xl max-h-[70vh] overflow-y-auto relative">
            {timeline.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                <Clock size={32} className="mx-auto text-slate-600 mb-3" />
                No events recorded yet. Complete books or write articles to grow your timeline!
              </div>
            ) : (
              <div className="relative border-l border-slate-800 ml-3 pl-6 space-y-6">
                {timeline.map((event, idx) => {
                  let indicatorBg = 'bg-blue-500';
                  let icon = '📖';

                  if (event.type === 'book_completed') {
                    indicatorBg = 'bg-emerald-500';
                    icon = '🏆';
                  } else if (event.type === 'blog_generated') {
                    indicatorBg = 'bg-purple-500';
                    icon = '✍️';
                  }

                  return (
                    <div key={idx} className="relative group">
                      {/* Timeline Node Ring */}
                      <span className={`absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-slate-900 ${indicatorBg} text-[8px] text-white shadow-md glow-indigo transition-transform duration-300 group-hover:scale-125`}>
                      </span>
                      
                      {/* Event Detail */}
                      <div className="bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/40 hover:border-slate-800 transition-all p-4 rounded-xl">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">
                            {event.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 whitespace-nowrap">
                            {formatDate(event.date)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {icon} {event.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
