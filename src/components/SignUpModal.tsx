import React, { useState, useRef } from 'react';
import { UserProfile, ConnectionIntent, AccountType } from '../types';
import { ShieldCheck, X, UploadCloud, Camera, Image, Sparkles, Crown, UserCheck, DollarSign } from 'lucide-react';

interface SignUpModalProps {
  onClose: () => void;
  onSignUp: (data: Partial<UserProfile> & { photoUrl?: string }) => Promise<void>;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  onClose,
  onSignUp
}) => {
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState(22);
  const [accountType, setAccountType] = useState<AccountType>('both');
  const [university, setUniversity] = useState('Westlands, Nairobi');
  const [studyArea, setStudyArea] = useState('Digital Creator & Tech');
  const [genderIdentity, setGenderIdentity] = useState<'woman' | 'man' | 'nonbinary'>('woman');
  const [intent, setIntent] = useState<ConnectionIntent>('Casual meetups');
  const [bio, setBio] = useState('');
  const [verifiedAdult, setVerifiedAdult] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local photo state
  const [localPhotoPreview, setLocalPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (PNG, JPG, WebP).');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setError('Photo must be smaller than 8MB.');
        return;
      }
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setLocalPhotoPreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (age < 18) {
      setError('You must be at least 18 years of age to register.');
      return;
    }

    if (!verifiedAdult) {
      setError('You must confirm you are an adult 18+ and agree to mutual consent.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSignUp({
        displayName,
        age,
        accountType,
        university,
        studyArea,
        genderIdentity,
        intent,
        intentions: [intent],
        bio: bio || 'Adult community member ready for transparent, respectful encounters and creator content.',
        verifiedAdult: true,
        photoUrl: localPhotoPreview || undefined
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#ded1c2] bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
        
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-[#887082] hover:text-[#49233f] p-1.5 rounded-full hover:bg-[#faf4ee] transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3.5">
          <img
            src="/assets/aistudio/amora_6904a15c.png"
            alt="AMORA Logo"
            className="h-12 w-12 rounded-2xl shadow-sm border border-[#e5d4c3] object-contain shrink-0"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#b64d70] uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Adult Registration (18+)</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#49233f]">
              Create Your AMORA Persona
            </h3>
            <p className="text-xs text-[#6e5869]">
              Join the discreet university network for consenting adults.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Account Preference Choice (Section 5) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#49233f]">
              How do you plan to use AMORA? *
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'both', label: 'Both Creator & Member', icon: Sparkles },
                { id: 'creator', label: 'Content Creator', icon: Crown },
                { id: 'member', label: 'Meet People Only', icon: UserCheck },
                { id: 'buyer_only', label: 'Browse & Buy Content', icon: DollarSign }
              ].map(opt => {
                const Icon = opt.icon;
                const isSelected = accountType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAccountType(opt.id as any)}
                    className={`p-2 rounded-xl border text-left cursor-pointer flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'border-[#b64d70] bg-[#faf0f4] text-[#b64d70] font-bold shadow-xs'
                        : 'border-[#ded1c2] bg-[#faf7f2] text-[#64495c] hover:border-[#b64d70]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate text-[11px]">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profile Photo Picker */}
          <div>
            <label className="block text-xs font-semibold text-[#5a4253] mb-1.5">
              Profile Photo (Upload from device or use default)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex items-center gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-dashed border-[#d8c7b8] bg-[#faf7f2] flex items-center justify-center cursor-pointer hover:border-[#b64d70] transition-colors shrink-0 group"
              >
                {localPhotoPreview ? (
                  <img
                    src={localPhotoPreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-[#8e7587] group-hover:text-[#b64d70]">
                    <Camera className="h-6 w-6" />
                    <span className="text-[9px] font-bold mt-1">Upload</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b64d70] hover:text-[#963756] cursor-pointer"
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>Choose local file from device</span>
                </button>
                <p className="text-[11px] text-[#8e7587]">
                  {photoFileName ? `Selected: ${photoFileName}` : 'Supports JPG, PNG, WebP up to 8MB.'}
                </p>
                {localPhotoPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalPhotoPreview(null);
                      setPhotoFileName('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-[10px] text-[#bd3e3e] hover:underline cursor-pointer block"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#5a4253] mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sasha"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] px-3 py-2 text-xs text-[#49233f] focus:border-[#b64d70] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a4253] mb-1">
                Age (18+)
              </label>
              <input
                type="number"
                min="18"
                max="99"
                required
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] px-3 py-2 text-xs text-[#49233f] focus:border-[#b64d70] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#5a4253] mb-1">
                Neighborhood / City Area
              </label>
              <select
                value={university}
                onChange={e => setUniversity(e.target.value)}
                className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] px-3 py-2 text-xs text-[#49233f] font-medium focus:border-[#b64d70] focus:bg-white cursor-pointer"
              >
                <option value="Westlands, Nairobi">Nairobi · Westlands</option>
                <option value="Kilimani, Nairobi">Nairobi · Kilimani / Hurlingham</option>
                <option value="CBD, Nairobi">Nairobi · CBD / Riverside</option>
                <option value="Roysambu, Nairobi">Nairobi · Roysambu / Kasarani</option>
                <option value="Karen, Nairobi">Nairobi · Karen / Lang'ata</option>
                <option value="Mombasa">Mombasa & Nyali</option>
                <option value="Kisumu">Kisumu City & Milimani</option>
                <option value="Eldoret">Eldoret Town</option>
                <option value="Nakuru">Nakuru City</option>
                <option value="Thika">Thika Town</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a4253] mb-1">
                Occupation / Lifestyle Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Creative Designer, Tech, Freelance"
                value={studyArea}
                onChange={e => setStudyArea(e.target.value)}
                className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] px-3 py-2 text-xs text-[#49233f] focus:border-[#b64d70] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#5a4253] mb-1">
                Gender Identity
              </label>
              <select
                value={genderIdentity}
                onChange={e => setGenderIdentity(e.target.value as any)}
                className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] px-3 py-2 text-xs text-[#49233f] focus:border-[#b64d70] focus:bg-white"
              >
                <option value="woman">Woman</option>
                <option value="man">Man</option>
                <option value="nonbinary">Non-binary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a4253] mb-1">
                Connection Intent
              </label>
              <select
                value={intent}
                onChange={e => setIntent(e.target.value as ConnectionIntent)}
                className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] px-3 py-2 text-xs text-[#49233f] font-semibold focus:border-[#b64d70] focus:bg-white"
              >
                <option value="Casual meetups">Casual meetups</option>
                <option value="Casual conversations">Casual conversations</option>
                <option value="Casual dating">Casual dating</option>
                <option value="Flirting">Flirting</option>
                <option value="Friendship">Friendship</option>
                <option value="Friends with benefits">Friends with benefits</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5a4253] mb-1">
              Short Bio
            </label>
            <textarea
              rows={2}
              placeholder="What are your favorite evening spots and what are you looking for?"
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-3 text-xs text-[#49233f] focus:border-[#b64d70] focus:bg-white"
            />
          </div>

          {/* Verification check */}
          <div className="rounded-xl border border-[#ebd0d8] bg-[#fbf5f7] p-3 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="adultConsent"
              checked={verifiedAdult}
              onChange={e => setVerifiedAdult(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-[#b64d70] focus:ring-[#b64d70] cursor-pointer"
            />
            <label htmlFor="adultConsent" className="text-xs text-[#523d4f] cursor-pointer">
              I certify under penalty of perjury that I am an <strong>adult 18 years of age or older</strong>, and I agree to the AMORA Adult Consent Charter (mutual, ongoing, enthusiastic, and revocable consent).
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#7e6878] hover:text-[#49233f] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !displayName.trim()}
              className="rounded-xl bg-[#b64d70] px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#973a58] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Creating Profile...' : 'Complete Registration'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
