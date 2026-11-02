import React, { useState } from 'react';
import { UserProfile, ConnectionIntent } from '../types';
import { X, Send, ShieldCheck, Heart, Sparkles, MapPin, GraduationCap } from 'lucide-react';

interface ConnectModalProps {
  recipient: UserProfile;
  currentUser: UserProfile;
  onClose: () => void;
  onSubmit: (data: { recipientId: string; intention: string; message: string }) => Promise<void>;
}

const INTENTIONS: ConnectionIntent[] = [
  'Casual meetups',
  'Casual conversations',
  'Casual dating',
  'Flirting',
  'Friendship',
  'Friends with benefits'
];

export const ConnectModal: React.FC<ConnectModalProps> = ({
  recipient,
  currentUser,
  onClose,
  onSubmit
}) => {
  const [selectedIntention, setSelectedIntention] = useState<ConnectionIntent>(
    (recipient.intentions && recipient.intentions[0]) || 'Casual meetups'
  );
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        recipientId: recipient.id,
        intention: selectedIntention,
        message: message.trim()
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send connection request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white border border-[#ded1c2] shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ece0d4] px-6 py-4 bg-[#faf7f2]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#b64d70]" />
            <h3 className="font-serif text-lg font-bold text-[#49233f]">
              Connect with {recipient.displayName.split(' ')[0]}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#8c7484] hover:bg-[#ebdcd1] hover:text-[#49233f] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Recipient Snapshot */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#faf5f0] border border-[#ebdcd1]">
            <img
              src={recipient.photos[0]?.url || '/logo.svg'}
              alt={recipient.displayName}
              className="h-16 w-16 rounded-xl object-cover border border-[#ded1c2] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-serif text-base font-bold text-[#49233f] truncate">
                {recipient.displayName}, {recipient.age}
              </h4>
              <p className="text-xs text-[#7f6777] flex items-center gap-1 truncate mt-0.5">
                <GraduationCap className="h-3.5 w-3.5 text-[#b64d70] shrink-0" />
                <span className="truncate">{recipient.university}</span>
              </p>
              {recipient.distanceKm !== undefined && (
                <p className="text-xs text-[#9a7e92] flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-[#b64d70] shrink-0" />
                  <span>~{recipient.distanceKm} km away</span>
                  {recipient.locationArea && <span>· {recipient.locationArea}</span>}
                </p>
              )}
            </div>
          </div>

          {/* Intention Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#49233f] uppercase tracking-wider">
              Select Your Connection Intention
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INTENTIONS.map(intent => {
                const isSelected = selectedIntention === intent;
                return (
                  <button
                    key={intent}
                    type="button"
                    onClick={() => setSelectedIntention(intent)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'border-[#b64d70] bg-[#f8ecf0] text-[#912d50] font-semibold ring-1 ring-[#b64d70]'
                        : 'border-[#e8d7c8] bg-white text-[#58394f] hover:bg-[#faf4ee]'
                    }`}
                  >
                    {intent}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Intro Message */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="introNote" className="font-semibold text-[#49233f] uppercase tracking-wider">
                Introduction Note <span className="text-[#8c7484] font-normal lowercase">(optional)</span>
              </label>
              <span className="text-[11px] text-[#8c7484]">{message.length}/160</span>
            </div>
            <textarea
              id="introNote"
              rows={2}
              maxLength={160}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={`Say hello to ${recipient.displayName.split(' ')[0]}... e.g. "Free for iced pour-overs near campus this week?"`}
              className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-3 text-xs text-[#49233f] placeholder-[#9f8595] focus:border-[#b64d70] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Safety Notice */}
          <div className="flex items-start gap-2.5 rounded-xl bg-[#f5fbf7] border border-[#c4e3cf] p-3 text-xs text-[#2b5838]">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-[#2b884d]" />
            <p className="leading-relaxed">
              <strong>Consent Guarantee:</strong> Private conversations unlock only after {recipient.displayName.split(' ')[0]} accepts your request. No unsolicited spam.
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#ded1c2] text-xs font-semibold text-[#664b5e] hover:bg-[#f5ede4] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b64d70] to-[#db2777] text-white text-xs font-semibold hover:from-[#c25a7d] hover:to-[#ec4899] shadow-md shadow-[#db2777]/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {isSubmitting ? 'Sending Request...' : 'Send Request'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
