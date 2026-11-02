import React, { useState } from 'react';
import { ShieldCheck, Crown, X, ArrowRight, CheckCircle2, Lock, Smartphone, University } from 'lucide-react';

interface CreatorLoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  onCreatorLogin: (email: string) => Promise<void>;
}

export const CreatorLoginModal: React.FC<CreatorLoginModalProps> = ({
  onClose,
  onLoginSuccess,
  onCreatorLogin
}) => {
  const [email, setEmail] = useState('dennistarus10@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (targetEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await onCreatorLogin(targetEmail);
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate as creator');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#e2d5c5] bg-[#fbf9f6] p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden">
        
        {/* Subtle decorative gold/plum header glow */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#d4af37] via-[#b64d70] to-[#49233f]" />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-[#887082] hover:text-[#49233f] p-1.5 rounded-full hover:bg-[#ede5dc] transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pt-2">
          <img
            src="/assets/teka_brand_logo.jpg"
            alt="TEKA Logo"
            className="h-12 w-12 rounded-2xl shadow-sm border border-[#d4af37]/40 object-cover shrink-0"
          />
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fef9e7] px-2.5 py-0.5 text-xs font-semibold text-[#8a6d1c]">
              <Crown className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>TEKA Founder & Creator Portal</span>
            </div>

            <h2 className="font-serif text-2xl font-bold tracking-tight text-[#49233f]">
              Log In as App Creator
            </h2>
            <p className="text-xs text-[#786172] leading-relaxed">
              Direct authenticated access for <strong className="text-[#49233f]">Dennis Tarus</strong> to manage Kenyan campus moderation, view the live M-Pesa revenue ledger for <strong className="text-[#49233f]">+254740047265</strong>, and test features with the verified founder persona.
            </p>
          </div>
        </div>

        {/* Creator Account Card */}
        <div className="rounded-2xl border border-[#e5d8cb] bg-white p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <img
                src="/images/creator_dennis_tarus_1793271699871.jpg"
                alt="Dennis Tarus"
                className="h-14 w-14 rounded-2xl object-cover border-2 border-[#d4af37]"
              />
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#d4af37] text-[10px] text-white shadow-xs">
                👑
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#49233f] truncate">Dennis Tarus</h3>
                <span className="rounded-full bg-[#faebd7] px-2 py-0.5 text-[10px] font-bold text-[#8a6d1c] border border-[#d4af37]/30">
                  Creator
                </span>
              </div>
              <p className="text-xs text-[#786172] truncate">dennistarus10@gmail.com</p>
              <p className="text-[11px] font-medium text-[#b64d70] mt-0.5">
                Maseno University (Main campus) · Computer Science
              </p>
            </div>
          </div>

          {/* Key Creator Privileges */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f0e7dd] text-[11px] text-[#6b5866]">
            <div className="flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-[#2e7d32]" />
              <span>M-Pesa: +254740047265</span>
            </div>
            <div className="flex items-center gap-1.5">
              <University className="h-3.5 w-3.5 text-[#b64d70]" />
              <span>6 Kenyan Universities</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#b64d70]" />
              <span>Full Moderation & Audit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>Unlocked Chat & Testing</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            {error}
          </div>
        )}

        {/* 1-Click Primary Login Button */}
        <div className="space-y-3">
          <button
            onClick={() => handleLogin('dennistarus10@gmail.com')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#49233f] via-[#682e56] to-[#b64d70] px-5 py-3.5 text-sm font-semibold text-white shadow-md hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Authenticating Dennis Tarus...
              </span>
            ) : (
              <>
                <Crown className="h-4 w-4 text-[#ffd700]" />
                <span>Log In as Creator (Dennis Tarus)</span>
                <ArrowRight className="h-4 w-4 text-white/80" />
              </>
            )}
          </button>

          {/* Alternative Email Login */}
          <div className="pt-2">
            <details className="text-xs text-[#786172] group">
              <summary className="cursor-pointer font-medium hover:text-[#49233f] select-none text-center">
                Or enter creator email address
              </summary>
              <div className="mt-3 flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dennistarus10@gmail.com"
                  className="flex-1 rounded-xl border border-[#ded3c5] bg-white px-3.5 py-2 text-xs text-[#49233f] placeholder:text-[#a895a3] focus:border-[#b64d70] focus:outline-none"
                />
                <button
                  onClick={() => handleLogin(email)}
                  disabled={isLoading || !email}
                  className="rounded-xl bg-[#49233f] px-4 py-2 text-xs font-semibold text-white hover:bg-[#381a30] transition-colors cursor-pointer disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            </details>
          </div>
        </div>

        {/* Safe notice */}
        <div className="flex items-center gap-2 text-[11px] text-[#887082] justify-center pt-1 border-t border-[#ede2d5]">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#2e7d32]" />
          <span>Session securely logged. You can switch personas anytime.</span>
        </div>

      </div>
    </div>
  );
};
