import React from 'react';
import { StudentProfile } from '../types';
import { Sparkles, GraduationCap, DollarSign, MapPin, Building, Award } from 'lucide-react';

interface ProfileFormProps {
  profile: StudentProfile;
  onChange: (profile: StudentProfile) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const REGIONS = ['Northeast', 'West Coast', 'South', 'Midwest'];
const CAMPUS_SIZES = [
  { value: 'Small', label: 'Small (< 3k)' },
  { value: 'Medium', label: 'Medium (3k - 15k)' },
  { value: 'Large', label: 'Large (15k+)' }
];
const INTERESTS = ['Research', 'Arts', 'Sports', 'Entrepreneurship', 'Social Activism', 'Global Study', 'Pre-Med Vibe', 'Tech Hub'];
const COMMON_MAJORS = [
  'Computer Science', 'Mechanical Engineering', 'Business & Finance', 'Biology & Pre-Med',
  'Political Science & Pre-Law', 'Psychology', 'Economics', 'Art & Design', 'English Literature', 'Undecided'
];

export default function ProfileForm({ profile, onChange, onSubmit, isSubmitting = false }: ProfileFormProps) {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      ...profile,
      [name]: name === 'gpa' ? parseFloat(value) || 0 : value
    });
  };

  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'sat' | 'act') => {
    const val = parseInt(e.target.value);
    onChange({
      ...profile,
      [field]: isNaN(val) ? undefined : val
    });
  };

  const toggleRegion = (region: string) => {
    const next = profile.locationPreference.includes(region)
      ? profile.locationPreference.filter(r => r !== region)
      : [...profile.locationPreference, region];
    onChange({ ...profile, locationPreference: next });
  };

  const toggleSize = (size: string) => {
    const next = profile.campusSize.includes(size)
      ? profile.campusSize.filter(s => s !== size)
      : [...profile.campusSize, size];
    onChange({ ...profile, campusSize: next });
  };

  const toggleInterest = (interest: string) => {
    const next = profile.interests.includes(interest)
      ? profile.interests.filter(i => i !== interest)
      : [...profile.interests, interest];
    onChange({ ...profile, interests: next });
  };

  return (
    <div id="profile-form-container" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Your Student Profile</h2>
          <p className="text-sm text-slate-500">Configure your stats and goals to find perfectly aligned dream universities.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Academic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Unweighted GPA</label>
            <div className="relative">
              <input
                type="number"
                name="gpa"
                step="0.01"
                min="0.0"
                max="4.0"
                value={profile.gpa || ''}
                onChange={handleTextChange}
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                placeholder="e.g. 3.85"
                required
              />
              <span className="absolute right-3 top-3 text-xs text-slate-400 font-medium">/ 4.0</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">SAT Score (Optional)</label>
            <input
              type="number"
              min="400"
              max="1600"
              value={profile.sat || ''}
              onChange={(e) => handleNumChange(e, 'sat')}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
              placeholder="e.g. 1450"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">ACT Score (Optional)</label>
            <input
              type="number"
              min="1"
              max="36"
              value={profile.act || ''}
              onChange={(e) => handleNumChange(e, 'act')}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
              placeholder="e.g. 32"
            />
          </div>
        </div>

        {/* Intended Major & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Intended Major</label>
            <div className="relative">
              <select
                name="major"
                value={profile.major}
                onChange={handleTextChange}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium appearance-none cursor-pointer"
              >
                {COMMON_MAJORS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <div className="absolute right-3 top-3 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-500" /> Net Tuition Budget Vibe
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'medium', 'high', 'any'] as const).map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => onChange({ ...profile, budget: b })}
                  className={`py-2.5 text-sm font-semibold rounded-xl transition-all border capitalize ${
                    profile.budget === b
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Campus Location Preference */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" /> Preferred Geographical Regions
          </label>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map(r => {
              const selected = profile.locationPreference.includes(r);
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleRegion(r)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all ${
                    selected
                      ? 'bg-blue-50 text-blue-700 border-blue-200 ring-2 ring-blue-500/10'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Campus Size Preference */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-slate-500" /> Preferred Campus Size
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CAMPUS_SIZES.map(s => {
              const selected = profile.campusSize.includes(s.value);
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => toggleSize(s.value)}
                  className={`py-2 px-3 text-sm font-medium rounded-xl border transition-all ${
                    selected
                      ? 'bg-blue-50 text-blue-700 border-blue-200 ring-2 ring-blue-500/10'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Extra-curricular / Campus Vibes */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-slate-500" /> Campus Culture & Key Activities
          </label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(i => {
              const selected = profile.interests.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleInterest(i)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                    selected
                      ? 'bg-violet-50 text-violet-700 border-violet-200 ring-2 ring-violet-500/10'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {selected ? '✦ ' : ''}{i}
                </button>
              );
            })}
          </div>
        </div>

        {/* Find Matches Trigger */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            {isSubmitting ? 'AI Finding Perfect Matches...' : 'Find Matches & Analyze Fit'}
          </button>
        </div>
      </div>
    </div>
  );
}
