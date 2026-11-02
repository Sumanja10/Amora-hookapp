import React from 'react';
import { SafetyPrinciple } from '../types';
import { ShieldCheck, Lock, AlertTriangle, Check, X, HeartHandshake } from 'lucide-react';

interface SafetyCharterModalProps {
  onClose: () => void;
  guidelines: SafetyPrinciple[];
}

export const SafetyCharterModal: React.FC<SafetyCharterModalProps> = ({
  onClose,
  guidelines
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-3xl border border-[#ded1c2] bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-[#887082] hover:text-[#49233f] p-1.5 rounded-full hover:bg-[#faf4ee] transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 border-b border-[#f0e6dc] pb-4 pr-8">
          <img
            src="/assets/teka_brand_logo.jpg"
            alt="TEKA Logo"
            className="h-12 w-12 rounded-2xl shadow-sm border border-[#e5d4c3] object-cover shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#b64d70] uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Community Standards</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#49233f]">
              TEKA Adult Consent & Safety Charter
            </h2>
            <p className="text-xs sm:text-sm text-[#6c5567] leading-relaxed">
              TEKA is dedicated to providing consenting adults with a modern,
              discreet, and transparent platform. All members pledge to adhere to these foundational principles.
            </p>
          </div>
        </div>

        {/* Core Principles List */}
        <div className="space-y-4">
          {guidelines.map((principle, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#ece0d4] bg-[#faf7f2] p-4 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f4e5e9] text-[#b64d70] text-xs font-bold shrink-0">
                  {index + 1}
                </span>
                <h4 className="font-serif font-bold text-sm text-[#49233f]">
                  {principle.title}
                </h4>
              </div>
              <p className="text-xs text-[#5e4758] pl-7 leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>

        {/* Discretion & Privacy Note */}
        <div className="rounded-2xl border border-[#ded1c2] bg-[#fbf5f0] p-4 flex items-start gap-3">
          <Lock className="h-5 w-5 text-[#d8b975] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-[#5d4657]">
            <p className="font-bold text-[#49233f]">Discreet Photo Shield & Confidentiality</p>
            <p className="leading-relaxed">
              Photos tagged as "Matched Only" are strictly shielded from public browsing.
              Screenshots or non-consensual sharing of any member's imagery results in immediate, permanent expulsion.
            </p>
          </div>
        </div>

        {/* Reporting & Emergency Support */}
        <div className="rounded-2xl border border-[#ebd0d8] bg-[#fdf5f7] p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-[#bd3e3e] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-[#703d4a]">
            <p className="font-bold text-[#bd3e3e]">24/7 Incident Review & Campus Resources</p>
            <p className="leading-relaxed">
              If you experience boundary violations or unwanted contact, use the in-app Report button immediately.
              National Crisis Text Line: Text HOME to 741741 · RAINN Hotline: 1-800-656-4673.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl bg-[#b64d70] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#973a58] transition-colors cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>I Pledge & Agree to the Adult Consent Charter</span>
          </button>
        </div>

      </div>
    </div>
  );
};
