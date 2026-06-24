import React, { useState, useEffect } from 'react';
import { api } from './utils/api';
import Dashboard from './pages/Dashboard';
import BookNotesEditor from './pages/BookNotesEditor';
import BlogGenerator from './pages/BlogGenerator';
import KnowledgeBase from './pages/KnowledgeBase';
import { 
  BookOpen, Sparkles, FolderArchive, Settings,
  AlertTriangle, Shield, HardDrive, Cpu, Terminal, Info
} from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedBookId, setSelectedBookId] = useState(null);
  
  // Status check state
  const [status, setStatus] = useState({
    status: 'offline',
    databaseMode: 'json',
    aiProvider: 'mock',
    geminiKeyConfigured: false,
    openaiKeyConfigured: false
  });
  const [showSettingsInfo, setShowSettingsInfo] = useState(false);

  useEffect(() => {
    fetchBackendStatus();
    // Poll status every 15 seconds
    const interval = setInterval(fetchBackendStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchBackendStatus = async () => {
    try {
      const data = await api.getStatus();
      if (data) {
        setStatus(data);
      }
    } catch (err) {
      console.warn('Backend server is offline or unreachable.');
      setStatus(prev => ({ ...prev, status: 'offline' }));
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={setCurrentPage} 
            setSelectedBookId={setSelectedBookId} 
          />
        );
      case 'editor':
        return (
          <BookNotesEditor 
            selectedBookId={selectedBookId} 
            setSelectedBookId={setSelectedBookId}
            onNavigate={setCurrentPage} 
          />
        );
      case 'generator':
        return (
          <BlogGenerator 
            selectedBookId={selectedBookId}
            setSelectedBookId={setSelectedBookId}
            onNavigate={setCurrentPage} 
          />
        );
      case 'archive':
        return (
          <KnowledgeBase 
            onNavigate={setCurrentPage} 
            setSelectedBookId={setSelectedBookId} 
          />
        );
      default:
        return <Dashboard onNavigate={setCurrentPage} setSelectedBookId={setSelectedBookId} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#060913] text-slate-100 overflow-x-hidden font-sans">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-slate-900 bg-[#0b0f19]/80 backdrop-blur-xl flex flex-col justify-between shrink-0 h-screen sticky top-0">
        
        {/* Brand/Logo Section */}
        <div className="p-6">
          <div className="flex items-center gap-3 select-none">
            <div className="relative p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-600/30 group cursor-pointer">
              <Sparkles size={20} className="text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-display font-extrabold text-lg text-white leading-none block">
                BookToBlog<span className="text-indigo-400">.ai</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                Creator Toolkit
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-1">
            <button 
              onClick={() => { setCurrentPage('dashboard'); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                currentPage === 'dashboard' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <BookOpen size={18} />
              Journey Shelf
            </button>

            <button 
              onClick={() => { setSelectedBookId(null); setCurrentPage('editor'); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                currentPage === 'editor' && !selectedBookId
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Terminal size={18} />
              Log Highlights
            </button>

            <button 
              onClick={() => { setCurrentPage('generator'); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                currentPage === 'generator' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Sparkles size={18} />
              AI Blog Generator
            </button>

            <button 
              onClick={() => { setCurrentPage('archive'); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                currentPage === 'archive' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <FolderArchive size={18} />
              Digital Vault
            </button>
          </nav>
        </div>

        {/* SYSTEM STATUS ENGINE BADGE */}
        <div className="p-4 border-t border-slate-900/80 bg-[#060913]/30">
          <div className="glass-panel p-3 rounded-xl space-y-2.5">
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
              <span>Engine Status</span>
              {status.status === 'online' ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1">
                  Offline
                </span>
              )}
            </div>
            
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5"><HardDrive size={12} /> Database:</span>
                <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] uppercase ${
                  status.databaseMode === 'mongodb' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {status.databaseMode === 'mongodb' ? 'MongoDB' : 'Local JSON'}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5"><Cpu size={12} /> AI Engine:</span>
                <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] uppercase ${
                  status.aiProvider === 'mock' 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                }`}>
                  {status.aiProvider}
                </span>
              </div>
            </div>

            {/* Warn banner if Mock AI is active */}
            {status.status === 'online' && status.aiProvider === 'mock' && (
              <button 
                onClick={() => setShowSettingsInfo(true)}
                className="w-full flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[9px] text-amber-400 hover:bg-amber-500/20 transition-all font-semibold"
              >
                <AlertTriangle size={10} className="shrink-0" />
                <span>Running Mock AI. Click to configure</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 min-h-screen p-8 lg:p-12 overflow-y-auto">
        {renderPage()}
      </main>

      {/* SETTINGS DIALOG (INFO BOX) */}
      {showSettingsInfo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-2xl p-6 space-y-5 animate-slide-up border border-slate-800">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 text-amber-400">
                <Info size={20} />
                <h3 className="text-lg font-bold text-white">System Configuration Guide</h3>
              </div>
              <button 
                onClick={() => setShowSettingsInfo(false)}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-sm text-slate-300 space-y-4">
              <p>The application is running in <strong>Mock AI Mode</strong> because no API keys were found in the backend environment variables.</p>
              
              <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2 text-xs font-mono text-slate-400">
                <div className="text-white font-bold mb-1">To configure keys, edit the backend file:</div>
                <div>1. Rename <span className="text-indigo-400">backend/.env.example</span> to <span className="text-indigo-400">.env</span></div>
                <div>2. Add your credentials:</div>
                <div className="text-indigo-300 mt-2">
                  GEMINI_API_KEY=your_gemini_key<br />
                  # OR <br />
                  OPENAI_API_KEY=your_openai_key
                </div>
                <div className="text-slate-500 mt-2">MongoDB URI can also be added here. Leave blank to continue using the file-based database store.</div>
              </div>
              
              <p className="text-xs text-slate-400">Once credentials are saved, restart the backend server to activate live AI generation.</p>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setShowSettingsInfo(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all active:scale-95 shadow"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
