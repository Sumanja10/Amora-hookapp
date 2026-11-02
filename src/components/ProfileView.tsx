import React, { useState, useRef } from 'react';
import { UserProfile, ConnectionIntent, VideoMedia, AccountType } from '../types';
import * as api from '../api';
import {
  Lock,
  Eye,
  Trash2,
  Plus,
  Check,
  ShieldCheck,
  Clock,
  Play,
  Video,
  Sparkles,
  MapPin,
  AlertTriangle,
  UploadCloud,
  FileImage,
  X,
  UserCheck,
  DollarSign,
  Crown,
  Unlock
} from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  onSaveProfile: (data: Partial<UserProfile>) => Promise<void>;
  onAddPhoto: (url: string, visibility: 'public' | 'matched-only', caption?: string) => Promise<void>;
  onTogglePhotoVisibility: (photoId: string, currentVisibility: 'public' | 'matched-only') => Promise<void>;
  onDeletePhoto: (photoId: string) => Promise<void>;
  onAvailabilityUpdated?: (profile: UserProfile) => void;
  onAccountDeleted?: () => void;
  onOpenAgeVerification?: () => void;
  onOpenCreatorStudio?: () => void;
  onNavigateToExplore?: () => void;
}

const ALL_INTENTIONS: ConnectionIntent[] = [
  'Casual meetups',
  'Casual conversations',
  'Casual dating',
  'Flirting',
  'Friendship',
  'Friends with benefits'
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  onAddPhoto,
  onTogglePhotoVisibility,
  onDeletePhoto,
  onAvailabilityUpdated,
  onAccountDeleted,
  onOpenAgeVerification,
  onOpenCreatorStudio,
  onNavigateToExplore
}) => {
  // Account Type
  const [accountType, setAccountType] = useState<AccountType>(profile.accountType || 'member');
  const [isUpdatingAccountType, setIsUpdatingAccountType] = useState(false);

  // Privacy Settings
  const [profileVisibility, setProfileVisibility] = useState(profile.privacySettings?.profileVisibility || 'adults_only');
  const [allowMeetups, setAllowMeetups] = useState(profile.privacySettings?.allowMeetupRequests ?? true);
  const [allowMessaging, setAllowMessaging] = useState(profile.privacySettings?.allowDirectMessaging || 'mutual_only');
  const [privacySuccess, setPrivacySuccess] = useState(false);

  // Basic info
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [age, setAge] = useState(profile.age);
  const [university, setUniversity] = useState(profile.university);
  const [studyArea, setStudyArea] = useState(profile.studyArea || '');
  const [genderIdentity, setGenderIdentity] = useState(profile.genderIdentity);
  const [bio, setBio] = useState(profile.bio);
  const [interestsText, setInterestsText] = useState(profile.interests.join(', '));
  const [discreetMode, setDiscreetMode] = useState(profile.discreetMode);
  const [showApproximateArea, setShowApproximateArea] = useState(Boolean(profile.showApproximateArea));

  // Multi-select intentions
  const [selectedIntentions, setSelectedIntentions] = useState<ConnectionIntent[]>(
    profile.intentions && profile.intentions.length > 0
      ? profile.intentions
      : [profile.intent as any || 'Casual meetups']
  );

  // Availability System
  const [isAvailable, setIsAvailable] = useState(Boolean(profile.isAvailable));
  const [availDuration, setAvailDuration] = useState<number>(profile.availableDurationMinutes || 120);
  const [availNote, setAvailNote] = useState(profile.availableNote || '');
  const [isUpdatingAvail, setIsUpdatingAvail] = useState(false);
  const [availSuccess, setAvailSuccess] = useState(false);

  // Video Intro
  const [videoUrl, setVideoUrl] = useState(profile.videoIntro?.url || '');
  const [videoCaption, setVideoCaption] = useState(profile.videoIntro?.caption || '');
  const [isSavingVideo, setIsSavingVideo] = useState(false);
  const [videoSuccess, setVideoSuccess] = useState(false);

  // Photo upload
  const [uploadMode, setUploadMode] = useState<'local' | 'url'>('local');
  const [localFilePreview, setLocalFilePreview] = useState<string | null>(null);
  const [localFileName, setLocalFileName] = useState<string>('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoVisibility, setPhotoVisibility] = useState<'public' | 'matched-only'>('public');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Saving states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Toggle intention selection
  const toggleIntention = (intent: ConnectionIntent) => {
    if (selectedIntentions.includes(intent)) {
      if (selectedIntentions.length > 1) {
        setSelectedIntentions(selectedIntentions.filter(i => i !== intent));
      }
    } else {
      setSelectedIntentions([...selectedIntentions, intent]);
    }
  };

  // Save basic profile
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const interestsArray = interestsText
        .split(',')
        .map(i => i.trim())
        .filter(Boolean);

      await onSaveProfile({
        displayName,
        age: Number(age),
        university,
        studyArea,
        genderIdentity,
        intentions: selectedIntentions,
        intent: selectedIntentions[0] || 'Casual meetups',
        bio,
        interests: interestsArray,
        discreetMode,
        showApproximateArea
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Update Availability
  const handleUpdateAvailability = async () => {
    setIsUpdatingAvail(true);
    try {
      const res = await api.updateAvailability({
        isAvailable,
        durationMinutes: availDuration,
        note: availNote.trim() || undefined
      });
      onAvailabilityUpdated?.(res.profile);
      setAvailSuccess(true);
      setTimeout(() => setAvailSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingAvail(false);
    }
  };

  // Save Video Intro
  const handleSaveVideoIntro = async () => {
    setIsSavingVideo(true);
    try {
      if (!videoUrl.trim()) {
        await api.updateVideoIntro(null);
      } else {
        await api.updateVideoIntro({
          id: `v_${Date.now()}`,
          url: videoUrl.trim(),
          caption: videoCaption.trim() || 'Short video introduction',
          posterUrl: profile.photos[0]?.url,
          durationSeconds: 15
        });
      }
      setVideoSuccess(true);
      setTimeout(() => setVideoSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingVideo(false);
    }
  };

  // Local photo file handler
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    setLocalFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => {
      if (typeof e.target?.result === 'string') {
        setLocalFilePreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddLocalPhoto = async () => {
    if (!localFilePreview) return;
    setIsUploadingPhoto(true);
    try {
      await onAddPhoto(localFilePreview, photoVisibility, photoCaption.trim() || undefined);
      setLocalFilePreview(null);
      setLocalFileName('');
      setPhotoCaption('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleAddUrlPhoto = async () => {
    if (!newPhotoUrl.trim()) return;
    setIsUploadingPhoto(true);
    try {
      await onAddPhoto(newPhotoUrl.trim(), photoVisibility, photoCaption.trim() || undefined);
      setNewPhotoUrl('');
      setPhotoCaption('');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Update Account Type
  const handleAccountTypeChange = async (type: AccountType) => {
    setAccountType(type);
    setIsUpdatingAccountType(true);
    try {
      const res = await api.updateAccountType(type);
      onAvailabilityUpdated?.(res.user);
    } catch (err) {
      console.error('Failed to update account type', err);
    } finally {
      setIsUpdatingAccountType(false);
    }
  };

  // Update Privacy Controls
  const handleSavePrivacy = async () => {
    try {
      await api.updatePrivacySettings({
        profileVisibility,
        allowMeetupRequests: allowMeetups,
        allowDirectMessaging: allowMessaging,
        showOnlineStatus: true
      });
      setPrivacySuccess(true);
      setTimeout(() => setPrivacySuccess(false), 2500);
    } catch (err) {
      console.error('Failed to update privacy settings', err);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    try {
      await api.deleteAccount();
      onAccountDeleted?.();
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-8 pb-24">
      
      {/* Profile Header Card */}
      <div className="rounded-3xl border border-[#ded1c2] bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="relative shrink-0">
          <img
            src={profile.photos[0]?.url || '/logo.svg'}
            alt={profile.displayName}
            className="h-24 w-24 rounded-2xl object-cover border-2 border-[#b64d70] shadow-sm"
          />
          {profile.isAvailable && (
            <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" title="Available Now" />
          )}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <h2 className="font-serif text-2xl font-bold text-[#49233f] flex items-center justify-center sm:justify-start gap-2">
            {profile.displayName}, {profile.age}
            {profile.isCreator && (
              <span className="text-[10px] bg-[#d8b975] text-[#2a1324] px-2 py-0.5 rounded-full font-bold">
                👑 Creator
              </span>
            )}
          </h2>
          <p className="text-xs text-[#7e6576] flex items-center justify-center sm:justify-start gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>18+ Adult Verified · {profile.university}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-2">
            {selectedIntentions.map(i => (
              <span key={i} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#fbe8ee] text-[#9c2f52] border border-[#f0cdd6]">
                {i}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* COMBINED MEMBER PREFERENCES & ACCOUNT ROLE (Section 5) */}
      <div className="rounded-3xl border border-[#ded1c2] bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-[#f0e4d7] pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#49233f]">
              Combined Member Preferences
            </h3>
            <p className="text-xs text-[#7e6576]">
              A single TEKA account supports creator marketplace and social connections. Choose how you use the platform.
            </p>
          </div>
          {isUpdatingAccountType && (
            <span className="text-xs text-[#b64d70] font-semibold animate-pulse">Updating...</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: 'creator',
              title: 'Content Creator',
              desc: 'Publish lifestyle and exclusive photos/videos, set KSh prices, and earn without offering meetups.',
              icon: Crown
            },
            {
              id: 'member',
              title: 'Looking to Meet Others',
              desc: 'Connect with verified adults for dating, casual meetups, and friendship without uploading creator content.',
              icon: UserCheck
            },
            {
              id: 'both',
              title: 'Both Creator and Member',
              desc: 'Full experience: publish creator content, monetize exclusive media, and connect for adult meetups.',
              icon: Sparkles
            },
            {
              id: 'buyer_only',
              title: 'Browse & Purchase Content Only',
              desc: 'Discreet buyer account: explore creators, unlock exclusive photos & videos, no public social presence.',
              icon: DollarSign
            }
          ].map(opt => {
            const Icon = opt.icon;
            const isSelected = accountType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleAccountTypeChange(opt.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#b64d70] bg-[#faf0f4] shadow-xs'
                    : 'border-[#ebdcd1] bg-[#faf7f2] hover:border-[#b64d70]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-[#49233f] flex items-center gap-1.5">
                      <Icon className="h-4 w-4 text-[#b64d70]" />
                      <span>{opt.title}</span>
                    </span>
                    <input
                      type="radio"
                      name="accountType"
                      checked={isSelected}
                      onChange={() => handleAccountTypeChange(opt.id as any)}
                      className="text-[#b64d70] focus:ring-0"
                    />
                  </div>
                  <p className="text-[11px] text-[#74586d] leading-relaxed">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 18+ AGE ASSURANCE & VERIFICATION STATUS */}
      <div className="rounded-3xl border border-emerald-200 bg-[#f9fefb] p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-900">
                18+ Adult Age Assurance & Security
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                {profile.verifiedAdult ? 'Government ID Verified ✓' : 'Pending Verification'}
              </span>
            </div>
            <p className="text-xs text-emerald-800/80 mt-1 leading-relaxed">
              Kenya adult compliance verified through multi-factor identification documents. Protects creators and restricts underage access.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAgeVerification}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
        >
          {profile.verifiedAdult ? 'Review ID Details' : 'Verify 18+ Status'}
        </button>
      </div>

      {/* CREATOR STUDIO SHORTCUT (if creator or both) */}
      {(accountType === 'creator' || accountType === 'both' || profile.isCreator) && (
        <div className="rounded-3xl border border-[#d8b975]/50 bg-gradient-to-r from-[#2a0e28] to-[#1c071a] p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-[#ffd700] bg-[#ffd700]/20 border border-[#ffd700]/40 px-2 py-0.5 rounded-full">
                👑 Creator Dashboard
              </span>
              <span className="text-xs text-slate-300 font-mono">
                KSh {profile.creatorEarnings?.totalEarnedKes || 0} earned
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              Manage Content, Pricing & Sales
            </h3>
            <p className="text-xs text-[#e8d5e0]">
              Upload photos and videos, set individual prices in KSh, and view real-time sales receipts.
            </p>
          </div>

          <button
            onClick={onOpenCreatorStudio}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#d8b975] to-[#f3cf7a] hover:opacity-90 text-[#2a1324] font-bold text-xs flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            <span>Open Creator Studio</span>
          </button>
        </div>
      )}

      {/* MY PURCHASES VAULT SHORTCUT */}
      <div className="rounded-3xl border border-[#ded1c2] bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 shrink-0">
            <Unlock className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#49233f]">My Content Purchases</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Revisit all individual photos and videos previously unlocked with one-time M-Pesa payments.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToExplore}
          className="px-4 py-2 rounded-xl bg-[#49233f] hover:bg-[#602e52] text-white text-xs font-semibold cursor-pointer shrink-0"
        >
          Open Purchases Vault →
        </button>
      </div>

      {/* 1. AVAILABILITY SYSTEM CARD */}
      <div className="rounded-3xl border border-emerald-200 bg-[#f9fefb] p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'}`} />
              <h3 className="font-serif text-lg font-bold text-[#064e3b]">
                Live Availability System
              </h3>
            </div>
            <p className="text-xs text-emerald-800/80 mt-0.5">
              Voluntarily broadcast that you are free for company right now. Automatically expires when duration ends.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={e => setIsAvailable(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            <span className="ml-3 text-xs font-bold text-emerald-950">
              {isAvailable ? 'Active Now 🟢' : 'Inactive'}
            </span>
          </label>
        </div>

        {isAvailable && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Duration picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Availability Duration (Auto-Expires)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { mins: 60, label: '1 Hour' },
                  { mins: 120, label: '2 Hours (Recommended)' },
                  { mins: 240, label: '4 Hours' },
                  { mins: 480, label: 'Tonight (8h)' }
                ].map(opt => (
                  <button
                    key={opt.mins}
                    type="button"
                    onClick={() => setAvailDuration(opt.mins)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      availDuration === opt.mins
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Note */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Activity Status Note <span className="text-emerald-700 font-normal">(visible on Discovery card)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Free for iced cold brew near Chiromo or Artcaffe Westlands"
                value={availNote}
                onChange={e => setAvailNote(e.target.value)}
                maxLength={90}
                className="w-full rounded-xl border border-emerald-300 bg-white p-2.5 text-xs text-emerald-950 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-emerald-800">
            {isAvailable
              ? `Status active for ${availDuration / 60} hours. Pinpoint GPS is never revealed.`
              : 'You are currently hidden from the "Available Now" filter.'}
          </p>
          <button
            onClick={handleUpdateAvailability}
            disabled={isUpdatingAvail}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {availSuccess ? <Check className="h-4 w-4" /> : null}
            {isUpdatingAvail ? 'Updating...' : availSuccess ? 'Saved!' : 'Save Availability'}
          </button>
        </div>
      </div>

      {/* 2. VIDEO INTRODUCTION MANAGER */}
      <div className="rounded-3xl border border-[#ded1c2] bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-[#f0e4d7] pb-3">
          <Video className="h-5 w-5 text-[#ec4899]" />
          <div>
            <h3 className="font-serif text-lg font-bold text-[#49233f]">Short Video Introduction</h3>
            <p className="text-xs text-[#7e6576]">A short vertical video clip showcasing your personality and vibe</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#49233f]">Video URL (MP4 / WebM / Cloud clip)</label>
            <input
              type="url"
              placeholder="https://assets.mixkit.co/videos/preview/...mp4"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2.5 text-xs text-[#49233f] focus:outline-none focus:border-[#b64d70]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#49233f]">Video Caption</label>
            <input
              type="text"
              placeholder="e.g. Architecture senior into dark roast & late-night jazz"
              value={videoCaption}
              onChange={e => setVideoCaption(e.target.value)}
              className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2.5 text-xs text-[#49233f] focus:outline-none focus:border-[#b64d70]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-young-man-smiling-and-talking-42999-large.mp4');
                  setVideoCaption('Creative spatial design & chill evening lounges');
                }}
                className="text-[11px] text-[#b64d70] hover:underline cursor-pointer"
              >
                Sample Clip 1
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-with-a-laptop-42998-large.mp4');
                  setVideoCaption('Pre-med senior into vinyl music and cold brew');
                }}
                className="text-[11px] text-[#b64d70] hover:underline cursor-pointer"
              >
                Sample Clip 2
              </button>
            </div>

            <button
              onClick={handleSaveVideoIntro}
              disabled={isSavingVideo}
              className="px-5 py-2 rounded-xl bg-[#49233f] hover:bg-[#5e2e51] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {videoSuccess ? <Check className="h-4 w-4" /> : null}
              {isSavingVideo ? 'Saving...' : videoSuccess ? 'Updated!' : 'Save Video Intro'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. CONNECTION INTENTIONS SELECTION */}
      <div className="rounded-3xl border border-[#ded1c2] bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-[#f0e4d7] pb-3">
          <h3 className="font-serif text-lg font-bold text-[#49233f]">Connection Intentions</h3>
          <p className="text-xs text-[#7e6576]">Select all that align with what you're looking for on TEKA</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ALL_INTENTIONS.map(intent => {
            const isSelected = selectedIntentions.includes(intent);
            return (
              <button
                key={intent}
                type="button"
                onClick={() => toggleIntention(intent)}
                className={`p-3 rounded-2xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'border-[#b64d70] bg-[#f8ecf0] text-[#912d50] ring-1 ring-[#b64d70]'
                    : 'border-[#ded1c2] bg-[#faf7f2] text-[#64495c] hover:bg-[#f3eae1]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{intent}</span>
                  {isSelected && <Check className="h-4 w-4 text-[#b64d70]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. BASIC DETAILS & BIO FORM */}
      <form onSubmit={handleSave} className="rounded-3xl border border-[#ded1c2] bg-white p-6 shadow-sm space-y-5">
        <div className="border-b border-[#f0e4d7] pb-3">
          <h3 className="font-serif text-lg font-bold text-[#49233f]">Profile Details & Bio</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#49233f]">First Name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2.5 text-xs text-[#49233f]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#49233f]">Age (Must be 18+)</label>
            <input
              type="number"
              min={18}
              max={99}
              value={age}
              onChange={e => setAge(Number(e.target.value))}
              className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2.5 text-xs text-[#49233f]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#49233f]">University or Campus Community</label>
            <input
              type="text"
              value={university}
              onChange={e => setUniversity(e.target.value)}
              className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2.5 text-xs text-[#49233f]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#49233f]">Area of Study / Occupation</label>
            <input
              type="text"
              value={studyArea}
              onChange={e => setStudyArea(e.target.value)}
              className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2.5 text-xs text-[#49233f]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#49233f]">Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2.5 text-xs text-[#49233f]"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#49233f]">Interests (comma separated)</label>
          <input
            type="text"
            value={interestsText}
            onChange={e => setInterestsText(e.target.value)}
            className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2.5 text-xs text-[#49233f]"
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#f0e4d7]">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Check className="h-4 w-4" /> Profile updated successfully!
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="ml-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b64d70] to-[#db2777] text-white text-xs font-bold hover:from-[#c25a7d] hover:to-[#ec4899] shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      {/* 5. PHOTOS MANAGER */}
      <div className="rounded-3xl border border-[#ded1c2] bg-white p-6 shadow-sm space-y-5">
        <div className="border-b border-[#f0e4d7] pb-3">
          <h3 className="font-serif text-lg font-bold text-[#49233f]">Profile Photographs</h3>
          <p className="text-xs text-[#7e6576]">Manage public photos and matched-only discreet photos</p>
        </div>

        {/* Existing Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {profile.photos.map(photo => (
            <div key={photo.id} className="relative rounded-2xl overflow-hidden aspect-square border border-[#ded1c2] group">
              <img src={photo.url} alt="Profile photo" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <span className={`self-start text-[9px] px-2 py-0.5 rounded-full font-bold ${
                  photo.visibility === 'public' ? 'bg-emerald-500 text-white' : 'bg-purple-600 text-white'
                }`}>
                  {photo.visibility === 'public' ? 'Public' : 'Matched-Only'}
                </span>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onTogglePhotoVisibility(photo.id, photo.visibility)}
                    className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white text-[10px]"
                    title="Toggle Visibility"
                  >
                    Toggle
                  </button>
                  {profile.photos.length > 1 && (
                    <button
                      onClick={() => onDeletePhoto(photo.id)}
                      className="p-1 rounded-md bg-red-600/80 hover:bg-red-700 text-white"
                      title="Delete Photo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Photo Form */}
        <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#ebdcd1] space-y-3">
          <p className="text-xs font-bold text-[#49233f]">Add Another Photo</p>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={e => e.target.files?.[0] && processFile(e.target.files[0])}
              className="text-xs text-[#64495c] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#49233f] file:text-white hover:file:bg-[#5e2e51] cursor-pointer"
            />
          </div>
          {localFilePreview && (
            <div className="flex items-center gap-3 pt-2">
              <img src={localFilePreview} alt="Preview" className="h-14 w-14 rounded-xl object-cover border" />
              <div className="flex items-center gap-2">
                <select
                  value={photoVisibility}
                  onChange={e => setPhotoVisibility(e.target.value as any)}
                  className="rounded-xl border border-[#ded1c2] bg-white p-1.5 text-xs"
                >
                  <option value="public">Public</option>
                  <option value="matched-only">Matched-Only (Discreet)</option>
                </select>
                <button
                  onClick={handleAddLocalPhoto}
                  disabled={isUploadingPhoto}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                >
                  Upload
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. PRIVACY & ACCOUNT DELETION */}
      <div className="rounded-3xl border border-[#ded1c2] bg-white p-6 shadow-sm space-y-6">
        <div className="border-b border-[#f0e4d7] pb-3">
          <h3 className="font-serif text-lg font-bold text-[#49233f]">Member Privacy & Contact Controls</h3>
          <p className="text-xs text-[#7e6576]">Control who can see your profile, send meetup requests, and contact you</p>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#49233f] mb-1.5">Profile Visibility</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'adults_only', label: '18+ Verified Adults' },
                { id: 'connections_only', label: 'Accepted Connections Only' },
                { id: 'hidden', label: 'Hidden (Stealth)' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setProfileVisibility(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left cursor-pointer ${
                    profileVisibility === opt.id
                      ? 'border-[#b64d70] bg-[#faf0f4] text-[#b64d70] font-bold'
                      : 'border-[#ebdcd1] bg-[#faf7f2] text-[#64495c]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-[#49233f] mb-1.5">Direct Messaging Rule</label>
              <select
                value={allowMessaging}
                onChange={e => setAllowMessaging(e.target.value as any)}
                className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2.5 text-xs text-[#49233f]"
              >
                <option value="mutual_only">Mutual Consent Connections Only</option>
                <option value="nobody">Block All Private Messages</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#49233f] mb-1.5">Meetup Requests</label>
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#ded1c2] bg-[#faf7f2] cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowMeetups}
                  onChange={e => setAllowMeetups(e.target.checked)}
                  className="rounded border-[#ded1c2] text-[#b64d70] focus:ring-0"
                />
                <span className="text-xs text-[#49233f]">Allow members to express interest in my plans</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleSavePrivacy}
              className="px-4 py-2 rounded-xl bg-[#49233f] hover:bg-[#602e52] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Save Privacy Settings
            </button>
            {privacySuccess && (
              <span className="text-xs font-semibold text-emerald-600 animate-in fade-in">
                ✓ Privacy preferences saved
              </span>
            )}
          </div>
        </div>

        {/* Permanent Account Deletion */}
        <div className="pt-4 border-t border-red-200">
          <h4 className="font-bold text-red-900 text-xs mb-1">Permanent Data Deletion & Consent Revocation</h4>
          <p className="text-xs text-[#523b4c] leading-relaxed mb-3">
            TEKA strictly enforces consenting adult privacy. You can permanently delete your account, pictures, meet-up requests, and conversation history at any time.
          </p>

        {deleteConfirmOpen ? (
          <div className="p-4 rounded-2xl bg-red-100 border border-red-300 space-y-3">
            <p className="text-xs font-bold text-red-900">
              Are you completely sure? This will delete all your profile media and connection history permanently.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-xl bg-red-700 text-white text-xs font-bold hover:bg-red-800 transition-colors cursor-pointer"
              >
                Yes, Permanently Delete My Account
              </button>
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-red-300 bg-white text-xs font-semibold text-red-900 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="px-4 py-2 rounded-xl border border-red-300 bg-white text-xs font-bold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
          >
            Delete Account & Purge Data
          </button>
        )}
        </div>
      </div>

    </div>
  );
};
