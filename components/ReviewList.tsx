
import React, { useState } from 'react';
import { Search, Filter, MessageSquare, Tag, Smile, Frown, Meh } from 'lucide-react';
import { Review, IndividualAnalysis } from '../types';

interface ReviewListProps {
  reviews: Review[];
  individualAnalysis: IndividualAnalysis[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, individualAnalysis }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  const filteredReviews = reviews.filter((review, index) => {
    const analysis = individualAnalysis.find(a => a.index === index);
    const matchesSearch = review.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSentiment = filterSentiment === 'all' || analysis?.sentiment === filterSentiment;
    return matchesSearch && matchesSentiment;
  });

  const getSentimentStyles = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'negative': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="w-4 h-4" />;
      case 'negative': return <Frown className="w-4 h-4" />;
      default: return <Meh className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search reviews..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => setFilterSentiment('all')}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filterSentiment === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterSentiment('positive')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filterSentiment === 'positive' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-emerald-600 hover:bg-slate-200'}`}
          >
            <Smile className="w-4 h-4" /> Positive
          </button>
          <button 
            onClick={() => setFilterSentiment('negative')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filterSentiment === 'negative' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-rose-600 hover:bg-slate-200'}`}
          >
            <Frown className="w-4 h-4" /> Negative
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReviews.length > 0 ? filteredReviews.map((review, idx) => {
          const analysis = individualAnalysis.find(a => a.index === idx);
          return (
            <div key={review.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex shrink-0 w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center border border-slate-100 text-slate-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {analysis && (
                      <>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getSentimentStyles(analysis.sentiment)}`}>
                          {getSentimentIcon(analysis.sentiment)}
                          {analysis.sentiment.toUpperCase()}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                          <Tag className="w-3 h-3" />
                          {analysis.category}
                        </span>
                        {analysis.emotions.map(emotion => (
                          <span key={emotion} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-xs font-medium border border-slate-100">
                            {emotion}
                          </span>
                        ))}
                      </>
                    )}
                  </div>
                  <p className="text-slate-800 leading-relaxed text-sm italic font-medium">"{review.text}"</p>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-medium">No reviews match your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
