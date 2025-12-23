
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, MessageSquare, Star, ArrowUpRight, 
  Smile, Frown, Meh, Lightbulb, CheckCircle2, AlertCircle
} from 'lucide-react';
import { AnalysisResult, Theme } from '../types';

interface DashboardProps {
  result: AnalysisResult;
  reviewCount: number;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const SENTIMENT_COLORS = {
  positive: '#10b981',
  negative: '#ef4444',
  neutral: '#f59e0b'
};

const Dashboard: React.FC<DashboardProps> = ({ result, reviewCount }) => {
  const { 
    summary, overallSentiment, sentimentScore, themes, 
    topKeywords, emotionDistribution, repeatedHighlights, repeatedComplaints 
  } = result;

  const getSentimentIcon = () => {
    if (overallSentiment === 'Positive') return <Smile className="w-12 h-12 text-emerald-500" />;
    if (overallSentiment === 'Negative') return <Frown className="w-12 h-12 text-rose-500" />;
    return <Meh className="w-12 h-12 text-amber-500" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Executive Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Executive Summary</h2>
              <p className="text-slate-600 leading-relaxed">{summary}</p>
            </div>
            <div className="hidden sm:block">
              <div className="bg-indigo-50 p-3 rounded-2xl">
                <TrendingUp className="text-indigo-600 w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Reviews</div>
              <div className="text-2xl font-bold text-slate-900">{reviewCount}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Health Score</div>
              <div className="text-2xl font-bold text-indigo-600">{sentimentScore}%</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sentiment</div>
              <div className={`text-xl font-bold ${overallSentiment === 'Positive' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {overallSentiment}
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Top Theme</div>
              <div className="text-sm font-bold text-slate-900 truncate">{themes[0]?.name || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
          <div className="mb-6 relative">
             {/* Simple Ring Chart Logic */}
             <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                <circle cx="80" cy="80" r="70" fill="transparent" stroke={overallSentiment === 'Positive' ? '#10b981' : '#f59e0b'} 
                  strokeWidth="12" strokeDasharray={`${sentimentScore * 4.4} 440`} strokeLinecap="round" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-90">
                {getSentimentIcon()}
                <span className="text-3xl font-black mt-2">{sentimentScore}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Index Score</span>
             </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900">Customer Mood</h3>
          <p className="text-slate-500 text-sm mt-2">Overall perception is {overallSentiment.toLowerCase()}.</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Most Mentioned Themes
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={themes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fontWeight: 500 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {themes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Smile className="w-5 h-5 text-indigo-600" />
            Emotion Breakdown
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {emotionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Highlights & Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100">
          <h3 className="text-lg font-bold text-emerald-900 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Key Strengths
          </h3>
          <div className="space-y-4">
            {repeatedHighlights.map((text, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                <div className="mt-1"><ArrowUpRight className="w-4 h-4 text-emerald-500" /></div>
                <p className="text-emerald-800 text-sm font-medium leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-rose-50/50 p-8 rounded-3xl border border-rose-100">
          <h3 className="text-lg font-bold text-rose-900 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            Frequent Complaints
          </h3>
          <div className="space-y-4">
            {repeatedComplaints.map((text, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-rose-100 shadow-sm">
                <div className="mt-1"><TrendingDown className="w-4 h-4 text-rose-500" /></div>
                <p className="text-rose-800 text-sm font-medium leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keywords Cloud */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Top Word Associations</h3>
        <div className="flex flex-wrap gap-3">
          {topKeywords.positive.map((word, i) => (
            <span key={i} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold border border-emerald-200">
              {word}
            </span>
          ))}
          {topKeywords.negative.map((word, i) => (
            <span key={i} className="px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm font-bold border border-rose-200">
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
