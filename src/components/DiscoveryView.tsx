import React, { useState } from 'react';
import { UserProfile, ConnectionIntent } from '../types';
import { VideoIntroModal } from './VideoIntroModal';
import { ConnectModal } from './ConnectModal';
import {
  Sparkles,
  MapPin,
  GraduationCap,
  Play,
  UserPlus,
  Check,
  Clock,
  Filter,
  SlidersHorizontal,
  ShieldCheck,
  ShieldAlert,
  Lock,
  ChevronRight,
  Eye,
  MessageCircle,
  Radio
} from 'lucide-react';

interface DiscoveryViewProps {
  currentUser: UserProfile;
  profiles: UserProfile[];
  onSendConnectionRequest: (data: { recipientId: string; intention: string; message: string }) => Promise<void>;
  onReport: (profile: UserProfile) => void;
  onBlock: (profileId: string) => void;
  onNavigateToMessages?: (targetProfileId?: string) => void;
  filters: any;
  onFilterChange: (filters: any) => void;
  isLoading: boolean;
  onOpenMyAvailability?: () => void;
}

const ALL_INTENTIONS: ConnectionIntent[] = [
  'Casual meetups',
  'Casual conversations',
  'Casual dating',
  'Flirting',
  'Friendship',
  'Friends with benefits'
];

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  currentUser,
  profiles,
  onSendConnectionRequest,
  onReport,
  onBlock,
  onNavigateToMessages,
  filters,
  onFilterChange,
  isLoading,
  onOpenMyAvailability
}) => {
  const [selectedVideoProfile, setSelectedVideoProfile] = useState<UserProfile | null>(null);
  const [connectTargetProfile, setConnectTargetProfile] = useState<UserProfile | null>(null);
  const [expandedProfile, setExpandedProfile] = useState<UserProfile | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sentRequestIds, setSentRequestIds] = useState<Set<string>>(new Set());

  // Filter state
  const availableOnly = filters.availableOnly === true;

  const handleToggleAvailableOnly = (val: boolean) => {
    onFilterChange({ ...filters, availableOnly: val });
  };

  const handleSelectIntentionFilter = (intent: string) => {
    onFilterChange({ ...filters, intent: filters.intent === intent ? 'all' : intent });
  };

  const handleSendRequest = async (data: { recipientId: string; intention: string; message: string }) => {
    await onSendConnectionRequest(data);
    setSentRequestIds(prev => new Set(prev).add(data.recipientId));
  };

  // Helper for intention badge styles
  const getIntentionBadgeStyle = (intention: string) => {
    switch (intention) {
      case 'Casual meetups':
        return 'bg-[#fbe8ee] text-[#9c2f52] border-[#f2c7d4]';
      case 'Casual conversations':
        return 'bg-[#eef2fb] text-[#29529b] border-[#cbd8f6]';
      case 'Casual dating':
        return 'bg-[#f7edf5] text-[#862d7c] border-[#e7c9e3]';
      case 'Flirting':
        return 'bg-[#fff1f2] text-[#be123c] border-[#fecdd3]';
      case 'Friends with benefits':
        return 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]';
      case 'Friendship':
        return 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const availableCount = profiles.filter(p => p.isAvailable).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner: Live Connections Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#240b22] via-[#3a1336] to-[#1a0818] p-6 sm:p-8 text-white border border-[#4d1f48] shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#f8cadc] border border-white/15">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Live Campus Discovery
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Discover People by Shared Intentions & Proximity
            </h1>
            <p className="text-xs sm:text-sm text-[#d7b6d1] leading-relaxed">
              No swiping games. Browse consenting university adults, watch short video introductions, explore mutual meetup intentions, and send connection requests directly.
            </p>
          </div>

          {/* Quick Availability Status of Current User */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {currentUser.isAvailable ? (
              <div className="flex items-center gap-2.5 bg-emerald-950/60 border border-emerald-500/40 px-4 py-2.5 rounded-2xl text-xs text-emerald-200">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <p className="font-semibold text-emerald-300">You are Available Now</p>
                  <p className="text-[11px] text-emerald-400/80">{currentUser.availableNote || 'Open for casual meetups'}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/15 px-4 py-2.5 rounded-2xl text-xs text-[#d7b6d1]">
                <Clock className="h-4 w-4 text-[#d7b6d1]" />
                <div>
                  <p className="font-semibold text-white">Your Availability: Inactive</p>
                  <p className="text-[11px]">Activate in your profile anytime</p>
                </div>
              </div>
            )}

            {onOpenMyAvailability && (
              <button
                onClick={onOpenMyAvailability}
                className="py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
              >
                Set My Status
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Discovery Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#ded1c2] shadow-sm">
        
        {/* Toggle between Available Now vs All */}
        <div className="flex items-center gap-2 p-1 bg-[#faf5ef] rounded-xl border border-[#ebdcd1] w-fit">
          <button
            onClick={() => handleToggleAvailableOnly(false)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !availableOnly
                ? 'bg-white text-[#49233f] shadow-xs font-bold'
                : 'text-[#7e6576] hover:text-[#49233f]'
            }`}
          >
            All Discoverable ({profiles.length})
          </button>
          <button
            onClick={() => handleToggleAvailableOnly(true)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              availableOnly
                ? 'bg-[#49233f] text-white shadow-xs font-bold'
                : 'text-[#7e6576] hover:text-[#49233f]'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Available Now ({availableCount})
          </button>
        </div>

        {/* Filter Toggle & Fast Intent Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
              filtersOpen || (filters.intent && filters.intent !== 'all')
                ? 'border-[#b64d70] bg-[#fdf2f5] text-[#b64d70]'
                : 'border-[#ded1c2] bg-white text-[#63495b] hover:bg-[#faf4ee]'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters {filters.intent && filters.intent !== 'all' ? `(1)` : ''}
          </button>

          {/* Quick Intention Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            {ALL_INTENTIONS.slice(0, 4).map(intent => {
              const isActive = filters.intent === intent;
              return (
                <button
                  key={intent}
                  onClick={() => handleSelectIntentionFilter(intent)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer shrink-0 ${
                    isActive
                      ? 'border-[#b64d70] bg-[#49233f] text-white'
                      : 'border-[#e8d7c8] bg-[#faf7f2] text-[#6d5165] hover:bg-[#f3eae1]'
                  }`}
                >
                  {intent}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {filtersOpen && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ded1c2] shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-sm font-bold text-[#49233f]">
              Filter By Connection Intentions & Distance
            </h3>
            <button
              onClick={() => onFilterChange({ intent: 'all', gender: 'all', radiusKm: 'all', availableOnly: false })}
              className="text-xs text-[#b64d70] hover:underline cursor-pointer font-medium"
            >
              Reset all filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Intention */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#49233f]">Connection Intention</label>
              <select
                value={filters.intent || 'all'}
                onChange={e => onFilterChange({ ...filters, intent: e.target.value })}
                className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2 text-[#49233f] focus:outline-none focus:border-[#b64d70]"
              >
                <option value="all">All Intentions</option>
                {ALL_INTENTIONS.map(i => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>

            {/* Distance Radius */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#49233f]">Maximum Distance Estimate</label>
              <select
                value={filters.radiusKm || 'all'}
                onChange={e => onFilterChange({ ...filters, radiusKm: e.target.value })}
                className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2 text-[#49233f] focus:outline-none focus:border-[#b64d70]"
              >
                <option value="all">Any distance</option>
                <option value="3">Within 3 km (Immediate campus)</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="30">Within 30 km</option>
              </select>
            </div>

            {/* Gender Preference */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#49233f]">Gender Identity</label>
              <select
                value={filters.gender || 'all'}
                onChange={e => onFilterChange({ ...filters, gender: e.target.value })}
                className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2 text-[#49233f] focus:outline-none focus:border-[#b64d70]"
              >
                <option value="all">All Genders</option>
                <option value="woman">Women</option>
                <option value="man">Men</option>
                <option value="nonbinary">Non-binary</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="rounded-3xl border border-[#ebdcd1] bg-white p-4 space-y-4 animate-pulse">
              <div className="h-64 rounded-2xl bg-stone-200" />
              <div className="h-5 w-2/3 bg-stone-200 rounded-md" />
              <div className="h-4 w-1/2 bg-stone-100 rounded-md" />
              <div className="h-9 w-full bg-stone-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : profiles.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-[#d8c3b4] bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#faf2f5] text-[#b64d70]">
            <Radio className="h-7 w-7 opacity-80" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-serif text-lg font-bold text-[#49233f]">
              No profiles found matching criteria
            </h3>
            <p className="text-xs text-[#8a7283]">
              {availableOnly
                ? 'No one has currently activated their Available Now status with these filters. Try viewing all members or broadening distance.'
                : 'Try adjusting your filters or expanding your maximum distance.'}
            </p>
          </div>
          <button
            onClick={() => onFilterChange({ intent: 'all', gender: 'all', radiusKm: 'all', availableOnly: false })}
            className="px-5 py-2.5 rounded-xl bg-[#49233f] text-white text-xs font-semibold hover:bg-[#5e2e51] transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Profiles Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map(profile => {
            const hasRequested = (profile as any).hasPendingRequest || sentRequestIds.has(profile.id);
            const isMatched = (profile as any).isMatched;
            const sharedInterests = profile.interests.filter(item =>
              currentUser.interests.some(mine => mine.toLowerCase() === item.toLowerCase())
            );

            return (
              <div
                key={profile.id}
                className="group relative flex flex-col rounded-3xl border border-[#ded1c2] bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                
                {/* Profile Image & Media Layer */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-stone-900 cursor-pointer" onClick={() => setExpandedProfile(profile)}>
                  <img
                    src={profile.photos[0]?.url || '/logo.svg'}
                    alt={profile.displayName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Available Now Badge */}
                  {profile.isAvailable && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Available Now</span>
                    </div>
                  )}

                  {/* Short Video Intro Pill (Clickable) */}
                  {profile.videoIntro && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedVideoProfile(profile);
                      }}
                      className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#d946ef]/90 to-[#db2777]/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-md border border-white/20 hover:scale-105 transition-transform cursor-pointer"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>Watch Intro</span>
                    </button>
                  )}

                  {/* Bottom Image Info: Name, Age, Campus & Distance */}
                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-serif text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        {profile.displayName}, {profile.age}
                        {profile.verifiedAdult && (
                          <span title="18+ Verified Adult">
                            <ShieldCheck className="h-4 w-4 text-[#ec4899] shrink-0" />
                          </span>
                        )}
                      </h3>
                      {profile.distanceKm !== undefined && (
                        <span className="text-xs font-medium text-[#ffd6e6] bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10">
                          ~{profile.distanceKm} km
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#f0d4e9] flex items-center gap-1.5 truncate">
                      <GraduationCap className="h-3.5 w-3.5 text-[#ec4899] shrink-0" />
                      <span className="truncate">{profile.university}</span>
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  
                  {/* Availability Note */}
                  {profile.isAvailable && profile.availableNote && (
                    <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900">
                      <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="leading-tight font-medium">"{profile.availableNote}"</p>
                    </div>
                  )}

                  {/* Intentions Badges */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#917587] tracking-wider">
                      Connection Intentions
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(profile.intentions && profile.intentions.length > 0 ? profile.intentions : [profile.intent || 'Casual meetups']).map(intent => (
                        <span
                          key={intent}
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border ${getIntentionBadgeStyle(intent)}`}
                        >
                          {intent}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bio Preview */}
                  <p className="text-xs text-[#523b4c] line-clamp-2 leading-relaxed">
                    {profile.bio}
                  </p>

                  {/* Shared Interests */}
                  {profile.interests && profile.interests.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-[#917587] font-semibold tracking-wider uppercase">
                        <span>Interests</span>
                        {sharedInterests.length > 0 && (
                          <span className="text-[#b64d70] font-bold">
                            {sharedInterests.length} shared
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {profile.interests.slice(0, 3).map(interest => {
                          const isShared = sharedInterests.includes(interest);
                          return (
                            <span
                              key={interest}
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                                isShared
                                  ? 'bg-[#f4e5e9] text-[#963756] border border-[#f0cdd6] font-semibold'
                                  : 'bg-[#faf7f2] text-[#695162] border border-[#ebdcd1]'
                              }`}
                            >
                              {interest}
                            </span>
                          );
                        })}
                        {profile.interests.length > 3 && (
                          <span className="text-[10px] text-[#8a7283] self-center">
                            +{profile.interests.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Card Actions: Connect button */}
                  <div className="pt-2 border-t border-[#f0e4d7] flex items-center gap-2">
                    {isMatched ? (
                      <button
                        onClick={() => onNavigateToMessages?.(profile.id)}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Chat Unlocked · Open Message
                      </button>
                    ) : (
                      <button
                        onClick={() => setConnectTargetProfile(profile)}
                        disabled={hasRequested}
                        className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          hasRequested
                            ? 'bg-[#faf4ee] text-[#8c7484] border border-[#ded1c2] cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#b64d70] to-[#db2777] text-white hover:from-[#c25a7d] hover:to-[#ec4899] shadow-sm shadow-[#db2777]/20 active:scale-98'
                        }`}
                      >
                        {hasRequested ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            Request Pending
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-3.5 w-3.5" />
                            Connect
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedProfile(profile)}
                      className="p-2.5 rounded-xl border border-[#ded1c2] text-[#64495c] hover:bg-[#faf4ee] hover:text-[#49233f] transition-colors cursor-pointer"
                      title="View Full Profile & Photos"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Video Intro Modal */}
      {selectedVideoProfile && selectedVideoProfile.videoIntro && (
        <VideoIntroModal
          profile={selectedVideoProfile}
          video={selectedVideoProfile.videoIntro}
          onClose={() => setSelectedVideoProfile(null)}
          onConnect={p => setConnectTargetProfile(p)}
          hasPendingRequest={(selectedVideoProfile as any).hasPendingRequest || sentRequestIds.has(selectedVideoProfile.id)}
          isMatched={(selectedVideoProfile as any).isMatched}
        />
      )}

      {/* Connection Request Modal */}
      {connectTargetProfile && (
        <ConnectModal
          recipient={connectTargetProfile}
          currentUser={currentUser}
          onClose={() => setConnectTargetProfile(null)}
          onSubmit={handleSendRequest}
        />
      )}

      {/* Expanded Full Profile Modal */}
      {expandedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-[#ded1c2] shadow-2xl flex flex-col">
            
            {/* Header image carousel */}
            <div className="relative h-80 sm:h-96 w-full bg-stone-900 shrink-0">
              <img
                src={expandedProfile.photos[0]?.url || '/logo.svg'}
                alt={expandedProfile.displayName}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setExpandedProfile(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                ✕
              </button>

              {expandedProfile.videoIntro && (
                <button
                  onClick={() => {
                    setSelectedVideoProfile(expandedProfile);
                  }}
                  className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-[#ec4899] text-white px-3.5 py-1.5 text-xs font-bold shadow-lg hover:bg-[#db2777] transition-all cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Watch Video Intro
                </button>
              )}

              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
                  {expandedProfile.displayName}, {expandedProfile.age}
                  {expandedProfile.verifiedAdult && (
                    <ShieldCheck className="h-5 w-5 text-[#ec4899]" />
                  )}
                </h3>
                <p className="text-xs text-[#f1d7ec] flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-[#ec4899]" />
                  {expandedProfile.university}
                  {expandedProfile.distanceKm !== undefined && (
                    <span>· ~{expandedProfile.distanceKm} km away</span>
                  )}
                </p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-6 space-y-6 flex-1">
              {/* Availability */}
              {expandedProfile.isAvailable && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Available Now
                  </div>
                  {expandedProfile.availableNote && (
                    <p className="text-emerald-950 font-medium">{expandedProfile.availableNote}</p>
                  )}
                </div>
              )}

              {/* Intentions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#49233f] uppercase tracking-wider">
                  Connection Intentions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(expandedProfile.intentions || [expandedProfile.intent || 'Casual meetups']).map(intent => (
                    <span
                      key={intent}
                      className={`text-xs font-semibold px-3 py-1 rounded-xl border ${getIntentionBadgeStyle(intent)}`}
                    >
                      {intent}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#49233f] uppercase tracking-wider">
                  About Me
                </h4>
                <p className="text-sm text-[#523b4c] leading-relaxed whitespace-pre-wrap">
                  {expandedProfile.bio}
                </p>
              </div>

              {/* Additional Photos */}
              {expandedProfile.photos.length > 1 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#49233f] uppercase tracking-wider">
                    Photos
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {expandedProfile.photos.slice(1).map(photo => (
                      <div key={photo.id} className="relative rounded-2xl overflow-hidden aspect-square border border-[#ded1c2] bg-stone-100">
                        <img
                          src={photo.url}
                          alt="Profile media"
                          className={`w-full h-full object-cover ${photo.isLocked ? 'blur-md scale-105' : ''}`}
                        />
                        {photo.isLocked && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-black/40 text-white text-xs">
                            <Lock className="h-5 w-5 mb-1 text-[#f8cadc]" />
                            <span className="font-semibold text-[11px]">Matched-Only Photo</span>
                            <span className="text-[10px] text-stone-200">Unlocks upon mutual connection</span>
                          </div>
                        )}
                        {photo.caption && !photo.isLocked && (
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1.5 text-[10px] text-white truncate">
                            {photo.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#49233f] uppercase tracking-wider">
                  Interests
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {expandedProfile.interests.map(interest => (
                    <span
                      key={interest}
                      className="text-xs font-medium px-3 py-1 rounded-xl bg-[#faf7f2] text-[#523b4c] border border-[#ded1c2]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#ded1c2] flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    setExpandedProfile(null);
                    setConnectTargetProfile(expandedProfile);
                  }}
                  disabled={(expandedProfile as any).hasPendingRequest || sentRequestIds.has(expandedProfile.id)}
                  className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-[#b64d70] to-[#db2777] text-white text-sm font-semibold hover:from-[#c25a7d] hover:to-[#ec4899] shadow-md shadow-[#db2777]/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4" />
                  {(expandedProfile as any).hasPendingRequest || sentRequestIds.has(expandedProfile.id)
                    ? 'Connection Request Pending'
                    : 'Send Connection Request'}
                </button>

                <div className="flex items-center justify-center gap-4 text-xs text-[#8c7484] w-full sm:w-auto">
                  <button
                    onClick={() => {
                      onReport(expandedProfile);
                      setExpandedProfile(null);
                    }}
                    className="hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Report User
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => {
                      onBlock(expandedProfile.id);
                      setExpandedProfile(null);
                    }}
                    className="hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Block User
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
