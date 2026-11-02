import React, { useState } from 'react';
import { UserProfile, AgeVerificationRecord } from '../types';
import * as api from '../api';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  Camera,
  FileText,
  Calendar,
  Lock,
  Sparkles,
  Loader2
} from 'lucide-react';

interface AgeVerificationModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: (user: UserProfile) => void;
}

export const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onVerificationComplete
}) => {
  if (!isOpen) return null;

  const [idType, setIdType] = useState<'national_id' | 'passport' | 'military_id' | 'driving_license'>('national_id');
  const [idNumber, setIdNumber] = useState('29841028');
  const [dob, setDob] = useState('2001-06-15');
  const [selfieOption, setSelfieOption] = useState<string>(currentUser.photos[0]?.url || '/images/creator_dennis_tarus_1793271699871.jpg');
  const [autoVerifyTestMode, setAutoVerifyTestMode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Calculate age dynamically
  const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return 0;
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculatedAge = calculateAge(dob);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResultMessage(null);

    if (calculatedAge < 18) {
      setResultMessage({
        type: 'error',
        text: 'Access Denied: TEKA is strictly for adults aged 18 and older in Kenya. Underage access is prohibited.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitAgeVerification({
        idType,
        idNumber,
        dob,
        selfieUrl: selfieOption,
        documentFrontUrl: selfieOption,
        autoVerifyTestMode
      });

      setResultMessage({
        type: 'success',
        text: res.message
      });

      // Update current user
      const updatedProfile = await api.fetchMyProfile();
      onVerificationComplete(updatedProfile);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setResultMessage({
        type: 'error',
        text: err.message || 'Verification submission failed.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#140618] border border-[#4a1844] text-white p-6 sm:p-8 shadow-2xl my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          disabled={isSubmitting}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Government ID Assurance · Kenya Law
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">Adult Age Verification</h2>
          </div>
        </div>

        {/* Anti-Checkbox Assurance Callout */}
        <div className="mb-6 rounded-2xl bg-[#200926] border border-[#40123c] p-4 text-xs text-slate-300 space-y-1.5">
          <p className="font-semibold text-white flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-emerald-400" />
            <span>Reliable Multi-Factor Age Assurance</span>
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            TEKA adheres to Kenyan Child Protection and adult media compliance. A simple checkbox is never used alone. We verify identity through official identification documents, biometric facial verification, and administrator review.
          </p>
        </div>

        {resultMessage && (
          <div className={`mb-6 rounded-2xl p-4 text-xs flex items-center gap-3 border ${
            resultMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {resultMessage.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400" />
            )}
            <span>{resultMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Document Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Identification Document Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'national_id', label: 'Kenyan National ID' },
                { id: 'passport', label: 'Kenyan / EAC Passport' },
                { id: 'driving_license', label: 'Driving License' },
                { id: 'military_id', label: 'Official Service ID' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setIdType(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-colors cursor-pointer ${
                    idType === opt.id
                      ? 'border-emerald-500 bg-emerald-500/15 text-white font-semibold'
                      : 'border-[#3e133a] bg-[#09020b] text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ID Number & Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ID / Document Number *
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={e => setIdNumber(e.target.value)}
                placeholder="e.g. 29841028"
                className="w-full rounded-xl bg-[#09020b] border border-[#3e133a] px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Date of Birth *
              </label>
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="w-full rounded-xl bg-[#09020b] border border-[#3e133a] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
              <div className="flex items-center justify-between text-[11px] mt-1">
                <span className="text-slate-400">Calculated age:</span>
                <span className={`font-mono font-bold ${calculatedAge >= 18 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {calculatedAge} years old {calculatedAge >= 18 ? '(Adult Verified)' : '(Underage)'}
                </span>
              </div>
            </div>
          </div>

          {/* Biometric Selfie Match */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Live Selfie Biometric Match
            </label>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#09020b] border border-[#3e133a]">
              <img
                src={selfieOption}
                alt="Selfie preview"
                className="h-14 w-14 rounded-xl object-cover border border-[#5a1b52]"
              />
              <div className="flex-1 text-xs">
                <p className="font-semibold text-white">Biometric Facial Check</p>
                <p className="text-[11px] text-slate-400">
                  Matches document portrait with your profile photo to prevent impersonation.
                </p>
              </div>
            </div>
          </div>

          {/* Test Sandbox Toggle */}
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3.5">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Instant Sandbox Approval (Demo Mode)</span>
                </span>
                <p className="text-[11px] text-emerald-200/80">
                  Immediately certifies profile as 18+ Verified ID for testing adult features.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoVerifyTestMode}
                onChange={e => setAutoVerifyTestMode(e.target.checked)}
                className="h-4 w-4 rounded border-emerald-500 text-emerald-600 focus:ring-0"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || calculatedAge < 18}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Auditing Credentials...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Verify Kenyan Adult Credentials</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
