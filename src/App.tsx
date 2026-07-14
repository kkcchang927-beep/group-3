import React, { useState, useEffect } from 'react';
import { StudentProfile, College, SavedCollege, ChecklistItem } from './types';
import { COLLEGES } from './data/colleges';
import ProfileForm from './components/ProfileForm';
import Quiz from './components/Quiz';
import CollegeCard from './components/CollegeCard';
import CollegeDetailModal from './components/CollegeDetailModal';
import DreamBoard from './components/DreamBoard';
import AdvisorChat from './components/AdvisorChat';
import PricingTab from './components/PricingTab';
import { Sparkles, GraduationCap, ClipboardList, Brain, Search, BookOpen, AlertCircle, RefreshCw, Crown, CreditCard, CheckCircle2, Lock, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_PROFILE: StudentProfile = {
  gpa: 3.75,
  sat: 1350,
  budget: 'medium',
  locationPreference: ['Northeast', 'West Coast'],
  campusSize: ['Medium', 'Large'],
  major: 'Computer Science',
  interests: ['Research', 'Entrepreneurship']
};

const DEFAULT_CHECKLIST = [
  { id: 'common_app', label: 'Complete Common App Section', completed: false },
  { id: 'transcripts', label: 'Send Official High School Transcripts', completed: false },
  { id: 'letters_rec', label: 'Request Letters of Recommendation', completed: false },
  { id: 'essays', label: 'Draft Supplemental & Personal Essays', completed: false },
  { id: 'submit', label: 'Submit Application officially', completed: false }
];

export default function App() {
  // Tiered Subscription Price Model
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'standard' | 'elite'>(() => {
    const saved = localStorage.getItem('dream_school_tier');
    if (saved === 'standard' || saved === 'elite' || saved === 'free') return saved as 'free' | 'standard' | 'elite';
    // Backwards compatibility migration
    if (localStorage.getItem('dream_school_pro') === 'true') return 'elite';
    return 'free';
  });
  const [checkoutTier, setCheckoutTier] = useState<'standard' | 'elite'>('standard');
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details');
  const [paymentForm, setPaymentForm] = useState({ name: '', email: '', cardNumber: '4242 4242 4242 4242', expiry: '12/28', cvc: '123' });

  // Derived backward compatibility state
  const isPro = subscriptionTier !== 'free';

  // Navigation State
  const [activeTab, setActiveTab] = useState<'discover' | 'board' | 'advisor' | 'pricing'>('discover');

  // Core App States
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);

  // Matching & Suggestions State
  const [matches, setMatches] = useState<any[]>([]);
  const [collegesList, setCollegesList] = useState<College[]>(COLLEGES);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');

  // Selected College for detail modal
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedProf = localStorage.getItem('dream_school_profile');
    if (savedProf) {
      try {
        setProfile(JSON.parse(savedProf));
      } catch (e) {
        console.error('Failed to parse saved profile', e);
      }
    }

    const savedBoard = localStorage.getItem('dream_school_saved_board');
    if (savedBoard) {
      try {
        setSavedColleges(JSON.parse(savedBoard));
      } catch (e) {
        console.error('Failed to parse saved board', e);
      }
    }

    const savedCollegesData = localStorage.getItem('dream_school_custom_colleges');
    if (savedCollegesData) {
      try {
        const customColleges = JSON.parse(savedCollegesData);
        // Merge any custom colleges recommended by AI in prior sessions
        setCollegesList(prev => {
          const unique = [...prev];
          customColleges.forEach((cc: College) => {
            if (!unique.some(c => c.id === cc.id)) {
              unique.push(cc);
            }
          });
          return unique;
        });
      } catch (e) {
        console.error('Failed to parse custom colleges', e);
      }
    }
  }, []);

  // Save profile state updates
  const handleProfileChange = (updated: StudentProfile) => {
    setProfile(updated);
    localStorage.setItem('dream_school_profile', JSON.stringify(updated));
  };

  const handleUpgradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
      setSubscriptionTier(checkoutTier);
      localStorage.setItem('dream_school_tier', checkoutTier);
      localStorage.setItem('dream_school_pro', 'true');
    }, 1500);
  };

  const handleResetPremiumDemo = () => {
    setSubscriptionTier('free');
    localStorage.setItem('dream_school_tier', 'free');
    localStorage.removeItem('dream_school_pro');
    setPaymentStep('details');
  };

  // Run initial matching or matching on request
  const fetchMatches = async (currentProfile: StudentProfile) => {
    setLoadingMatches(true);
    setMatchError(null);
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: currentProfile,
          preloadedColleges: COLLEGES
        })
      });

      const contentType = response.headers.get('content-type');
      let data: any;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.warn('Expected JSON response, but received:', text.substring(0, 200));
        throw new Error('Server returned an invalid HTML or non-JSON response.');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Server matching was interrupted.');
      }

      const aiMatches = data.matches || [];

      // If AI matched any brand-new custom colleges, let's persist them locally
      const customColleges: College[] = [];
      aiMatches.forEach((m: any) => {
        if (m.isCustom && m.customData) {
          customColleges.push(m.customData);
        }
      });

      if (customColleges.length > 0) {
        setCollegesList(prev => {
          const updatedColleges = [...prev];
          customColleges.forEach(cc => {
            if (!updatedColleges.some(c => c.id === cc.id)) {
              updatedColleges.push(cc);
            }
          });
          // Save custom colleges list
          localStorage.setItem('dream_school_custom_colleges', JSON.stringify(
            updatedColleges.filter(c => !COLLEGES.some(pc => pc.id === c.id))
          ));
          return updatedColleges;
        });
      }

      setMatches(aiMatches);
    } catch (err: any) {
      console.error('Match fetch error:', err);
      setMatchError(err.message || 'Advisory matchmakers are currently unavailable.');
      // Graceful local fallback calculations if API key is not configured yet
      calculateLocalMatches(currentProfile);
    } finally {
      setLoadingMatches(false);
    }
  };

  // Safe client-only fallback matcher to let users explore if API keys are missing
  const calculateLocalMatches = (p: StudentProfile) => {
    const fallback = COLLEGES.map(c => {
      let score = 70;
      if (p.locationPreference.includes(c.region)) score += 10;
      if (p.campusSize.includes(c.size)) score += 10;
      if (c.topMajors.some(m => m.toLowerCase().includes(p.major.toLowerCase()))) score += 10;
      return {
        collegeId: c.id,
        isCustom: false,
        matchScore: Math.min(100, score),
        matchReason: `Strong match due to your location preference for ${c.region} and your interest in studying ${p.major}.`
      };
    });
    setMatches(fallback);
  };

  // Auto-match on load once profile is populated
  useEffect(() => {
    if (profile) {
      fetchMatches(profile);
    }
  }, []);

  // Matcher Quiz Completion
  const handleQuizComplete = (updates: Partial<StudentProfile>) => {
    const updatedProf = {
      ...profile,
      ...updates
    };
    handleProfileChange(updatedProf);
    setShowQuiz(false);
    fetchMatches(updatedProf);
  };

  // Toggle Save to Dream Board
  const toggleSaveCollege = (collegeId: string) => {
    let nextBoard: SavedCollege[];
    const exists = savedColleges.some(sc => sc.collegeId === collegeId);

    if (exists) {
      nextBoard = savedColleges.filter(sc => sc.collegeId !== collegeId);
    } else {
      // Find matching evaluation category from AI if possible
      const evalMatch = matches.find(m => m.collegeId === collegeId);
      const isSelective = collegesList.find(c => c.id === collegeId)?.acceptanceRate || 0.5 < 0.15;
      const calculatedCategory = isSelective ? 'Reach' : 'Target';

      nextBoard = [
        ...savedColleges,
        {
          collegeId,
          category: calculatedCategory,
          checklist: DEFAULT_CHECKLIST.map(item => ({ ...item }))
        }
      ];
    }

    setSavedColleges(nextBoard);
    localStorage.setItem('dream_school_saved_board', JSON.stringify(nextBoard));
  };

  // Update saved college checklist progress
  const handleToggleChecklistItem = (collegeId: string, itemId: string) => {
    const updated = savedColleges.map(sc => {
      if (sc.collegeId === collegeId) {
        return {
          ...sc,
          checklist: sc.checklist.map(item => {
            if (item.id === itemId) {
              return { ...item, completed: !item.completed };
            }
            return item;
          })
        };
      }
      return sc;
    });

    setSavedColleges(updated);
    localStorage.setItem('dream_school_saved_board', JSON.stringify(updated));
  };

  // Move saved colleges across Reach / Target / Safety
  const handleUpdateCategory = (collegeId: string, category: 'Reach' | 'Target' | 'Safety') => {
    const updated = savedColleges.map(sc => {
      if (sc.collegeId === collegeId) {
        return { ...sc, category };
      }
      return sc;
    });
    setSavedColleges(updated);
    localStorage.setItem('dream_school_saved_board', JSON.stringify(updated));
  };

  // Filter & Search List logic
  const filteredColleges = collegesList.filter(col => {
    const queryMatch = col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       col.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       col.topMajors.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    const regionMatch = selectedRegion === 'All' || col.region === selectedRegion;
    const sizeMatch = selectedSize === 'All' || col.size === selectedSize;

    return queryMatch && regionMatch && sizeMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 font-sans antialiased pb-20">
      
      {/* Visual Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/10">
              <GraduationCap className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-blue-900 to-indigo-950 bg-clip-text text-transparent">
                  Dream School Finder
                </span>
                {subscriptionTier === 'elite' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-md text-[8px] sm:text-[9px] font-black tracking-wide uppercase animate-pulse">
                    <Crown className="w-2.5 h-2.5 fill-amber-500" /> ELITE Counselor
                  </span>
                ) : subscriptionTier === 'standard' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-700 border border-blue-500/20 rounded-md text-[8px] sm:text-[9px] font-black tracking-wide uppercase">
                    STANDARD Pro
                  </span>
                ) : (
                  <button 
                    onClick={() => {
                      setPaymentStep('details');
                      setIsPricingModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded-md text-[8px] sm:text-[9px] font-black tracking-wide cursor-pointer transition-all shadow-sm"
                  >
                    ✨ PLANS & UPGRADES
                  </button>
                )}
              </div>
              <span className="text-[9px] uppercase tracking-wider block font-bold text-slate-400 mt-0.5 leading-none">University Matcher</span>
            </div>
          </div>

          {/* Tab Navigation & Pricing Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="flex items-center gap-0.5 sm:gap-1">
              <button
                onClick={() => setActiveTab('discover')}
                className={`px-2.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'discover'
                    ? 'bg-blue-50 text-blue-700 font-extrabold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Search className="w-4 h-4" /> <span className="hidden md:inline">Discover & Match</span><span className="md:hidden">Discover</span>
              </button>
              <button
                onClick={() => setActiveTab('board')}
                className={`px-2.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 relative ${
                  activeTab === 'board'
                    ? 'bg-blue-50 text-blue-700 font-extrabold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <ClipboardList className="w-4 h-4" /> <span className="hidden md:inline">Dream Board</span><span className="md:hidden">Board</span>
                {savedColleges.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {savedColleges.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('board')} // Direct helper
                onClickCapture={() => setActiveTab('advisor')}
                className={`px-2.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'advisor'
                    ? 'bg-blue-50 text-blue-700 font-extrabold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Brain className="w-4 h-4" /> <span className="hidden md:inline">AI Advisor Clara</span><span className="md:hidden">Clara</span>
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-2.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'pricing'
                    ? 'bg-blue-50 text-blue-700 font-extrabold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-500 fill-amber-500" /> <span className="hidden md:inline">Plans & Pricing</span><span className="md:hidden">Plans</span>
              </button>
            </nav>

            <div className="h-6 w-[1px] bg-slate-100 hidden lg:block" />

            {isPro ? (
              <button
                onClick={handleResetPremiumDemo}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-extrabold text-[11px] rounded-xl transition-all cursor-pointer"
                title="Click to reset premium mode for demo"
              >
                <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Pro Active
              </button>
            ) : (
              <button
                onClick={() => {
                  setPaymentStep('details');
                  setIsPricingModalOpen(true);
                }}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-[11px] rounded-xl shadow-sm shadow-amber-500/20 hover:shadow-md transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 fill-white" /> Upgrade Pro ($30)
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Sections */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        
        {activeTab === 'discover' && (
          <div className="space-y-10">
            
            {/* Vibe matcher prompt / banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Decorative backgrounds */}
              <div className="absolute top-[-100px] left-[-100px] w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
              <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-2 max-w-lg">
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/15">
                  Spark College Matching
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                  Where will your academic journey take you next?
                </h1>
                <p className="text-xs text-blue-100 leading-relaxed max-w-md">
                  Take the interactive matcher quiz, or customize your GPA, SAT, and majors to run personal admissions simulations with Gemini!
                </p>
              </div>

              <div className="relative z-10 shrink-0">
                <button
                  onClick={() => setShowQuiz(true)}
                  className="bg-white hover:bg-slate-50 text-indigo-950 font-extrabold py-3.5 px-6 rounded-2xl text-xs shadow-lg shadow-indigo-950/10 active:scale-[0.99] transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" /> Start College Matcher Quiz
                </button>
              </div>
            </div>

            {/* Quiz overlay */}
            <AnimatePresence>
              {showQuiz && (
                <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-2xl"
                  >
                    <Quiz
                      onComplete={handleQuizComplete}
                      onClose={() => setShowQuiz(false)}
                    />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Profiles & Search layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Stats Customization Form (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <ProfileForm
                  profile={profile}
                  onChange={handleProfileChange}
                  onSubmit={() => fetchMatches(profile)}
                  isSubmitting={loadingMatches}
                />

                {matchError && (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 text-slate-700">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <p className="font-bold text-amber-800">Displaying Local Fit Estimations</p>
                      <p className="text-slate-600 mt-1">To enable deep neural college suggestions, configure a valid <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-600 font-semibold">GEMINI_API_KEY</code> in the Settings Secrets tab.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: College Explorer and matching list (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Custom Filters bar */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by college name, major, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs text-slate-800 font-medium"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Region</span>
                      <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 cursor-pointer focus:outline-none"
                      >
                        <option value="All">All Regions</option>
                        <option value="Northeast">Northeast</option>
                        <option value="West Coast">West Coast</option>
                        <option value="South">South</option>
                        <option value="Midwest">Midwest</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Campus Size</span>
                      <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 cursor-pointer focus:outline-none"
                      >
                        <option value="All">All Sizes</option>
                        <option value="Small">Small Size</option>
                        <option value="Medium">Medium Size</option>
                        <option value="Large">Large Size</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* College grid list */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">
                      Your Matched Colleges ({filteredColleges.length})
                    </h2>
                    {loadingMatches && (
                      <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Recalculating...
                      </span>
                    )}
                  </div>

                  {filteredColleges.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 shadow-sm">
                      <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                      <p className="text-xs font-medium">No schools matching your search filter terms.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {filteredColleges.map((college) => {
                        // Find matching evaluations from Gemini
                        const evalMatch = matches.find(m => m.collegeId === college.id);
                        
                        return (
                          <div key={college.id} className="h-full">
                            <CollegeCard
                              college={college}
                              matchScore={evalMatch?.matchScore}
                              matchReason={evalMatch?.matchReason}
                              isSaved={savedColleges.some(sc => sc.collegeId === college.id)}
                              onSaveToggle={() => toggleSaveCollege(college.id)}
                              onAnalyze={() => setSelectedCollege(college)}
                              studentMajor={profile.major}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Custom college details drawer overlay */}
            {selectedCollege && (
              <CollegeDetailModal
                college={selectedCollege}
                profile={profile}
                isOpen={!!selectedCollege}
                onClose={() => setSelectedCollege(null)}
                isSaved={savedColleges.some(sc => sc.collegeId === selectedCollege.id)}
                onSaveToggle={() => toggleSaveCollege(selectedCollege.id)}
                subscriptionTier={subscriptionTier}
                onUpgradeTrigger={() => {
                  setSelectedCollege(null);
                  setPaymentStep('details');
                  setIsPricingModalOpen(true);
                }}
              />
            )}

          </div>
        )}

        {/* Dream Board tab content */}
        {activeTab === 'board' && (
          <DreamBoard
            savedColleges={savedColleges}
            allColleges={collegesList}
            onToggleChecklistItem={handleToggleChecklistItem}
            onRemoveCollege={toggleSaveCollege}
            onUpdateCategory={handleUpdateCategory}
          />
        )}

        {/* Coach Clara chat tab content */}
        {activeTab === 'advisor' && (
          <div className="space-y-6">
            <div className="max-w-2xl mx-auto text-center space-y-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-block">
                Unlimited Q&A Advising
              </span>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Consult with admissions professionals</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">Ask questions about SAT strategies, boost Extracurricular schedules, or draft Common App supplementary essays.</p>
            </div>
            <AdvisorChat
              profile={profile}
              savedColleges={savedColleges.map(sc => collegesList.find(c => c.id === sc.collegeId)).filter(Boolean) as College[]}
              isPro={isPro}
              subscriptionTier={subscriptionTier}
              onUpgradeTrigger={() => {
                setPaymentStep('details');
                setIsPricingModalOpen(true);
              }}
            />
          </div>
        )}

        {/* Plans & Pricing tab content */}
        {activeTab === 'pricing' && (
          <PricingTab
            subscriptionTier={subscriptionTier}
            onUpgrade={(tier) => {
              setSubscriptionTier(tier);
              localStorage.setItem('dream_school_tier', tier);
              localStorage.setItem('dream_school_pro', 'true');
            }}
            onResetDemo={handleResetPremiumDemo}
          />
        )}

      </main>

      {/* Interactive Tiered Subscription Model Modal */}
      <AnimatePresence>
        {isPricingModalOpen && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full border border-slate-100 shadow-2xl relative my-8"
            >
              {/* Top Progress / Brand Accent */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 h-2 w-full" />
              
              <button
                onClick={() => setIsPricingModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-extrabold text-sm p-2 hover:bg-slate-50 rounded-full transition-all"
              >
                ✕
              </button>

              <div className="p-6 sm:p-10">
                <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-black tracking-widest uppercase">
                    🎓 Flexible Tuition & Counselor Plans
                  </span>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Select your counseling tier</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Compare features designed to guide you through initial university exploration up to comprehensive senior application milestones.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  
                  {/* Left Side: Tier Selector & Comparison */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                      
                      {/* Standard Card Selector */}
                      <button
                        type="button"
                        onClick={() => {
                          setCheckoutTier('standard');
                          if (paymentStep === 'success') setPaymentStep('details');
                        }}
                        className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                          checkoutTier === 'standard'
                            ? 'border-blue-600 bg-blue-50/20 shadow-md'
                            : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        {checkoutTier === 'standard' && (
                          <span className="absolute top-3 right-3 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-white rounded-full" />
                          </span>
                        )}
                        <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">Standard</span>
                        <h4 className="text-base font-extrabold text-slate-950 mt-1">Junior Match</h4>
                        <div className="mt-3 flex items-baseline gap-1">
                          <span className="text-2xl font-black text-slate-950">$15</span>
                          <span className="text-xs text-slate-400">/ month</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">Great for early exploration & customized matching parameters.</p>
                      </button>

                      {/* Elite Card Selector */}
                      <button
                        type="button"
                        onClick={() => {
                          setCheckoutTier('elite');
                          if (paymentStep === 'success') setPaymentStep('details');
                        }}
                        className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                          checkoutTier === 'elite'
                            ? 'border-amber-500 bg-amber-50/10 shadow-md'
                            : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <span className="absolute top-2 right-2 inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-500 text-white rounded-full text-[8px] font-black uppercase tracking-wider">
                          <Crown className="w-2 h-2 fill-white" /> Popular
                        </span>
                        {checkoutTier === 'elite' && (
                          <span className="absolute top-3 right-3 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-white rounded-full" />
                          </span>
                        )}
                        <span className="text-[10px] font-bold tracking-wider text-amber-600 uppercase mt-2 block">Premium Elite</span>
                        <h4 className="text-base font-extrabold text-slate-950 mt-1">Senior Counselor</h4>
                        <div className="mt-3 flex items-baseline gap-1">
                          <span className="text-2xl font-black text-slate-950">$39</span>
                          <span className="text-xs text-slate-400">/ month</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">Full-suite counselor access with essay outlining and financial aid predictors.</p>
                      </button>

                    </div>

                    {/* Dynamic Feature Checklist list */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Included in {checkoutTier === 'elite' ? 'Senior Counselor Elite' : 'Junior Match Standard'}
                      </h4>

                      <div className="space-y-3">
                        <div className="flex items-start gap-2.5">
                          <div className={`p-0.5 rounded-full shrink-0 ${checkoutTier === 'elite' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-xs text-slate-600">
                            {checkoutTier === 'elite' ? (
                              <><strong>Unlimited messaging</strong> to Counselor Coach Clara</>
                            ) : (
                              <>Up to <strong>10 Counselor messages</strong> daily</>
                            )}
                          </p>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <div className={`p-0.5 rounded-full shrink-0 ${checkoutTier === 'elite' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-xs text-slate-600">
                            <strong>Interactive Admissions Probabilities</strong> based on updated criteria
                          </p>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <div className={`p-0.5 rounded-full shrink-0 ${checkoutTier === 'elite' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-xs text-slate-600">
                            Custom milestone tracking checklist tailored to your selective list
                          </p>
                        </div>

                        {checkoutTier === 'elite' && (
                          <>
                            <div className="flex items-start gap-2.5 animate-fadeIn">
                              <div className="p-0.5 rounded-full bg-amber-100 text-amber-600 shrink-0">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                              <p className="text-xs text-slate-600">
                                <strong>Interactive Financial Aid Predictor</strong> inside college detail cards
                              </p>
                            </div>
                            <div className="flex items-start gap-2.5 animate-fadeIn">
                              <div className="p-0.5 rounded-full bg-amber-100 text-amber-600 shrink-0">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                              <p className="text-xs text-slate-600">
                                Specialized deep essay outline tool & mock admissions interview coach
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Secure Checkout Payment Frame */}
                  <div className="lg:col-span-5 bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col justify-between">
                    {paymentStep === 'details' && (
                      <form onSubmit={handleUpgradeSubmit} className="space-y-4">
                        <div className="flex items-center gap-1.5 text-slate-700 pb-2 border-b border-slate-200">
                          <CreditCard className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Secure Billing</span>
                        </div>

                        <div>
                          <label className="text-[9px] font-extrabold text-slate-500 uppercase block mb-1">Select Plan</label>
                          <div className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800">
                            {checkoutTier === 'elite' ? 'Elite Senior Counselor - $39.00/mo' : 'Standard Junior Match - $15.00/mo'}
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] font-extrabold text-slate-500 uppercase block mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            value={paymentForm.name || ''}
                            onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
                            placeholder="Your Name"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 transition-all text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] font-extrabold text-slate-500 uppercase block mb-1">Card Number</label>
                          <input
                            type="text"
                            required
                            value={paymentForm.cardNumber}
                            onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-indigo-500 transition-all text-slate-700"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] font-extrabold text-slate-500 uppercase block mb-1">Expires</label>
                            <input
                              type="text"
                              required
                              value={paymentForm.expiry}
                              onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-indigo-500 transition-all text-slate-700"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-extrabold text-slate-500 uppercase block mb-1">CVC</label>
                            <input
                              type="text"
                              required
                              value={paymentForm.cvc}
                              onChange={(e) => setPaymentForm({ ...paymentForm, cvc: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-indigo-500 transition-all text-slate-700"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className={`w-full py-3 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer mt-2 ${
                            checkoutTier === 'elite'
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                          }`}
                        >
                          Enroll Now for {checkoutTier === 'elite' ? '$39.00/mo' : '$15.00/mo'}
                        </button>

                        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-semibold pt-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> SSL Encrypted & Secure
                        </div>
                      </form>
                    )}

                    {paymentStep === 'processing' && (
                      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                        <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Processing Your Enrollment...</h4>
                          <p className="text-[10px] text-slate-400 mt-1">Configuring your tiered {checkoutTier} credentials</p>
                        </div>
                      </div>
                    )}

                    {paymentStep === 'success' && (
                      <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                        <div className={`p-3 rounded-full border ${checkoutTier === 'elite' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900">Subscription Active!</h4>
                          <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                            Your <span className="font-bold text-indigo-600">{checkoutTier === 'elite' ? 'Elite Senior Counselor' : 'Standard Junior Match'} Plan</span> is now active. 
                            Enjoy comprehensive academic fit guidance!
                          </p>
                        </div>

                        <button
                          onClick={() => setIsPricingModalOpen(false)}
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer mt-4"
                        >
                          Unlock Workspace
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
