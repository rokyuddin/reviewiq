
import React from 'react';
import { Lightbulb, Rocket, Megaphone, HelpCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { ActionSuggestions } from '../types';

interface ActionCenterProps {
  suggestions: ActionSuggestions;
}

const ActionCenter: React.FC<ActionCenterProps> = ({ suggestions }) => {
  return (
    <div className="space-y-8">
      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-3">AI Action Plan</h2>
          <p className="text-indigo-100 text-lg max-w-2xl">
            Based on current customer sentiment, we've identified the following strategic opportunities for your business.
          </p>
        </div>
        <Lightbulb className="absolute right-[-20px] top-[-20px] w-64 h-64 text-indigo-500/20 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Product Improvements */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Product Fixes</h3>
          </div>
          <div className="space-y-4">
            {suggestions.improvements.map((item, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <p className="text-slate-700 text-sm font-medium mb-3">{item}</p>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-indigo-600 group-hover:translate-x-1 transition-transform cursor-pointer">
                  <span>Implement Task</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing Ideas */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Marketing Wins</h3>
          </div>
          <div className="space-y-4">
            {suggestions.marketing.map((item, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <p className="text-slate-700 text-sm font-medium mb-3">{item}</p>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover:translate-x-1 transition-transform cursor-pointer">
                  <span>Create Campaign</span>
                  <Megaphone className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Suggestions */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Support Strategy</h3>
          </div>
          <div className="space-y-4">
            {suggestions.support.map((item, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <p className="text-slate-700 text-sm font-medium mb-3">{item}</p>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-rose-600 group-hover:translate-x-1 transition-transform cursor-pointer">
                  <span>Update FAQ</span>
                  <HelpCircle className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-white">
          <h4 className="text-xl font-bold mb-1">Export this Action Plan</h4>
          <p className="text-slate-400 text-sm">Download a PDF version of these insights for your team meetings.</p>
        </div>
        <button className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-colors">
          Download PDF Report
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ActionCenter;
