import React, { useState } from 'react';
import { Crown, Check, CreditCard, ShieldCheck, RefreshCw, Star, ArrowRight, BookOpen, Calculator, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PricingTabProps {
  subscriptionTier: 'free' | 'standard' | 'elite';
  onUpgrade: (tier: 'standard' | 'elite') => void;
  onResetDemo: () => void;
}

export default function PricingTab({ subscriptionTier, onUpgrade, onResetDemo }: PricingTabProps) {
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'elite'>('standard');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'one-time'>('one-time');
  const [checkoutStep, setCheckoutStep] = useState<'view' | 'form' | 'processing' | 'success'>('view');
  
  // Checkout Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/28',
    cvc: '123'
  });

  const handlePlanSelection = (tier: 'standard' | 'elite') => {
    setSelectedPlan(tier);
    setCheckoutStep('form');
  };

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('processing');
    setTimeout(() => {
      setCheckoutStep('success');
      onUpgrade(selectedPlan);
    }, 1500);
  };

  return (
    <div id="pricing-tab-view" className="max-w-5xl mx-auto space-y-12 pb-16">
      
      {/* Header and Value Proposition */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[10px] font-black tracking-widest uppercase">
          💎 Transparent Academic Licensing
        </span>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
          Admissions Guidance Made Affordable
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Unlock standard university matching capabilities, advanced admissions predictor engines, and unlimited mentor consultation with our specialized plans.
        </p>
      </div>

      {/* Main Grid: Comparison & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Three Tiers Pricing Cards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center bg-slate-100 p-1.5 rounded-2xl max-w-sm mx-auto border border-slate-200">
            <button
              onClick={() => setBillingCycle('one-time')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                billingCycle === 'one-time' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Lifetime License
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all relative ${
                billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Subscription
              <span className="absolute -top-3.5 -right-2 px-1.5 py-0.5 bg-indigo-600 text-white rounded-full text-[8px] font-black uppercase">
                New
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Free Tier Card */}
            <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between h-[360px] bg-white ${
              subscriptionTier === 'free' ? 'border-slate-300 ring-1 ring-slate-100 shadow-sm' : 'border-slate-100 opacity-75'
            }`}>
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Basic</span>
                  <h3 className="font-extrabold text-slate-900 text-base">Free Trial</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-950">$0</span>
                  <span className="text-slate-400 text-[10px] font-semibold">forever</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Basic university matching parameters with access to standard dream checklists.
                </p>
                <div className="h-[1px] bg-slate-100" />
                <ul className="space-y-2 text-[10px] text-slate-600 font-medium">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" /> 3 Free Advisor Messages
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" /> Standard Dream Board
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" /> Standard Checklists
                  </li>
                </ul>
              </div>
              <div className="pt-4">
                {subscriptionTier === 'free' ? (
                  <span className="w-full block py-2 bg-slate-100 text-slate-500 font-extrabold text-[10px] rounded-xl text-center">
                    Current Active Plan
                  </span>
                ) : (
                  <button
                    onClick={onResetDemo}
                    className="w-full py-2 border border-slate-200 text-slate-500 hover:text-slate-800 font-extrabold text-[10px] rounded-xl text-center transition-all cursor-pointer"
                  >
                    Downgrade
                  </button>
                )}
              </div>
            </div>

            {/* Standard Tier Card */}
            <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between h-[360px] relative ${
              subscriptionTier === 'standard' 
                ? 'border-blue-500 ring-2 ring-blue-50 bg-blue-50/5 shadow-md' 
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}>
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-blue-600">Standard Match</span>
                  <h3 className="font-extrabold text-slate-900 text-base">Junior License</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-950">$30</span>
                  <span className="text-slate-400 text-[10px] font-semibold">
                    {billingCycle === 'one-time' ? '/ lifetime license' : '/ month'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Tailored milestone checkpoints combined with reliable predictor metrics.
                </p>
                <div className="h-[1px] bg-slate-100" />
                <ul className="space-y-2 text-[10px] text-slate-600 font-medium">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-500 stroke-[2.5]" /> 10 Chat Messages Daily
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-500 stroke-[2.5]" /> Interactive Match Predictor
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-500 stroke-[2.5]" /> Custom Dream Milestone Checklists
                  </li>
                </ul>
              </div>
              <div className="pt-4">
                {subscriptionTier === 'standard' ? (
                  <span className="w-full block py-2 bg-blue-100 text-blue-700 font-extrabold text-[10px] rounded-xl text-center">
                    Current Active Plan
                  </span>
                ) : (
                  <button
                    onClick={() => handlePlanSelection('standard')}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] rounded-xl text-center transition-all cursor-pointer shadow shadow-blue-500/10 flex items-center justify-center gap-1"
                  >
                    Select Plan <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Elite Tier Card */}
            <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between h-[360px] relative ${
              subscriptionTier === 'elite' 
                ? 'border-amber-500 ring-2 ring-amber-50 bg-amber-50/5 shadow-md' 
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}>
              <span className="absolute top-3 right-3 inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-500 text-white rounded-full text-[7px] font-black uppercase tracking-wider shadow-sm">
                <Crown className="w-1.5 h-1.5 fill-white" /> Popular
              </span>
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-600">Senior Elite</span>
                  <h3 className="font-extrabold text-slate-900 text-base">Pro Counselor</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-950">
                    {billingCycle === 'one-time' ? '$60' : '$60'}
                  </span>
                  <span className="text-slate-400 text-[10px] font-semibold">
                    {billingCycle === 'one-time' ? '/ lifetime' : '/ month'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Deep analytics suite, unlimited chat advisor, and interactive cost analysis trackers.
                </p>
                <div className="h-[1px] bg-slate-100" />
                <ul className="space-y-2 text-[10px] text-slate-600 font-medium">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-500 stroke-[2.5]" /> Unlimited Advisor Q&A
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-500 stroke-[2.5]" /> Interactive Aid Predictor
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-500 stroke-[2.5]" /> Custom Mock Interviews
                  </li>
                  <li className="flex items-center gap-1.5 font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Priority 24/7 Queue
                  </li>
                </ul>
              </div>
              <div className="pt-4">
                {subscriptionTier === 'elite' ? (
                  <span className="w-full block py-2 bg-amber-500 text-white font-extrabold text-[10px] rounded-xl text-center shadow-sm">
                    Current Active Plan
                  </span>
                ) : (
                  <button
                    onClick={() => handlePlanSelection('elite')}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-[10px] rounded-xl text-center transition-all cursor-pointer shadow shadow-amber-500/15 flex items-center justify-center gap-1"
                  >
                    Select Plan <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Interactive Feature Matrix Chart */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Complete Feature Breakdown</h4>
            <div className="divide-y divide-slate-100 text-[11px]">
              <div className="grid grid-cols-4 py-2 font-bold text-slate-400 text-[9px] uppercase">
                <span className="col-span-1">Feature</span>
                <span className="text-center">Free</span>
                <span className="text-center">Junior</span>
                <span className="text-center">Pro Counselor</span>
              </div>
              <div className="grid grid-cols-4 py-2.5 items-center">
                <span className="font-semibold text-slate-700">Coach Clara AI Q&A</span>
                <span className="text-center text-slate-400">3 messages limit</span>
                <span className="text-center text-slate-500">10 daily</span>
                <span className="text-center text-emerald-600 font-extrabold">Unlimited</span>
              </div>
              <div className="grid grid-cols-4 py-2.5 items-center">
                <span className="font-semibold text-slate-700">Admissions Probability Calculator</span>
                <span className="text-center text-red-400">✕</span>
                <span className="text-center text-emerald-500">✔ standard</span>
                <span className="text-center text-emerald-600 font-extrabold">✔ deep criterion</span>
              </div>
              <div className="grid grid-cols-4 py-2.5 items-center">
                <span className="font-semibold text-slate-700">Financial Aid & Scholarship Planner</span>
                <span className="text-center text-red-400">✕</span>
                <span className="text-center text-slate-400">✕</span>
                <span className="text-center text-emerald-600 font-extrabold">✔ interactive</span>
              </div>
              <div className="grid grid-cols-4 py-2.5 items-center">
                <span className="font-semibold text-slate-700">Personalized Milestones Checklist</span>
                <span className="text-center text-slate-400">Basic</span>
                <span className="text-center text-slate-500">Full</span>
                <span className="text-center text-emerald-600 font-extrabold">Custom Tailored</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Secure Checkout Portal */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-sm min-h-[450px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {checkoutStep === 'view' && (
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-center my-auto py-8"
              >
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full w-14 h-14 mx-auto flex items-center justify-center border border-blue-100">
                  <CreditCard className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-extrabold text-slate-900">Interactive Billing Desk</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Select one of our admissions plans on the left to initiate our secure, sandbox billing interface.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> AES-256 Bit SSL Encryption
                </div>
              </motion.div>
            )}

            {checkoutStep === 'form' && (
              <motion.form
                key="form"
                onSubmit={handleSubmitCheckout}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-1.5 text-slate-700 pb-2 border-b border-slate-200">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-600">Secure Order Form</span>
                </div>

                <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase">Selected Plan</span>
                    <h5 className="text-xs font-black text-slate-800">
                      {selectedPlan === 'elite' ? 'Pro Counselor Elite' : 'Junior Match Standard'}
                    </h5>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase">Total Due</span>
                    <p className="text-sm font-black text-slate-950">
                      {selectedPlan === 'elite' ? '$60.00' : '$30.00'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 transition-all text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    value={form.cardNumber}
                    onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-indigo-500 transition-all text-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Expires</label>
                    <input
                      type="text"
                      required
                      value={form.expiry}
                      onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-indigo-500 transition-all text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">CVC</label>
                    <input
                      type="text"
                      required
                      value={form.cvc}
                      onChange={(e) => setForm({ ...form, cvc: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-indigo-500 transition-all text-slate-700"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
                >
                  Pay {selectedPlan === 'elite' ? '$60.00' : '$30.00'} & Upgrade
                </button>

                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-semibold pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> SSL Encrypted & Secure
                </div>
              </motion.form>
            )}

            {checkoutStep === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-4 my-auto"
              >
                <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">Processing Your Enrollment...</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Deploying private counseling tokens on your active sandbox</p>
                </div>
              </motion.div>
            )}

            {checkoutStep === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-6 flex flex-col items-center justify-center text-center space-y-4 my-auto"
              >
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                  <Star className="w-8 h-8 fill-emerald-500 text-emerald-500 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Upgrade Successful!</h4>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    Your account has been fully provisioned to <span className="font-black text-indigo-600">{selectedPlan === 'elite' ? 'Pro Counselor Elite' : 'Junior Match Standard'}</span>. Enjoy unrestricted premium utilities!
                  </p>
                </div>

                <button
                  onClick={() => setCheckoutStep('view')}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer mt-4"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
