import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../utils/api';
import { 
  FileText, Sparkles, Send, Copy, Download, Edit3, 
  Eye, RefreshCw, Linkedin, Twitter, CheckCircle2, 
  HelpCircle, ArrowLeft, PlusCircle
} from 'lucide-react';

export default function BlogGenerator({ selectedBookId, onNavigate, setSelectedBookId }) {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Custom inputs (if standalone or overrides)
  const [inlineTitle, setInlineTitle] = useState('');
  const [inlineAuthor, setInlineAuthor] = useState('');
  const [inlineNotes, setInlineNotes] = useState('');
  const [inlineLessons, setInlineLessons] = useState([]);
  const [newLesson, setNewLesson] = useState('');
  
  const [style, setStyle] = useState('Casual');
  const [activeTab, setActiveTab] = useState('blog'); // blog, social
  const [previewMode, setPreviewMode] = useState('split'); // split, edit, preview
  
  // Generation state
  const [generating, setGenerating] = useState(false);
  const [progressLog, setProgressLog] = useState('');
  const [blogData, setBlogData] = useState(null);
  
  // Editing state
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedLinkedIn, setEditedLinkedIn] = useState('');
  const [editedTweets, setEditedTweets] = useState([]);
  
  // Copy feedback states
  const [copyBlogSuccess, setCopyBlogSuccess] = useState(false);
  const [copyLinkedinSuccess, setCopyLinkedinSuccess] = useState(false);
  const [copiedTweetIdx, setCopiedTweetIdx] = useState(null);
  const [saveDraftSuccess, setSaveDraftSuccess] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (selectedBookId && books.length > 0) {
      const book = books.find(b => b._id === selectedBookId);
      if (book) {
        setSelectedBook(book);
        setInlineTitle(book.title);
        setInlineAuthor(book.author || '');
        setInlineNotes(book.notes || '');
        setInlineLessons(book.keyLessons || []);
      }
    }
  }, [selectedBookId, books]);

  const fetchBooks = async () => {
    try {
      const res = await api.getBooks();
      if (res.success) {
        setBooks(res.books);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  const handleBookChange = (bookId) => {
    if (bookId === 'standalone') {
      setSelectedBook(null);
      setSelectedBookId(null);
      setInlineTitle('');
      setInlineAuthor('');
      setInlineNotes('');
      setInlineLessons([]);
      setBlogData(null);
    } else {
      const book = books.find(b => b._id === bookId);
      if (book) {
        setSelectedBook(book);
        setSelectedBookId(book._id);
        setInlineTitle(book.title);
        setInlineAuthor(book.author || '');
        setInlineNotes(book.notes || '');
        setInlineLessons(book.keyLessons || []);
        setBlogData(null);
      }
    }
  };

  const handleAddLesson = (e) => {
    e.preventDefault();
    if (newLesson.trim()) {
      setInlineLessons([...inlineLessons, newLesson.trim()]);
      setNewLesson('');
    }
  };

  const handleRemoveLesson = (idx) => {
    setInlineLessons(inlineLessons.filter((_, i) => i !== idx));
  };

  // Run the generator and simulate step-by-step progress
  const handleGenerate = async () => {
    if (!inlineTitle.trim()) {
      alert('Please enter a book title first.');
      return;
    }

    setGenerating(true);
    setProgressLog('Ingesting your reading highlights and quotes...');
    
    // Cycle progress logs to make it feel extremely interactive and professional
    const logIntervals = [
      { delay: 1200, log: 'Structuring outline roadmap...' },
      { delay: 2400, log: `Applying writing profile: ${style} tone...` },
      { delay: 3600, log: 'Drafting SEO-friendly headings and introduction...' },
      { delay: 4800, log: 'Compiling Twitter thread & LinkedIn cards...' },
      { delay: 6000, log: 'Polishing grammar and format layouts...' }
    ];

    logIntervals.forEach(item => {
      setTimeout(() => {
        setProgressLog(item.log);
      }, item.delay);
    });

    try {
      const res = await api.generateBlog({
        bookId: selectedBook ? selectedBook._id : 'standalone',
        bookTitle: inlineTitle,
        bookAuthor: inlineAuthor,
        notes: inlineNotes,
        keyLessons: inlineLessons,
        style: style
      });

      if (res.success && res.blog) {
        // Give a tiny buffer for the final polished feel
        setTimeout(() => {
          setBlogData(res.blog);
          setEditedTitle(res.blog.title);
          setEditedContent(res.blog.content);
          setEditedLinkedIn(res.blog.linkedInPost);
          setEditedTweets(res.blog.twitterThread || []);
          setGenerating(false);
          setActiveTab('blog');
        }, 7000);
      }
    } catch (err) {
      console.error(err);
      alert('Blog generation failed. Ensure your backend and API keys are set up.');
      setGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!blogData) return;
    try {
      const res = await api.updateBlog(blogData._id, {
        title: editedTitle,
        content: editedContent,
        linkedInPost: editedLinkedIn,
        twitterThread: editedTweets
      });
      if (res.success) {
        setSaveDraftSuccess(true);
        setTimeout(() => setSaveDraftSuccess(false), 2500);
      }
    } catch (err) {
      alert('Failed to save draft edits.');
    }
  };

  const handleCopyBlog = () => {
    navigator.clipboard.writeText(editedContent);
    setCopyBlogSuccess(true);
    setTimeout(() => setCopyBlogSuccess(false), 2000);
  };

  const handleCopyLinkedin = () => {
    navigator.clipboard.writeText(editedLinkedIn);
    setCopyLinkedinSuccess(true);
    setTimeout(() => setCopyLinkedinSuccess(false), 2000);
  };

  const handleCopyTweet = (tweetText, idx) => {
    navigator.clipboard.writeText(tweetText);
    setCopiedTweetIdx(idx);
    setTimeout(() => setCopiedTweetIdx(null), 2000);
  };

  const handleExportMarkdown = () => {
    const filename = `${inlineTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-blog-draft.md`;
    const element = document.createElement('a');
    const file = new Blob([editedContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-1 bg-gradient-to-r from-purple-200 via-indigo-100 to-indigo-200 bg-clip-text text-transparent">
            AI Content Generator
          </h1>
          <p className="text-slate-400">Convert your notes and summaries into ready-to-publish articles and social threads.</p>
        </div>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Shelf
        </button>
      </div>

      {!blogData && !generating ? (
        /* SETUP MODE PANEL */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Notes Configuration Left Side */}
          <div className="lg:col-span-2 glass-panel p-8 rounded-2xl space-y-6">
            <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <FileText size={20} className="text-indigo-400" /> 1. Input Source Material
            </h2>
            
            {/* Book Selector Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Select Book from Shelf</label>
              <select 
                value={selectedBook ? selectedBook._id : 'standalone'}
                onChange={(e) => handleBookChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                <option value="standalone">✍️ Write Standalone notes (No Book Saved)</option>
                {books.map(b => (
                  <option key={b._id} value={b._id}>{b.title} {b.author ? `(by ${b.author})` : ''}</option>
                ))}
              </select>
            </div>

            {/* Standalone Input Form (Hidden if saved book is loaded and notes exist, or editable) */}
            <div className="space-y-4 pt-4 border-t border-slate-850">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Book Title</label>
                  <input 
                    type="text"
                    value={inlineTitle}
                    onChange={(e) => setInlineTitle(e.target.value)}
                    placeholder="e.g. Deep Work"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Book Author</label>
                  <input 
                    type="text"
                    value={inlineAuthor}
                    onChange={(e) => setInlineAuthor(e.target.value)}
                    placeholder="e.g. Cal Newport"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Highlights / Raw Summaries</label>
                <textarea
                  value={inlineNotes}
                  onChange={(e) => setInlineNotes(e.target.value)}
                  placeholder="Paste summaries, paragraph highlights, or thoughts to convert..."
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Lessons Builder */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-400">Key Lessons to Feature</label>
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
                    placeholder="e.g. Multitasking creates focus residue that reduces IQ."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button 
                    onClick={handleAddLesson}
                    className="px-3 bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 rounded-xl text-xs font-semibold transition-all"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {inlineLessons.map((l, idx) => (
                    <span 
                      key={idx}
                      className="bg-slate-950 border border-slate-850 px-3 py-1 rounded-full text-xs text-slate-300 flex items-center gap-1.5"
                    >
                      {l}
                      <button 
                        onClick={() => handleRemoveLesson(idx)}
                        className="text-slate-500 hover:text-red-400 focus:outline-none text-[10px]"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Style Configuration Right Side */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                <Sparkles size={20} className="text-purple-400" /> 2. Configuration
              </h2>
              
              {/* Style Selection Cards */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-400 block mb-1">Writing Style Profile</label>
                
                <div 
                  onClick={() => setStyle('Casual')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    style === 'Casual' 
                      ? 'border-indigo-500 bg-indigo-500/5 shadow-md shadow-indigo-500/5' 
                      : 'border-slate-800/80 bg-slate-950/40 hover:bg-slate-950/80'
                  }`}
                >
                  <h4 className="text-sm font-bold text-white mb-0.5">Casual & Engaging</h4>
                  <p className="text-xs text-slate-400">Friendly, conversational style using stories, simple analogies, and a warm tone.</p>
                </div>

                <div 
                  onClick={() => setStyle('Professional')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    style === 'Professional' 
                      ? 'border-indigo-500 bg-indigo-500/5 shadow-md shadow-indigo-500/5' 
                      : 'border-slate-800/80 bg-slate-950/40 hover:bg-slate-950/80'
                  }`}
                >
                  <h4 className="text-sm font-bold text-white mb-0.5">Professional & Strategic</h4>
                  <p className="text-xs text-slate-400">Analytical, clean, objective, structured breakdown. Focuses on takeaways and frameworks.</p>
                </div>

                <div 
                  onClick={() => setStyle('Storytelling')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    style === 'Storytelling' 
                      ? 'border-indigo-500 bg-indigo-500/5 shadow-md shadow-indigo-500/5' 
                      : 'border-slate-800/80 bg-slate-950/40 hover:bg-slate-950/80'
                  }`}
                >
                  <h4 className="text-sm font-bold text-white mb-0.5">Narrative & Introspective</h4>
                  <p className="text-xs text-slate-400">First-person narrative, reflecting on personal lessons learned and personal changes.</p>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <button 
              onClick={handleGenerate}
              className="w-full py-4.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/35 transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} /> Generate Blog & Social Assets
            </button>
          </div>
        </div>
      ) : generating ? (
        /* DYNAMIC ANIMATED WAIT SCREEN */
        <div className="glass-panel p-16 rounded-2xl max-w-2xl mx-auto flex flex-col items-center justify-center space-y-8 text-center min-h-[50vh]">
          {/* Glowing Animated Orbs */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl pulse-glow"></div>
            <div className="absolute top-2 left-2 right-2 bottom-2 bg-purple-500/20 rounded-full blur-md animate-pulse"></div>
            <div className="absolute top-6 left-6 right-6 bottom-6 border border-t-indigo-500 border-r-indigo-500 border-b-purple-400 border-l-transparent rounded-full animate-spin"></div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-white">Drafting Content Package</h3>
            <p className="text-indigo-400 font-mono text-xs flex items-center justify-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              {progressLog}
            </p>
          </div>

          <div className="w-64 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full w-[80%] animate-pulse"></div>
          </div>
          
          <p className="text-slate-500 text-xs max-w-sm">Generating SEO title hooks, complete Medium-formatted markdown article body, copy-ready LinkedIn updates, and Twitter/X threads.</p>
        </div>
      ) : (
        /* OUTPUT EDITOR AND PREVIEW MODE */
        <div className="space-y-6">
          
          {/* Main Controls Header */}
          <div className="glass-panel p-4 rounded-xl flex flex-wrap justify-between items-center gap-4">
            
            {/* Tabs selector */}
            <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
              <button 
                onClick={() => setActiveTab('blog')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'blog' 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText size={14} /> Blog Post
              </button>
              <button 
                onClick={() => setActiveTab('social')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'social' 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles size={14} /> Social Expansion
              </button>
            </div>

            {/* Content Action buttons */}
            <div className="flex items-center gap-3">
              {saveDraftSuccess && (
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                  ✓ Draft Saved
                </span>
              )}
              
              <button 
                onClick={handleSaveDraft}
                className="px-4 py-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 text-xs font-semibold text-slate-300 hover:text-white rounded-lg transition-all active:scale-95"
              >
                Save Draft
              </button>

              <button 
                onClick={() => setBlogData(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Generate Another
              </button>
            </div>
          </div>

          {activeTab === 'blog' ? (
            /* BLOG POST PREVIEW HUB */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Side: Markdown Source Editor */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col h-[70vh] space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                    <Edit3 size={16} className="text-indigo-400" /> Source Editor (Markdown)
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopyBlog}
                      className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold border border-slate-800/80 bg-slate-950/40"
                    >
                      <Copy size={13} /> {copyBlogSuccess ? 'Copied' : 'Copy'}
                    </button>
                    <button 
                      onClick={handleExportMarkdown}
                      className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold border border-slate-800/80 bg-slate-950/40"
                      title="Download as .md"
                    >
                      <Download size={13} /> Export .md
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SEO Title Headline</label>
                  <input 
                    type="text" 
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Article Body Content</label>
                  <textarea 
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full flex-1 bg-slate-950 border border-slate-850 rounded-xl p-4 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Right Side: High Fidelity WYSIWYG Renderer */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col h-[70vh] space-y-4">
                <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                  <h3 className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                    <Eye size={16} className="text-emerald-400" /> Medium Preview (Prose)
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-400/90 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    Medium Format Ready
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto px-2 blog-prose select-text">
                  {/* Dynamic rendering */}
                  <ReactMarkdown>{editedContent}</ReactMarkdown>
                </div>
              </div>

            </div>
          ) : (
            /* SOCIAL MEDIA EXPANSION HUB */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* LinkedIn Sharing Card */}
              <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col">
                <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                  <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <Linkedin size={18} className="text-indigo-400" /> LinkedIn Optimization Card
                  </h3>
                  <button 
                    onClick={handleCopyLinkedin}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg transition-all flex items-center gap-1 text-xs font-bold border border-slate-850 bg-slate-950/20"
                  >
                    {copyLinkedinSuccess ? '✓ Copied' : <><Copy size={13} /> Copy Post</>}
                  </button>
                </div>

                <div className="flex-1 flex flex-col space-y-3">
                  <p className="text-[10px] font-bold text-slate-500">Edit Post text below</p>
                  <textarea 
                    value={editedLinkedIn}
                    onChange={(e) => setEditedLinkedIn(e.target.value)}
                    className="w-full flex-1 bg-slate-950 border border-slate-850 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed"
                  />
                </div>
              </div>

              {/* Twitter Thread Builder */}
              <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col">
                <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                  <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <Twitter size={18} className="text-sky-400" /> Twitter/X Micro-Thread Builder
                  </h3>
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                    {editedTweets.length} Tweets
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {editedTweets.map((tweet, idx) => {
                    const charCount = tweet.length;
                    const isOverLimit = charCount > 280;

                    return (
                      <div 
                        key={idx} 
                        className="bg-slate-950/80 border border-slate-850 rounded-xl p-4 space-y-2 relative group"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase">Tweet {idx + 1}</span>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-bold font-mono ${
                              isOverLimit ? 'text-red-400' : charCount > 250 ? 'text-amber-400' : 'text-slate-500'
                            }`}>
                              {charCount}/280
                            </span>
                            <button 
                              onClick={() => handleCopyTweet(tweet, idx)}
                              className="p-1 hover:bg-slate-800 text-slate-500 hover:text-sky-400 rounded-md transition-colors"
                              title="Copy this tweet"
                            >
                              {copiedTweetIdx === idx ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            </button>
                          </div>
                        </div>

                        <textarea
                          value={tweet}
                          onChange={(e) => {
                            const newTweets = [...editedTweets];
                            newTweets[idx] = e.target.value;
                            setEditedTweets(newTweets);
                          }}
                          rows={3}
                          className="w-full bg-transparent border-0 text-slate-200 text-xs leading-relaxed focus:ring-0 focus:outline-none resize-none p-0"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}
