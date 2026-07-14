import { College, SavedCollege, ChecklistItem } from '../types';
import { CheckSquare, Square, Trash2, Award, ClipboardList, CheckCircle2, Star } from 'lucide-react';

interface DreamBoardProps {
  savedColleges: SavedCollege[];
  allColleges: College[];
  onToggleChecklistItem: (collegeId: string, itemId: string) => void;
  onRemoveCollege: (collegeId: string) => void;
  onUpdateCategory: (collegeId: string, category: 'Reach' | 'Target' | 'Safety') => void;
}

export default function DreamBoard({
  savedColleges,
  allColleges,
  onToggleChecklistItem,
  onRemoveCollege,
  onUpdateCategory
}: DreamBoardProps) {

  // Map saved colleges IDs to full college objects
  const savedList = savedColleges.map(sc => {
    const fullCollege = allColleges.find(c => c.id === sc.collegeId);
    return {
      ...sc,
      college: fullCollege
    };
  }).filter(item => item.college !== undefined) as (SavedCollege & { college: College })[];

  // Group by category
  const reaches = savedList.filter(s => s.category === 'Reach');
  const targets = savedList.filter(s => s.category === 'Target');
  const safeties = savedList.filter(s => s.category === 'Safety');

  // Calculate stats
  const totalTasks = savedList.reduce((acc, curr) => acc + curr.checklist.length, 0);
  const completedTasks = savedList.reduce(
    (acc, curr) => acc + curr.checklist.filter(item => item.completed).length, 0
  );
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const renderSection = (title: string, list: typeof savedList, badgeColor: string) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <span className={`w-3 h-3 rounded-full ${badgeColor}`} />
          <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">{title} ({list.length})</h3>
        </div>

        {list.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-400 bg-slate-50/50">
            No schools categorized under {title.toLowerCase()} yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {list.map((sc) => {
              const completedCount = sc.checklist.filter(item => item.completed).length;
              const totalCount = sc.checklist.length;
              const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              return (
                <div key={sc.collegeId} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 hover:shadow-md transition-all">
                  
                  {/* Top line with title and actions */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{sc.college.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">{sc.college.location}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Category Selector */}
                      <select
                        value={sc.category}
                        onChange={(e) => onUpdateCategory(sc.collegeId, e.target.value as any)}
                        className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 px-2 rounded-lg focus:outline-none border-none cursor-pointer"
                      >
                        <option value="Reach">Reach</option>
                        <option value="Target">Target</option>
                        <option value="Safety">Safety</option>
                      </select>

                      <button
                        onClick={() => onRemoveCollege(sc.collegeId)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        title="Remove School"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Checklist progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      <span>Application tasks</span>
                      <span>{completedCount} of {totalCount} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Interactive checklist block */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {sc.checklist.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onToggleChecklistItem(sc.collegeId, item.id)}
                        className="w-full flex items-center gap-2.5 text-left py-1 text-xs text-slate-600 hover:text-slate-950 transition-all group"
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 fill-emerald-50" />
                        ) : (
                          <div className="w-4 h-4 rounded border border-slate-300 group-hover:border-slate-400 shrink-0" />
                        )}
                        <span className={item.completed ? 'line-through text-slate-400 font-medium' : 'font-medium text-slate-700'}>
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="dream-board-canvas" className="space-y-8 max-w-5xl mx-auto">
      
      {/* Overview Card */}
      <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden border border-slate-800">
        <div className="absolute top-[-50px] left-[-50px] w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/20">
            <ClipboardList className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Your College Application Dream Board</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Organize your matching target colleges, classify candidacy, and check off active application items on your path to admissions.
            </p>
          </div>
        </div>

        {savedList.length > 0 && (
          <div className="text-center md:text-right relative z-10 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dream List Completion</span>
            <div className="text-3xl font-black text-blue-400 mt-1 flex items-center justify-center md:justify-end gap-1.5">
              <Star className="w-6 h-6 fill-blue-400" /> {overallProgress}%
            </div>
            <p className="text-[10px] text-slate-500 mt-1">{completedTasks} of {totalTasks} milestones completed</p>
          </div>
        )}
      </div>

      {savedList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
            <Star className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-base">Your Dream Board is empty</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Find colleges in the matching tab, run an AI fit analysis, and save them as Safety, Target, or Reach colleges to organize application tasks!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {renderSection('Reach Schools (Aspirational fit, lower admit probability)', reaches, 'bg-rose-500')}
          {renderSection('Target Schools (Solid fit, stats align perfectly)', targets, 'bg-blue-500')}
          {renderSection('Safety Schools (High probability fit, stable option)', safeties, 'bg-emerald-500')}
        </div>
      )}

    </div>
  );
}
