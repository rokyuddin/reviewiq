
import React from 'react';
import { Calendar, Building2, BarChart2, ChevronRight, Clock } from 'lucide-react';
import { SavedAnalysis } from '../types';

interface HistoryProps {
  history: SavedAnalysis[];
  onSelect: (analysis: SavedAnalysis) => void;
}

const History: React.FC<HistoryProps> = ({ history, onSelect }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Analysis History</h2>
          <p className="text-slate-500">Access your past reports and trend comparisons.</p>
        </div>
        <div className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-sm font-bold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {history.length} Reports
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {history.length > 0 ? history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full text-left bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 shrink-0">
                <Building2 className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.businessName}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-1">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-tight">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-tight">
                    <BarChart2 className="w-3.5 h-3.5" />
                    {item.reviewCount} Reviews
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
              <div className="flex flex-col items-end">
                <div className={`text-lg font-black ${item.result.sentimentScore > 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {item.result.sentimentScore}%
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase">Health Score</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </button>
        )) : (
          <div className="text-center py-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-bold text-lg">No analysis history found.</p>
            <p className="text-slate-400 text-sm">Upload some reviews to generate your first report.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
