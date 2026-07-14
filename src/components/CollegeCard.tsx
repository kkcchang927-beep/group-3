import { College } from '../types';
import { MapPin, Users, DollarSign, Award, Bookmark, BookmarkCheck, ChevronRight, Sparkles } from 'lucide-react';

interface CollegeCardProps {
  college: College;
  matchScore?: number;
  matchReason?: string;
  isSaved: boolean;
  onSaveToggle: () => void;
  onAnalyze: () => void;
  studentMajor?: string;
}

export default function CollegeCard({
  college,
  matchScore,
  matchReason,
  isSaved,
  onSaveToggle,
  onAnalyze,
  studentMajor
}: CollegeCardProps) {
  // Format numbers beautifully
  const formattedRate = (college.acceptanceRate * 100).toFixed(1) + '%';
  const formattedCost = college.averageCost.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  // Calculate score colors
  const getScoreColorClass = (score: number) => {
    if (score >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (score >= 75) return 'bg-blue-50 text-blue-700 border-blue-100';
    return 'bg-slate-50 text-slate-700 border-slate-100';
  };

  return (
    <div id={`college-card-${college.id}`} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full relative group">
      {/* College Banner Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={college.image}
          alt={college.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-800 rounded-full shadow-sm">
            {college.type}
          </span>
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-600/90 text-white rounded-full shadow-sm">
            {college.size} Size
          </span>
        </div>

        {/* Save to Dream Board Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSaveToggle();
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl transition-all shadow-sm flex items-center justify-center ${
            isSaved
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'bg-white/90 text-slate-600 hover:bg-white hover:text-slate-900'
          }`}
          title={isSaved ? 'Remove from Dream List' : 'Save to Dream List'}
        >
          {isSaved ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
        </button>

        {/* Bottom Title overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300 drop-shadow-sm mb-0.5">
            {college.rank}
          </p>
          <h3 className="text-base font-bold leading-tight drop-shadow">
            {college.name}
          </h3>
        </div>
      </div>

      {/* Card Contents */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-3.5">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Location</span>
              </div>
              <p className="text-xs font-bold text-slate-700 truncate" title={college.location}>{college.location}</p>
            </div>

            <div className="text-center border-x border-slate-100 px-1">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                <Users className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Admit Rate</span>
              </div>
              <p className="text-xs font-bold text-slate-700">{formattedRate}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Net Cost</span>
              </div>
              <p className="text-xs font-bold text-slate-700">{formattedCost}/yr</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
            {college.description}
          </p>

          {/* Popular Majors Match */}
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5">Top Programs</span>
            <div className="flex flex-wrap gap-1">
              {college.topMajors.map((major) => {
                const isStudentMajorMatch = studentMajor && major.toLowerCase().includes(studentMajor.toLowerCase());
                return (
                  <span
                    key={major}
                    className={`px-2 py-0.5 text-[10px] font-medium rounded-md border ${
                      isStudentMajorMatch
                        ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-100'
                    }`}
                  >
                    {major}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Recommendations Highlight */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-3">
          {matchScore !== undefined && (
            <div className={`p-3 rounded-xl border flex flex-col gap-1.5 ${getScoreColorClass(matchScore)}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  AI Alignment Match
                </span>
                <span className="text-xs font-black">{matchScore}% Fit</span>
              </div>
              {matchReason && (
                <p className="text-[11px] leading-relaxed opacity-90">{matchReason}</p>
              )}
            </div>
          )}

          {/* Core Action Button */}
          <button
            onClick={onAnalyze}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1 group/btn border border-slate-200"
          >
            Explore & Deep Fit Analysis
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-all text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
