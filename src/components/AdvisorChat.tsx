import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, StudentProfile, College } from '../types';
import { Send, Sparkles, MessageSquare, BookOpen, Clock, RefreshCw, User, Brain, Crown } from 'lucide-react';

interface AdvisorChatProps {
  profile: StudentProfile;
  savedColleges: College[];
  isPro?: boolean;
  subscriptionTier?: 'free' | 'standard' | 'elite';
  onUpgradeTrigger?: () => void;
}

const QUICK_PROMPTS = [
  { text: 'How do I boost my extracurriculars?', icon: '🚀' },
  { text: 'How should I choose my Common App essay topic?', icon: '✍️' },
  { text: 'Can you explain Reach vs. Target vs. Safety?', icon: '🎯' },
  { text: 'What questions should I ask on a college tour?', icon: '🏫' }
];

export default function AdvisorChat({ 
  profile, 
  savedColleges, 
  isPro = false, 
  subscriptionTier = 'free', 
  onUpgradeTrigger 
}: AdvisorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'advisor',
      text: `Hi there! I'm Coach Clara, your personalized college admissions advisor. 🎓 \n\nI can help you review college essay topics, organize extracurricular schedules, explain requirements, and map out your strategy. What's on your mind today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/advisor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          profile,
          savedColleges
        })
      });

      const contentType = res.headers.get('content-type');
      let data: any;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.warn('Expected JSON response from advisor-chat, but received:', text.substring(0, 200));
        throw new Error('Server returned an invalid HTML or non-JSON response.');
      }

      if (!res.ok) {
        throw new Error(data?.error || 'Advisory server encountered an issue.');
      }

      const advisorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'advisor',
        text: data.text || 'I apologize, I was unable to compile my thoughts. Let us try again!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, advisorMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'advisor',
        text: 'Sorry, I am having trouble connecting to my advisory data right now. Please check that your Gemini API key is configured in the Settings > Secrets menu.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'advisor',
        text: `Hi there! I'm Coach Clara, your personalized college admissions advisor. 🎓 \n\nI can help you review college essay topics, organize extracurricular schedules, explain requirements, and map out your strategy. What's on your mind today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const messageLimit = subscriptionTier === 'free' ? 3 : subscriptionTier === 'standard' ? 10 : Infinity;
  const userMessageCount = messages.filter(m => m.sender === 'user').length;
  const isLocked = userMessageCount >= messageLimit;

  return (
    <div id="advisor-chat-block" className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[650px] max-w-4xl mx-auto overflow-hidden">
      
      {/* Advisor header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white/20 flex items-center justify-center text-blue-950 font-black text-sm">
              CC
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm leading-tight flex items-center gap-1.5">
              Coach Clara
              {subscriptionTier === 'elite' ? (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase tracking-widest bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md border border-amber-400 shadow-sm animate-pulse">
                  <Crown className="w-2.5 h-2.5 fill-slate-950 text-slate-950" /> ELITE PRO
                </span>
              ) : subscriptionTier === 'standard' ? (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-widest bg-blue-500 text-white px-2 py-0.5 rounded-md border border-blue-400">
                  STANDARD PRO
                </span>
              ) : (
                <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-md border border-slate-600">
                  FREE TRIAL ({userMessageCount}/3)
                </span>
              )}
            </h3>
            <p className="text-[10px] text-blue-200">Expert College Admissions Mentor</p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 hover:bg-white/10 rounded-xl transition-all text-blue-200 hover:text-white"
          title="Reset Advisory Conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main chat viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        
        {/* Helper quick prompts displayed if conversation is basic */}
        {messages.length === 1 && (
          <div className="space-y-3 pb-2">
            <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Quick Advice Topics</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUICK_PROMPTS.map((qp) => (
                <button
                  key={qp.text}
                  onClick={() => handleSend(qp.text)}
                  className="text-left p-3 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/30 hover:border-blue-200 transition-all text-xs font-semibold text-slate-700 flex items-center gap-2"
                >
                  <span className="text-sm shrink-0">{qp.icon}</span>
                  <span className="truncate">{qp.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubble stream */}
        <div className="space-y-4">
          {messages.map((m) => {
            const isAdvisor = m.sender === 'advisor';
            return (
              <div key={m.id} className={`flex gap-3 max-w-[85%] ${isAdvisor ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                
                {/* Avatar */}
                <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
                  isAdvisor ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {isAdvisor ? <Brain className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble content */}
                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm border ${
                    isAdvisor
                      ? 'bg-white text-slate-800 border-slate-100 rounded-tl-none whitespace-pre-wrap'
                      : 'bg-blue-600 text-white border-blue-600 rounded-tr-none'
                  }`}>
                    {m.text}
                  </div>
                  <div className={`text-[9px] text-slate-400 font-medium ${isAdvisor ? 'text-left pl-1' : 'text-right pr-1'}`}>
                    {m.timestamp}
                  </div>
                </div>

              </div>
            );
          })}

          {/* typing indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="w-7.5 h-7.5 rounded-full bg-blue-900 text-white flex items-center justify-center shrink-0">
                <Brain className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input zone or Paywall depending on upgrade state */}
      {isLocked ? (
        <div className="p-5 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl border border-blue-500/20 shrink-0">
              <Crown className="w-5 h-5 fill-blue-500 text-blue-500" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800 leading-none">Advisor Cap Reached ({userMessageCount}/{messageLimit} Messages Used)</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                Upgrade your subscription plan to unlock higher limits, custom roadmap timelines, and financial aid forecasts.
              </p>
            </div>
          </div>
          <button
            onClick={onUpgradeTrigger}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-[11px] rounded-xl shadow-md shadow-blue-500/15 hover:shadow-lg transition-all shrink-0 cursor-pointer text-center"
          >
            Upgrade Subscription
          </button>
        </div>
      ) : (
        <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder={`Ask Coach Clara anything (e.g. "Draft an essay outline for Stanford")...`}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            disabled={isTyping}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-100 text-white disabled:text-slate-400 p-2.5 rounded-xl transition-all shadow shadow-blue-500/10 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
