import React from 'react';
import { Lock, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, MapPin, EyeOff } from 'lucide-react';
import { UserProfile } from '../types';

interface HowItWorksViewProps {
  onStartDiscovery: () => void;
  onOpenSafetyCharter: () => void;
  currentUser?: UserProfile | null;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({
  onStartDiscovery,
  onOpenSafetyCharter,
  currentUser
}) => {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#b64d70]/30 bg-[#f4e5e9] px-3.5 py-1 text-xs font-bold text-[#b64d70] uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Platform Guide</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#49233f] tracking-tight">
          How TEKA Works
        </h1>
        <p className="text-sm sm:text-base text-[#6c5567] leading-relaxed">
          TEKA is built for consenting adults aged 18 and above. Our core architecture prioritizes speed, mutual attraction, and total privacy over long-term formalities.
        </p>
      </div>

      {/* The 4 Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pillar 1: Photo Locks */}
        <div className="rounded-3xl border border-[#e5d8cb] bg-white p-7 shadow-xs space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4e5e9] text-[#b64d70]">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#49233f]">
            Discreet Matched-Only Photo Locks
          </h3>
          <p className="text-sm text-[#6c5567] leading-relaxed">
            Maintain complete control of your privacy. Choose which photos are visible on campus discovery and which remain strictly locked until both members mutually like each other.
          </p>
          <div className="pt-2 text-xs font-semibold text-[#887082] flex items-center gap-2">
            <EyeOff className="h-4 w-4 text-[#b64d70]" />
            <span>Zero accidental campus exposure</span>
          </div>
        </div>

        {/* Pillar 2: Explicit Intent */}
        <div className="rounded-3xl border border-[#e5d8cb] bg-white p-7 shadow-xs space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8f0dd] text-[#af8c3e]">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#49233f]">
            Explicit Intent & Fast Matching
          </h3>
          <p className="text-sm text-[#6c5567] leading-relaxed">
            Eliminate mixed signals. Filter directly for casual meetups, dating, or spontaneous rendezvous. Chat only unlocks when both adults agree and confirm attraction.
          </p>
          <div className="pt-2 text-xs font-semibold text-[#887082] flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
            <span>Mutual consent required to message</span>
          </div>
        </div>

        {/* Pillar 3: Strict Location Privacy */}
        <div className="rounded-3xl border border-[#e5d8cb] bg-white p-7 shadow-xs space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4e5e9] text-[#b64d70]">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#49233f]">
            Strict Location Privacy
          </h3>
          <p className="text-sm text-[#6c5567] leading-relaxed">
            Live GPS coordinates and exact residential addresses are never broadcast. Members choose whether to share an approximate campus vicinity or stay discreet.
          </p>
          <div className="pt-2 text-xs font-semibold text-[#887082] flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#b64d70]" />
            <span>Approximate radius by default</span>
          </div>
        </div>

      </div>

      {/* Campus Communities Section */}
      <div className="rounded-3xl border border-[#ded1c2] bg-[#49233f] p-8 sm:p-10 text-white space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#d8b975]">
            Kenyan University Network
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Active Communities Across Kenya
          </h2>
          <p className="text-sm text-[#edd8e6] max-w-2xl leading-relaxed">
            TEKA brings consenting adults together across University of Nairobi (Main, Chiromo, Lower Kabete), JKUAT, Maseno University (Main, City, and Odero Okang'o campuses), MMUST Kakamega, Uzima University, and Rongo University.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={onStartDiscovery}
            className="inline-flex items-center gap-2 rounded-xl bg-[#d8b975] px-6 py-3 text-sm font-bold text-[#32162a] hover:bg-[#e4cb91] transition-all cursor-pointer"
          >
            <span>Start Campus Discovery</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={onOpenSafetyCharter}
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <span>Read Adult Consent Charter</span>
          </button>
        </div>
      </div>

    </div>
  );
};
