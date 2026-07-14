import { useState, useEffect } from 'react';
import { College, StudentProfile, FitAnalysis } from '../types';
import { X, Sparkles, AlertCircle, CheckCircle, Lightbulb, BookOpen, Heart, DollarSign, Award, Target, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CollegeDetailModalProps {
  college: College;
  profile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onSaveToggle: () => void;
  subscriptionTier?: 'free' | 'standard' | 'elite';
  onUpgradeTrigger?: () => void;
}

export default function CollegeDetailModal({
  college,
  profile,
  isOpen,
  onClose,
  isSaved,
  onSaveToggle,
  subscriptionTier = 'free',
  onUpgradeTrigger
}: CollegeDetailModalProps) {
  const [analysis, setAnalysis] = useState<FitAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch fit analysis when modal opens
  useEffect(() => {
    if (isOpen && college && profile) {
      const fetchAnalysis = async () => {
        setLoading(true);
        setError(null);
        setAnalysis(null);
        try {
          const res = await fetch('/api/fit-analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ college, profile })
          });

          const contentType = res.headers.get('content-type');
          let data: any;
          if (contentType && contentType.includes('application/json')) {
            data = await res.json();
          } else {
            const text = await res.text();
            console.warn('Expected JSON response from fit-analysis, but received:', text.substring(0, 200));
            throw new Error('Server returned an invalid HTML or non-JSON response.');
          }

          if (!res.ok) {
            throw new Error(data?.error || 'Failed to calculate fit analysis.');
          }

          setAnalysis(data);
        } catch (e: any) {
          console.error(e);
          setError(e.message || 'Unable to connect to advisory servers.');
        } finally {
          setLoading(false);
        }
      };

      fetchAnalysis();
    }
  }, [isOpen, college, profile]);

  if (!isOpen) return null;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Reach':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/15';
      case 'Target':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/15';
      case 'Safety':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/15';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/15';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div id="college-detail-modal" className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Image */}
        <div className="relative h-60 bg-slate-100 shrink-0">
          <img
            src={college.image}
            alt={college.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-900/50 hover:bg-slate-900/80 text-white p-2 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-5 left-6 right-6 text-white flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-blue-600 rounded-md shadow-sm inline-block mb-2">
                {college.rank}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">{college.name}</h2>
              <p className="text-sm text-slate-300 font-medium flex items-center gap-1 mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                {college.location} • {college.type} School • {college.size} Size
              </p>
            </div>

            <button
              onClick={onSaveToggle}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shrink-0 ${
                isSaved
                  ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20'
                  : 'bg-white text-slate-800 hover:bg-slate-50 shadow'
              }`}
            >
              {isSaved ? '★ Saved to Dream Board' : '☆ Add to Dream Board'}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: College Stats & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2.5">About this School</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{college.description}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Admission Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-500 block">Acceptance Rate</span>
                  <span className="text-lg font-extrabold text-slate-800">{(college.acceptanceRate * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Net Annual Price</span>
                  <span className="text-lg font-extrabold text-slate-800">${college.averageCost.toLocaleString()}/yr</span>
                </div>
              </div>
              <div className="border-t border-slate-200/60 pt-3">
                <span className="text-xs text-slate-500 block mb-1">Admissions Culture</span>
                <p className="text-xs text-slate-600 italic leading-relaxed">{college.admissionVibe}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2.5">Academic Strengths</h3>
              <div className="flex flex-wrap gap-1.5">
                {college.topMajors.map((major) => {
                  const isMatching = profile.major && major.toLowerCase().includes(profile.major.toLowerCase());
                  return (
                    <span
                      key={major}
                      className={`px-3 py-1.5 text-xs font-medium rounded-xl border ${
                        isMatching
                          ? 'bg-blue-100/60 text-blue-800 border-blue-200 font-bold'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {major}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: AI Fit Analysis Section (7 cols) */}
          <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-8 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-lg text-white">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">AI Personalized Counselor Review</h3>
            </div>

            {loading && (
              <div className="space-y-4 py-8 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-28 bg-slate-100 rounded-lg" />
                  <div className="h-6 w-32 bg-slate-100 rounded-lg" />
                </div>
                <div className="h-4 bg-slate-100 rounded-xl w-3/4" />
                <div className="h-4 bg-slate-100 rounded-xl w-5/6" />
                <div className="h-28 bg-slate-100 rounded-2xl w-full" />
                <div className="h-12 bg-slate-100 rounded-xl w-full" />
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-800">AI Counselor Offline</h4>
                  <p className="text-xs text-rose-600 leading-relaxed mt-1">{error}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Make sure your <code className="bg-slate-100 px-1 py-0.5 rounded">GEMINI_API_KEY</code> is correctly set up in the Secrets tab (Settings menu) of your AI Studio Workspace.
                  </p>
                </div>
              </div>
            )}

            {!loading && !error && analysis && (
              <div className="space-y-6">
                
                {/* Core Profile Category & Probability */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-2xl border text-center ring-4 ring-offset-0 ${getCategoryColor(analysis.category)}`}>
                    <span className="text-[10px] uppercase font-bold tracking-widest block opacity-75 mb-1">Candidacy Vibe</span>
                    <span className="text-xl font-black">{analysis.category}</span>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-1">Admit Probability</span>
                    <span className="text-xl font-black text-slate-800 flex items-center justify-center gap-1">
                      <Target className="w-5 h-5 text-blue-500" /> {analysis.admissionProbability}%
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-1">Personal Fit Score</span>
                    <span className="text-xl font-black text-slate-800 flex items-center justify-center gap-1">
                      <Award className="w-5 h-5 text-violet-500" /> {analysis.fitScore}/100
                    </span>
                  </div>
                </div>

                {/* Why it Fits Bullets */}
                <div className="bg-blue-50/40 rounded-2xl p-5 border border-blue-100/50">
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block mb-3">Why This Fits You</span>
                  <ul className="space-y-2">
                    {analysis.whyItFits.map((bullet, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deep Analysis Blocks */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-700 shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Academic Fit</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{analysis.academicFit}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-700 shrink-0">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Social & Vibe Fit</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{analysis.socialFit}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-700 shrink-0">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Financial Fit</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{analysis.financialFit}</p>
                    </div>
                  </div>
                </div>

                {/* Premium Financial Aid & Scholarship Calculator (Elite Tier) */}
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1 bg-amber-500/10 text-amber-700 rounded text-[10px] font-black uppercase tracking-wider">Elite Tier Feature</span>
                      <h4 className="text-sm font-black text-slate-800">Dynamic Scholarship & Aid Estimator</h4>
                    </div>
                  </div>

                  {subscriptionTier === 'elite' ? (
                    (() => {
                      const baseCost = college.averageCost;
                      const gpaBonus = profile.gpa > 3.8 ? (college.type === 'Private' ? 12000 : 5000) : (profile.gpa > 3.5 ? (college.type === 'Private' ? 6000 : 2500) : 0);
                      const satBonus = (profile.sat && profile.sat > 1400) ? 4000 : ((profile.sat && profile.sat > 1200) ? 1500 : 0);
                      const budgetGrant = profile.budget === 'low' ? baseCost * 0.35 : (profile.budget === 'medium' ? baseCost * 0.15 : 0);
                      
                      const totalScholarships = gpaBonus + satBonus;
                      const totalGrants = Math.round(budgetGrant);
                      const netPrice = Math.max(2500, Math.round(baseCost - totalScholarships - totalGrants));

                      return (
                        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-5 border border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Est. Merit Scholarships</span>
                            <p className="text-xl font-black text-amber-700">${totalScholarships.toLocaleString()}/yr</p>
                            <p className="text-[9px] text-slate-400">Based on GPA ({profile.gpa}) & SAT ({profile.sat || 'N/A'})</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Estimated Grants & Aid</span>
                            <p className="text-xl font-black text-indigo-700">${totalGrants.toLocaleString()}/yr</p>
                            <p className="text-[9px] text-slate-400">Based on family budget preference</p>
                          </div>
                          <div className="space-y-1 bg-white/60 p-3 rounded-xl border border-amber-500/10">
                            <span className="text-[10px] font-black text-slate-700 uppercase">Your Est. Net Price</span>
                            <p className="text-2xl font-black text-slate-900">${netPrice.toLocaleString()}/yr</p>
                            <p className="text-[9px] text-emerald-600 font-bold">Estimated saving of ${Math.round(totalScholarships + totalGrants).toLocaleString()}/yr</p>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-4">
                        <div className="p-2 bg-amber-500 text-white rounded-full mb-2 shadow-md">
                          <Crown className="w-4 h-4 fill-white" />
                        </div>
                        <h5 className="text-xs font-extrabold text-slate-900">Unlock Elite Merit Scholarship Calculator</h5>
                        <p className="text-[10px] text-slate-500 mt-1 max-w-sm">Get real-time Net Price, Grant, and Merit Aid estimates adjusted automatically for your academic GPA & SAT credentials.</p>
                        <button
                          type="button"
                          onClick={onUpgradeTrigger}
                          className="mt-3 px-4 py-1.5 bg-slate-900 hover:bg-slate-950 text-white text-[10px] font-black tracking-wider uppercase rounded-lg transition-all cursor-pointer shadow-sm"
                        >
                          Upgrade to Elite
                        </button>
                      </div>

                      {/* Blurred background mockup */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-10 select-none pointer-events-none">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Est. Merit Scholarships</span>
                          <p className="text-xl font-black text-amber-700">$12,000/yr</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Estimated Grants & Aid</span>
                          <p className="text-xl font-black text-indigo-700">$8,500/yr</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-700 uppercase">Your Est. Net Price</span>
                          <p className="text-xl font-black text-slate-900">$21,500/yr</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Application Strategy */}
                <div className="border-t border-slate-100 pt-5">
                  <div className="flex items-start gap-2.5 mb-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500 fill-yellow-500/10 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Strategic Application Path</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">{analysis.applicationStrategy}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50 mt-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-2.5">Counselor Advice to Stand Out:</span>
                    <ul className="space-y-2">
                      {analysis.tipsToStandOut.map((tip, index) => (
                        <li key={index} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                          <span className="bg-violet-100 text-violet-800 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">{index + 1}</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            )}

            {!loading && !error && !analysis && (
              <div className="text-center py-10 text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-medium">Please select a student profile to run a fit analysis.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
