import React from 'react';
import { ArrowRight, Shield, Sparkles, Users, Lock, Smartphone } from 'lucide-react';

interface HeroHomeProps {
  onExploreMarketplace: () => void;
  onMeetPeople: () => void;
  onOpenLogin: () => void;
  onOpenHowItWorks?: () => void;
  onOpenSafety?: () => void;
}

export const HeroHome: React.FC<HeroHomeProps> = ({
  onExploreMarketplace,
  onMeetPeople,
  onOpenLogin,
  onOpenHowItWorks,
  onOpenSafety
}) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center overflow-hidden bg-[#070208] text-white px-4 sm:px-6 lg:px-8 select-none">
      
      {/* Ambient background glow accents (Black, Deep Purple, Hot Pink) */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] rounded-full bg-gradient-to-tr from-[#831843]/30 via-[#db2777]/25 to-[#4c0519]/10 blur-[100px] sm:blur-[140px]" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[300px] rounded-full bg-gradient-to-t from-[#260523]/50 via-[#160215]/30 to-transparent blur-[110px]" 
      />

      {/* Subtle background radial overlay */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#070208_80%)]"
      />

      {/* Main Hero Content Area */}
      <main className="relative z-10 w-full max-w-xl sm:max-w-2xl my-auto py-12 sm:py-16 flex flex-col items-center text-center space-y-8">
        
        {/* Prominent TEKA Brand Emblem & Wordmark */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative group cursor-pointer" onClick={onExploreMarketplace}>
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#e11d48] to-[#be185d] opacity-50 blur-lg group-hover:opacity-75 transition duration-300" />
            <img
              src="/assets/teka_brand_logo.jpg"
              alt="TEKA"
              className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-3xl object-cover shadow-2xl border border-white/10 bg-[#120414] transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <span className="font-serif text-3xl sm:text-4xl font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#fce7f3] to-[#f472b6]">
            TEKA
          </span>
          <span className="text-[11px] font-bold text-[#d8b975] uppercase tracking-widest">
            Your vibe. Your people. Your choice.
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12] [text-wrap:balance]">
          Premium Content & Intentional Encounters
        </h1>

        {/* Short Description */}
        <p className="text-sm sm:text-base md:text-lg font-light text-[#d8b4d0] tracking-wide max-w-lg leading-relaxed">
          Unlock exclusive lifestyle media with one-time M-Pesa payments in Kenyan Shillings, or discover verified adults seeking genuine connection.
        </p>

        {/* Dual Call to Action Buttons */}
        <div className="w-full max-w-md flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          
          {/* Primary Action 1: Explore Creator Marketplace */}
          <button
            onClick={onExploreMarketplace}
            className="flex-1 h-13 px-6 rounded-2xl bg-gradient-to-r from-[#e11d48] via-[#db2777] to-[#b64d70] hover:from-[#f43f5e] hover:to-[#be185d] text-white font-bold text-sm tracking-wide shadow-[0_6px_32px_rgba(219,39,119,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border border-white/20"
          >
            <Sparkles className="h-4 w-4" />
            <span>Explore Creators</span>
          </button>

          {/* Primary Action 2: Meet People */}
          <button
            onClick={onMeetPeople}
            className="flex-1 h-13 px-6 rounded-2xl bg-[#1e0722] hover:bg-[#2b0a31] border border-[#541c4a] text-white font-bold text-sm tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <Users className="h-4 w-4 text-[#e87a90]" />
            <span>Meet People (18+)</span>
          </button>

        </div>

        {/* Secondary Login Link */}
        <button
          onClick={onOpenLogin}
          className="text-xs sm:text-sm font-medium text-[#c09ab8] hover:text-white transition-colors cursor-pointer py-1 underline-offset-4 hover:underline"
        >
          Already a member? Log in
        </button>

        {/* Trust Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#8d6284]">
          <span className="flex items-center gap-1 rounded-md border border-[#481c3e] bg-[#1a0618] px-2.5 py-1 text-[11px] font-bold text-[#b6739f]">
            <Shield className="h-3 w-3 text-[#db2777]" />
            18+ Verified Kenya
          </span>
          <span className="flex items-center gap-1 rounded-md border border-[#481c3e] bg-[#1a0618] px-2.5 py-1 text-[11px] font-bold text-emerald-400">
            <Smartphone className="h-3 w-3" />
            Lipa Na M-Pesa KSh
          </span>
          <span className="flex items-center gap-1 rounded-md border border-[#481c3e] bg-[#1a0618] px-2.5 py-1 text-[11px] font-bold text-amber-300">
            <Lock className="h-3 w-3" />
            No Subscriptions
          </span>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7e5676]">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-white/80 tracking-wider">TEKA</span>
          <span aria-hidden="true">·</span>
          <span>Kenyan Creator Marketplace & Adult Social Network</span>
        </div>

        <div className="flex items-center gap-5">
          {onOpenHowItWorks && (
            <button
              onClick={onOpenHowItWorks}
              className="text-[#9e7696] hover:text-[#f472b6] transition-colors cursor-pointer font-medium"
            >
              How It Works
            </button>
          )}
          {onOpenSafety && (
            <button
              onClick={onOpenSafety}
              className="text-[#9e7696] hover:text-[#f472b6] transition-colors cursor-pointer font-medium"
            >
              18+ Safety Charter
            </button>
          )}
        </div>
      </footer>

    </div>
  );
};
