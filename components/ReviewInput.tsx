
import React, { useState } from 'react';
import { FileUp, ClipboardList, Send, Loader2, Sparkles, Building2 } from 'lucide-react';
import { Review } from '../types';

interface ReviewInputProps {
  onAnalyze: (reviews: Review[], businessName: string, businessType: string) => void;
  isLoading: boolean;
}

const ReviewInput: React.FC<ReviewInputProps> = ({ onAnalyze, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('E-commerce');
  const [mode, setMode] = useState<'text' | 'csv'>('text');

  const handleTextSubmit = () => {
    if (!inputText.trim() || !businessName.trim()) return;
    
    const lines = inputText.split('\n').filter(line => line.trim().length > 3);
    const reviews: Review[] = lines.map((text, i) => ({
      id: `rev-${Date.now()}-${i}`,
      text: text.trim(),
    }));

    onAnalyze(reviews, businessName, businessType);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split(/\r?\n/).filter(line => line.trim().length > 5);
      
      // Basic CSV heuristic: if first line looks like header, skip it
      const startIdx = lines[0].toLowerCase().includes('review') ? 1 : 0;
      
      const reviews: Review[] = lines.slice(startIdx).map((line, i) => {
        // Simple CSV split logic - assumes text might be in quotes
        const content = line.replace(/^"|"$/g, '').replace(/""/g, '"');
        return {
          id: `csv-${Date.now()}-${i}`,
          text: content,
        };
      });

      if (reviews.length > 0) {
        onAnalyze(reviews, businessName, businessType);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 flex items-center justify-center gap-3">
          <Sparkles className="text-indigo-600 w-10 h-10" />
          ReviewIQ Analysis
        </h1>
        <p className="text-lg text-slate-600">
          Transform raw customer reviews into actionable business intelligence in seconds.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Business Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="e.g. Acme SaaS"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <select
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              >
                <option>E-commerce</option>
                <option>SaaS</option>
                <option>Local Service</option>
                <option>Restaurant</option>
                <option>Mobile App</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('text')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                mode === 'text' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              Paste Text
            </button>
            <button
              onClick={() => setMode('csv')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                mode === 'csv' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileUp className="w-5 h-5" />
              Upload CSV
            </button>
          </div>

          {mode === 'text' ? (
            <div className="space-y-4">
              <textarea
                placeholder="Paste your reviews here (one per line)..."
                className="w-full h-64 p-4 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                disabled={isLoading || !inputText.trim() || !businessName.trim()}
                onClick={handleTextSubmit}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    Start AI Analysis
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center bg-slate-50">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer group block">
                <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform border border-slate-100">
                  <FileUp className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Choose CSV File</h3>
                <p className="text-slate-500 max-w-xs mx-auto mb-6">
                  Select a CSV where one column contains the review text.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition-colors">
                  Browse Files
                </div>
              </label>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 flex flex-wrap justify-center gap-6 opacity-60">
        <div className="flex items-center gap-2 text-sm font-medium"><Building2 className="w-4 h-4" /> Amazon Imports</div>
        <div className="flex items-center gap-2 text-sm font-medium"><Building2 className="w-4 h-4" /> Google Reviews</div>
        <div className="flex items-center gap-2 text-sm font-medium"><Building2 className="w-4 h-4" /> App Store</div>
        <div className="flex items-center gap-2 text-sm font-medium"><Building2 className="w-4 h-4" /> Trustpilot</div>
      </div>
    </div>
  );
};

export default ReviewInput;
