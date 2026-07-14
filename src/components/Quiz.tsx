import { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/colleges';
import { StudentProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface QuizProps {
  onComplete: (profileUpdates: Partial<StudentProfile>) => void;
  onClose: () => void;
}

export default function Quiz({ onComplete, onClose }: QuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = QUIZ_QUESTIONS[currentStep];

  const selectOption = (val: string) => {
    setAnswers({
      ...answers,
      [question.id]: val
    });
  };

  const nextStep = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Map quiz responses into Partial StudentProfile
      const updates: Partial<StudentProfile> = {
        campusSize: answers['campus_size'] ? [answers['campus_size']] : ['Medium'],
        locationPreference: answers['vibe'] ? [answers['vibe']] : ['West Coast'],
        interests: answers['primary_goal'] ? [answers['primary_goal']] : ['Research']
      };

      if (answers['college_type'] && answers['college_type'] !== 'any') {
        // Just storing preferred college type if they choose Public/Private
      }

      onComplete(updates);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = ((currentStep) / QUIZ_QUESTIONS.length) * 100;
  const isSelected = answers[question?.id] !== undefined;

  return (
    <div id="matching-quiz" className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden border border-slate-800">
      {/* Background glow */}
      <div className="absolute top-[-100px] left-[-100px] w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-72 h-72 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2 text-blue-400">
          <Sparkles className="w-5 h-5 fill-blue-400" />
          <span className="text-xs font-semibold uppercase tracking-wider">Dream Vibe Matcher</span>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-all"
        >
          Skip Quiz
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full mb-8 relative overflow-hidden">
        <motion.div
          className="bg-blue-500 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="min-h-[300px] flex flex-col justify-between relative z-10"
        >
          <div>
            <span className="text-xs text-slate-400 font-medium">Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
            <h3 className="text-xl md:text-2xl font-bold text-white mt-1 mb-6 leading-snug">
              {question.text}
            </h3>

            <div className="space-y-3">
              {question.options.map((opt) => {
                const isCurrent = answers[question.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => selectOption(opt.value)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 relative ${
                      isCurrent
                        ? 'bg-blue-600/10 border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-slate-800/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      isCurrent
                        ? 'border-blue-400 bg-blue-500 text-white'
                        : 'border-slate-600 bg-slate-900'
                    }`}>
                      {isCurrent && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-200">{opt.label}</h4>
                      <p className="text-xs text-slate-400 mt-1">{opt.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800/50">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={nextStep}
              disabled={!isSelected}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isSelected
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 active:scale-[0.98]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {currentStep === QUIZ_QUESTIONS.length - 1 ? 'Finish Matcher' : 'Next Question'}{' '}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
