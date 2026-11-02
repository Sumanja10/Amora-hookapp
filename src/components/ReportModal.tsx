import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ShieldAlert, X, Check } from 'lucide-react';

interface ReportModalProps {
  targetProfile: UserProfile;
  onClose: () => void;
  onSubmitReport: (targetId: string, category: string, details: string) => Promise<void>;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  targetProfile,
  onClose,
  onSubmitReport
}) => {
  const [category, setCategory] = useState('harassment');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitReport(targetProfile.id, category, details);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl border border-[#ded1c2] bg-white p-6 sm:p-7 shadow-2xl space-y-5">
        
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-[#887082] hover:text-[#49233f] p-1.5 rounded-full hover:bg-[#faf4ee] transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-1 pr-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#bd3e3e]">
            <ShieldAlert className="h-4 w-4" />
            <span>Confidential Safety Report</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-[#49233f]">
            Report {targetProfile.displayName}
          </h3>
          <p className="text-xs text-[#7e6878]">
            Your report is strictly anonymous. Submitting will also automatically block this user from contacting you.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-[#49233f]">Report Filed & User Blocked</p>
            <p className="text-xs text-[#7e6878]">Thank you for keeping our university community safe.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5a4253] mb-1">
                Reason for report
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] px-3 py-2 text-xs text-[#49233f] font-medium focus:border-[#b64d70] focus:bg-white"
              >
                <option value="harassment">Harassment or disrespectful behavior</option>
                <option value="underage">Suspected underage (must be 18+)</option>
                <option value="unsolicited_content">Unsolicited explicit material or non-consensual media</option>
                <option value="impersonation">Fake profile or impersonation</option>
                <option value="spam">Commercial spam or solicitations</option>
                <option value="other">Other safety concern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a4253] mb-1">
                Details (optional)
              </label>
              <textarea
                rows={3}
                placeholder="Describe what occurred..."
                value={details}
                onChange={e => setDetails(e.target.value)}
                className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-3 text-xs text-[#49233f] focus:border-[#b64d70] focus:bg-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#7e6878] hover:text-[#49233f] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[#bd3e3e] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#a63333] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Filing...' : 'Submit Report & Block'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
