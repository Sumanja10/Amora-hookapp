import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserProfile, Match } from '../types';
import { Heart, MessageCircle, ArrowRight, X, Smartphone, Sparkles } from 'lucide-react';

interface MatchCelebrationModalProps {
  currentUser: UserProfile;
  match: Match;
  onClose: () => void;
  onOpenChat: (matchId: string) => void;
  onInitiateMpesa?: (match: Match) => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  currentUser,
  match,
  onClose,
  onOpenChat,
  onInitiateMpesa
}) => {
  useEffect(() => {
    // Fire celebratory confetti!
    const count = 200;
    const defaults = {
      origin: { y: 0.65 },
      colors: ['#b64d70', '#d8b975', '#f4e5e9', '#49233f', '#22c55e']
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#e5d4c3] bg-[#2d1427] p-8 text-center text-white shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-[#b64d70]/30 border border-[#b64d70]/60 px-4 py-1.5 text-xs font-bold text-[#f4e5e9] tracking-wider uppercase">
          <img
            src="/assets/aistudio/amora_6904a15c.png"
            alt="AMORA"
            className="h-4 w-4 rounded-md object-contain"
          />
          <Heart className="h-3.5 w-3.5 fill-[#b64d70] text-[#b64d70]" />
          <span>Mutual Connection</span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#fdf8f4]">
            It's a Mutual Match!
          </h2>
          <p className="text-xs sm:text-sm text-[#e4cfe0] max-w-md mx-auto leading-relaxed">
            You and <strong className="text-white">{match.profile.displayName}</strong> both liked each other.
            You share mutual interest in <strong className="text-[#d8b975]">{match.profile.intent === 'casual' ? 'casual meetups' : match.profile.intent}</strong>.
          </p>
        </div>

        {/* Interlocking Portrait Circles */}
        <div className="flex items-center justify-center -space-x-6 py-2">
          <div className="relative z-10">
            <img
              src={currentUser.photos[0]?.url || '/assets/aistudio/amora_6904a15c.png'}
              alt={currentUser.displayName}
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover border-4 border-[#2d1427] shadow-xl"
            />
          </div>

          <div className="relative z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#b64d70] text-white shadow-lg border-2 border-[#2d1427]">
            <Heart className="h-5 w-5 fill-white" />
          </div>

          <div className="relative z-10">
            <img
              src={match.profile.photos[0]?.url || '/assets/aistudio/amora_6904a15c.png'}
              alt={match.profile.displayName}
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover border-4 border-[#2d1427] shadow-xl"
            />
          </div>
        </div>

        {/* Discreet Notice */}
        <div className="rounded-2xl bg-[#49233f]/70 border border-[#6b385e] p-3 text-xs text-[#eedee9] text-left flex items-start gap-2.5">
          <div className="h-2 w-2 rounded-full bg-[#d8b975] mt-1 shrink-0" />
          <div>
            <strong>Discreet Privacy Unlocked:</strong> Any matched-only photos previously hidden in discovery are now accessible between both of you.
          </div>
        </div>

        {/* M-Pesa Connection Feature Highlight */}
        {onInitiateMpesa && (
          <div className="rounded-2xl border-2 border-[#22c55e]/50 bg-[#16502d]/60 p-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22c55e] text-white shadow-xs shrink-0 mt-0.5">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white">Unlock Chatting via M-Pesa</span>
                  <span className="text-[11px] font-mono font-extrabold text-[#86efac] bg-[#14532d] px-2 py-0.5 rounded-full border border-[#22c55e]/40">
                    Ksh 100
                  </span>
                </div>
                <p className="text-[11px] text-[#d1fae5] mt-1 leading-snug">
                  Send <strong className="text-white">Ksh 100</strong> to <strong className="text-white font-mono">+254740047265</strong> to unlock mutual messaging with {match.profile.displayName.split(' ')[0]}.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onInitiateMpesa(match);
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-xs px-4 py-2.5 shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Unlock Chat (Ksh 100)</span>
            </button>
          </div>
        )}

        {/* Mutual Match Guardrail Guarantee */}
        <p className="text-[11px] text-[#f4e5e9]/90 leading-tight">
          🔒 <strong>Double Opt-In Protected:</strong> Both members agreed. Your private encrypted chat channel is now unlocked and open.
        </p>

        {/* Primary Action Buttons */}
        <div className="pt-1 flex flex-col sm:flex-row items-center gap-3 justify-center">
          <button
            onClick={() => {
              onClose();
              onOpenChat(match.id);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#b64d70] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#9e385a] transition-all cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Open Private Chat</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-semibold text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <span>Keep Swiping</span>
          </button>
        </div>

      </div>
    </div>
  );
};
