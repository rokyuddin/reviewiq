
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Lightbulb, 
  History as HistoryIcon, 
  PlusCircle,
  LogOut,
  ChevronLeft,
  Settings,
  Bell,
  Sparkles
} from 'lucide-react';
import { analyzeReviews } from './services/geminiService';
import { AnalysisResult, Review, ViewType, SavedAnalysis } from './types';
import ReviewInput from './components/ReviewInput';
import Dashboard from './components/Dashboard';
import ReviewList from './components/ReviewList';
import ActionCenter from './components/ActionCenter';
import History from './components/History';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('upload');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<SavedAnalysis[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('reviewiq_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (result: AnalysisResult, name: string, count: number) => {
    const newEntry: SavedAnalysis = {
      id: `analysis-${Date.now()}`,
      timestamp: Date.now(),
      businessName: name,
      reviewCount: count,
      result
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('reviewiq_history', JSON.stringify(updatedHistory));
  };

  const handleAnalyze = async (inputReviews: Review[], name: string, type: string) => {
    setIsLoading(true);
    try {
      const result = await analyzeReviews(inputReviews, name, type);
      setReviews(inputReviews);
      setBusinessName(name);
      setCurrentAnalysis(result);
      saveToHistory(result, name, inputReviews.length);
      setActiveView('dashboard');
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('AI Analysis failed. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (saved: SavedAnalysis) => {
    setCurrentAnalysis(saved.result);
    setBusinessName(saved.businessName);
    // Note: We don't store original full review text in basic history for space efficiency 
    // in this demo, but normally we would.
    setActiveView('dashboard');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, disabled: !currentAnalysis },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, disabled: !currentAnalysis },
    { id: 'actions', label: 'AI Actions', icon: Lightbulb, disabled: !currentAnalysis },
    { id: 'history', label: 'History', icon: HistoryIcon, disabled: false },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xl font-black text-slate-900 hidden md:block">ReviewIQ</span>
        </div>

        <div className="px-3 mt-6 space-y-2 flex-1">
          <button
            onClick={() => setActiveView('upload')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeView === 'upload' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="hidden md:block">Analyze New</span>
          </button>
          
          <div className="h-px bg-slate-100 my-4 mx-4" />

          {navItems.map((item) => (
            <button
              key={item.id}
              disabled={item.disabled}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeView === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : item.disabled 
                    ? 'opacity-30 cursor-not-allowed' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden md:block">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="hidden md:flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">JD</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">John Doe</p>
              <p className="text-[10px] font-medium text-slate-400 truncate">Pro Plan</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-500 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="hidden md:block font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 md:ml-64 transition-all duration-300">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {activeView !== 'upload' && activeView !== 'history' && (
              <>
                <h2 className="text-lg font-bold text-slate-900">{businessName}</h2>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full">Report Ready</span>
              </>
            )}
            {activeView === 'upload' && <h2 className="text-lg font-bold text-slate-900">New Analysis</h2>}
            {activeView === 'history' && <h2 className="text-lg font-bold text-slate-900">Archive</h2>}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="p-8">
          {activeView === 'upload' && (
            <ReviewInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          )}

          {activeView === 'dashboard' && currentAnalysis && (
            <Dashboard result={currentAnalysis} reviewCount={reviews.length || currentAnalysis.individualAnalysis.length} />
          )}

          {activeView === 'reviews' && currentAnalysis && (
            <ReviewList reviews={reviews} individualAnalysis={currentAnalysis.individualAnalysis} />
          )}

          {activeView === 'actions' && currentAnalysis && (
            <ActionCenter suggestions={currentAnalysis.actionSuggestions} />
          )}

          {activeView === 'history' && (
            <History history={history} onSelect={handleSelectHistory} />
          )}
        </div>
      </main>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-12 text-center max-w-sm shadow-2xl animate-in zoom-in duration-300">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Analyzing Reviews...</h3>
            <p className="text-slate-500 text-sm">
              Our AI is identifying themes, sentiment patterns, and growth opportunities. 
              Usually takes 5-10 seconds.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
