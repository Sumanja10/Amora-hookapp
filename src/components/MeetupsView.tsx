import React, { useState } from 'react';
import { UserProfile, MeetupPlan, MeetupCategory } from '../types';
import {
  Coffee,
  Utensils,
  Film,
  Compass,
  MessageSquare,
  Zap,
  Plus,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Sparkles,
  Send,
  X,
  MessageCircle
} from 'lucide-react';

interface MeetupsViewProps {
  currentUser: UserProfile;
  plans: MeetupPlan[];
  onCreatePlan: (data: {
    title: string;
    category: string;
    locationArea: string;
    timeframe: string;
    intention: string;
    description: string;
    maxCompany?: number;
  }) => Promise<void>;
  onExpressInterest: (planId: string, note?: string) => Promise<void>;
  onRespondInterest: (planId: string, requestId: string, action: 'approve' | 'decline') => Promise<void>;
  onNavigateToMessages?: (matchId?: string) => void;
  isLoading: boolean;
}

const CATEGORIES: Array<{ id: MeetupCategory | 'all'; label: string; icon: React.FC<{ className?: string }> }> = [
  { id: 'all', label: 'All Plans', icon: Sparkles },
  { id: 'coffee', label: 'Coffee Together', icon: Coffee },
  { id: 'lunch', label: 'Lunch Plans', icon: Utensils },
  { id: 'movies', label: 'Movies', icon: Film },
  { id: 'outings', label: 'Social Outings', icon: Compass },
  { id: 'conversations', label: 'Casual Conversations', icon: MessageSquare },
  { id: 'spontaneous', label: 'Spontaneous Meetups', icon: Zap }
];

export const MeetupsView: React.FC<MeetupsViewProps> = ({
  currentUser,
  plans,
  onCreatePlan,
  onExpressInterest,
  onRespondInterest,
  onNavigateToMessages,
  isLoading
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MeetupCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'browse' | 'my-plans'>('browse');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [interestTargetPlan, setInterestTargetPlan] = useState<MeetupPlan | null>(null);
  const [interestNote, setInterestNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New plan form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MeetupCategory>('coffee');
  const [newLocation, setNewLocation] = useState('');
  const [newTimeframe, setNewTimeframe] = useState('');
  const [newIntention, setNewIntention] = useState('Casual meetups');
  const [newDescription, setNewDescription] = useState('');
  const [newMaxCompany, setNewMaxCompany] = useState(2);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredPlans = plans.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    return true;
  });

  const myPlans = plans.filter(p => p.creatorId === currentUser.id);
  const totalPendingApplicants = myPlans.reduce(
    (sum, p) => sum + (p.requests ? p.requests.filter(r => r.status === 'pending').length : 0),
    0
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim() || !newTimeframe.trim()) {
      setFormError('Please fill in title, safe public venue location, and timeframe.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      await onCreatePlan({
        title: newTitle.trim(),
        category: newCategory,
        locationArea: newLocation.trim(),
        timeframe: newTimeframe.trim(),
        intention: newIntention,
        description: newDescription.trim(),
        maxCompany: newMaxCompany
      });
      setCreateModalOpen(false);
      setNewTitle('');
      setNewLocation('');
      setNewTimeframe('');
      setNewDescription('');
    } catch (err: any) {
      setFormError(err.message || 'Failed to post meet-up plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interestTargetPlan) return;
    setIsSubmitting(true);
    try {
      await onExpressInterest(interestTargetPlan.id, interestNote.trim() || undefined);
      setInterestTargetPlan(null);
      setInterestNote('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'coffee':
        return <Coffee className="h-4 w-4 text-[#9c2f52]" />;
      case 'lunch':
        return <Utensils className="h-4 w-4 text-[#b45309]" />;
      case 'movies':
        return <Film className="h-4 w-4 text-[#4338ca]" />;
      case 'outings':
        return <Compass className="h-4 w-4 text-[#047857]" />;
      case 'conversations':
        return <MessageSquare className="h-4 w-4 text-[#1d4ed8]" />;
      case 'spontaneous':
        return <Zap className="h-4 w-4 text-[#c026d3]" />;
      default:
        return <Sparkles className="h-4 w-4 text-[#b64d70]" />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2a0e28] via-[#3a1336] to-[#1a0818] p-6 sm:p-8 text-white border border-[#4d1f48] shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#f8cadc] border border-white/15">
              <Sparkles className="h-3.5 w-3.5 text-[#ec4899]" />
              Activity-First Connection
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Campus Meet-up Plans
            </h1>
            <p className="text-xs sm:text-sm text-[#d7b6d1] leading-relaxed">
              Post activities you’d like company for — coffee, lunch, movies, spontaneous evening drinks, or deep conversations. Other users express interest, and you approve before private messaging unlocks.
            </p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#b64d70] to-[#db2777] hover:from-[#c25a7d] hover:to-[#ec4899] text-white text-xs font-bold shadow-lg shadow-[#db2777]/25 transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Post a Meet-up Plan
          </button>
        </div>
      </div>

      {/* Tabs & Category Filter Bar */}
      <div className="space-y-4">
        {/* Main Tab Bar */}
        <div className="flex items-center justify-between border-b border-[#e6d8cb] pb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('browse')}
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'browse'
                  ? 'border-[#b64d70] text-[#49233f]'
                  : 'border-transparent text-[#7e6576] hover:text-[#49233f]'
              }`}
            >
              Browse All Plans ({plans.length})
            </button>
            <button
              onClick={() => setActiveTab('my-plans')}
              className={`relative text-sm font-semibold pb-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'my-plans'
                  ? 'border-[#b64d70] text-[#49233f]'
                  : 'border-transparent text-[#7e6576] hover:text-[#49233f]'
              }`}
            >
              My Plans & Applicants ({myPlans.length})
              {totalPendingApplicants > 0 && (
                <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[#b64d70] text-white text-[10px] font-bold">
                  {totalPendingApplicants} new
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        {activeTab === 'browse' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#49233f] text-white border-[#49233f] shadow-xs'
                      : 'bg-white text-[#64495c] border-[#ded1c2] hover:bg-[#faf4ee]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === 'my-plans' ? (
        /* MY PLANS & APPLICANTS VIEW */
        <div className="space-y-6">
          {myPlans.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#d8c3b4] bg-white p-12 text-center space-y-3">
              <Sparkles className="mx-auto h-10 w-10 text-[#b64d70] opacity-60" />
              <h3 className="font-serif text-lg font-bold text-[#49233f]">You haven't posted any meet-up plans yet</h3>
              <p className="text-xs text-[#8a7283] max-w-md mx-auto">
                Post an activity you’d enjoy company for — coffee, lunch, movies, or weekend strolls. Review interested members and approve connections!
              </p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#49233f] text-white text-xs font-semibold hover:bg-[#5e2e51] transition-colors cursor-pointer"
              >
                Create Your First Plan
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {myPlans.map(plan => {
                const pendingRequests = plan.requests ? plan.requests.filter(r => r.status === 'pending') : [];
                const approvedRequests = plan.requests ? plan.requests.filter(r => r.status === 'approved') : [];

                return (
                  <div key={plan.id} className="rounded-3xl border border-[#ded1c2] bg-white p-6 shadow-sm space-y-5">
                    {/* Plan Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0e4d7] pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="p-1 rounded-md bg-[#faf4ee] border border-[#ebdcd1]">
                            {getCategoryIcon(plan.category)}
                          </span>
                          <span className="text-[11px] font-semibold text-[#8c7484] uppercase tracking-wider">
                            {plan.categoryLabel}
                          </span>
                          <span className="text-xs font-semibold text-[#963756] bg-[#fbe8ee] px-2 py-0.5 rounded-md">
                            {plan.intention}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-[#49233f]">{plan.title}</h3>
                        <p className="text-xs text-[#7e6576] flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-[#b64d70]" />
                            {plan.timeframe}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[#b64d70]" />
                            {plan.locationArea}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className="text-xs font-semibold text-[#49233f] bg-[#f5ede4] px-3 py-1 rounded-full">
                          {plan.requests?.length || 0} interested
                        </span>
                      </div>
                    </div>

                    {/* Applicants Section */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-[#49233f] uppercase tracking-wider">
                        Applicant Requests ({pendingRequests.length} pending approval)
                      </h4>

                      {plan.requests && plan.requests.length === 0 ? (
                        <p className="text-xs text-[#8c7484] italic">
                          No one has applied yet. Your plan is live on campus discovery!
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {plan.requests?.map(req => {
                            const applicant = req.userProfile;
                            const isPending = req.status === 'pending';
                            const isApproved = req.status === 'approved';

                            return (
                              <div
                                key={req.id}
                                className={`p-4 rounded-2xl border transition-all ${
                                  isApproved
                                    ? 'bg-emerald-50/60 border-emerald-200'
                                    : 'bg-[#faf7f2] border-[#ebdcd1]'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={applicant?.photos[0]?.url || '/logo.svg'}
                                    alt={applicant?.displayName || 'Applicant'}
                                    className="h-12 w-12 rounded-xl object-cover border border-[#ded1c2] shrink-0"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <h5 className="font-serif text-sm font-bold text-[#49233f] truncate">
                                      {applicant?.displayName}, {applicant?.age}
                                    </h5>
                                    <p className="text-[11px] text-[#7e6576] truncate">
                                      {applicant?.university} {applicant?.distanceKm ? `· ~${applicant.distanceKm} km` : ''}
                                    </p>
                                  </div>
                                </div>

                                {req.note && (
                                  <p className="mt-2 text-xs text-[#523b4c] bg-white p-2 rounded-xl border border-[#ebdcd1] italic leading-relaxed">
                                    "{req.note}"
                                  </p>
                                )}

                                <div className="mt-3 pt-2 border-t border-[#ebdcd1] flex items-center justify-between">
                                  {isPending ? (
                                    <div className="flex items-center gap-2 w-full">
                                      <button
                                        onClick={() => onRespondInterest(plan.id, req.id, 'approve')}
                                        className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                      >
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Approve & Unlock Chat
                                      </button>
                                      <button
                                        onClick={() => onRespondInterest(plan.id, req.id, 'decline')}
                                        className="py-1.5 px-3 rounded-lg border border-[#ded1c2] text-[#8c7484] hover:bg-white text-xs font-medium transition-colors cursor-pointer"
                                      >
                                        Decline
                                      </button>
                                    </div>
                                  ) : isApproved ? (
                                    <div className="flex items-center justify-between w-full">
                                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Approved · Connected
                                      </span>
                                      <button
                                        onClick={() => onNavigateToMessages?.()}
                                        className="text-xs font-semibold text-[#b64d70] hover:underline flex items-center gap-1 cursor-pointer"
                                      >
                                        <MessageCircle className="h-3.5 w-3.5" />
                                        Open Chat
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-[#8c7484] italic">Declined</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* BROWSE ALL PLANS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map(plan => {
            const creator = plan.creatorProfile;
            const isMyPlan = plan.creatorId === currentUser.id;
            const hasRequested = plan.hasRequested;

            return (
              <div
                key={plan.id}
                className="flex flex-col rounded-3xl border border-[#ded1c2] bg-white p-5 shadow-sm hover:shadow-md transition-shadow justify-between space-y-4"
              >
                
                {/* Top Section: Category & Intention */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#64495c] bg-[#faf4ee] border border-[#ebdcd1] px-2.5 py-1 rounded-lg">
                      {getCategoryIcon(plan.category)}
                      {plan.categoryLabel}
                    </span>
                    <span className="text-[11px] font-semibold text-[#963756] bg-[#fbe8ee] border border-[#f2c7d4] px-2 py-0.5 rounded-md">
                      {plan.intention}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#49233f] leading-snug">
                    {plan.title}
                  </h3>

                  <p className="text-xs text-[#523b4c] leading-relaxed line-clamp-3">
                    {plan.description}
                  </p>
                </div>

                {/* Plan Meta: Timeframe, Safe Public Venue */}
                <div className="space-y-2 p-3 rounded-2xl bg-[#faf7f2] border border-[#ece0d4] text-xs">
                  <div className="flex items-center gap-2 text-[#49233f] font-medium">
                    <Clock className="h-3.5 w-3.5 text-[#b64d70] shrink-0" />
                    <span>{plan.timeframe}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#64495c]">
                    <MapPin className="h-3.5 w-3.5 text-[#b64d70] shrink-0" />
                    <span className="truncate">{plan.locationArea}</span>
                  </div>
                </div>

                {/* Creator Snapshot & CTA */}
                <div className="pt-3 border-t border-[#f0e4d7] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={creator?.photos[0]?.url || '/logo.svg'}
                      alt={creator?.displayName || 'Creator'}
                      className="h-10 w-10 rounded-full object-cover border border-[#ded1c2] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#49233f] truncate">
                        {creator?.displayName}, {creator?.age}
                      </p>
                      <p className="text-[11px] text-[#7e6576] truncate">
                        {creator?.university} {creator?.distanceKm ? `· ~${creator.distanceKm} km` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Action button */}
                  {isMyPlan ? (
                    <button
                      onClick={() => setActiveTab('my-plans')}
                      className="py-2 px-3 rounded-xl bg-[#faf4ee] border border-[#ded1c2] text-xs font-semibold text-[#49233f] hover:bg-[#f3eae1] transition-colors cursor-pointer shrink-0"
                    >
                      Manage ({plan.requestsCount || 0})
                    </button>
                  ) : hasRequested ? (
                    <button
                      disabled
                      className="py-2 px-3 rounded-xl bg-[#f5ede4] text-[#8c7484] text-xs font-semibold cursor-not-allowed shrink-0"
                    >
                      Interest Sent
                    </button>
                  ) : (
                    <button
                      onClick={() => setInterestTargetPlan(plan)}
                      className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#b64d70] to-[#db2777] hover:from-[#c25a7d] hover:to-[#ec4899] text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0 active:scale-95"
                    >
                      I'm Interested
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Post a Meet-up Plan Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white border border-[#ded1c2] shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#ece0d4] px-6 py-4 bg-[#faf7f2]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#b64d70]" />
                <h3 className="font-serif text-lg font-bold text-[#49233f]">Post a Meet-up Activity</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="rounded-full p-1 text-[#8c7484] hover:bg-[#ebdcd1] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 overflow-y-auto">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#49233f] uppercase tracking-wider">
                  Activity Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => {
                    const isSel = newCategory === c.id;
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setNewCategory(c.id as MeetupCategory)}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                          isSel
                            ? 'border-[#b64d70] bg-[#f8ecf0] text-[#912d50] font-bold'
                            : 'border-[#ded1c2] bg-[#faf7f2] text-[#64495c] hover:bg-[#f3eae1]'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#49233f] uppercase tracking-wider">
                  Activity Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Afternoon pour-overs & playlist swap"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2.5 text-xs text-[#49233f] focus:outline-none focus:border-[#b64d70]"
                  required
                />
              </div>

              {/* Venue & Timeframe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#49233f] uppercase tracking-wider">
                    Safe Public Venue / Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Java House Maseno / Artcaffe Westlands"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2.5 text-xs text-[#49233f] focus:outline-none focus:border-[#b64d70]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#49233f] uppercase tracking-wider">
                    Proposed Timeframe
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Today at 4:30 PM / Friday Evening"
                    value={newTimeframe}
                    onChange={e => setNewTimeframe(e.target.value)}
                    className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2.5 text-xs text-[#49233f] focus:outline-none focus:border-[#b64d70]"
                    required
                  />
                </div>
              </div>

              {/* Connection Intention */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#49233f] uppercase tracking-wider">
                  Meetup Intention
                </label>
                <select
                  value={newIntention}
                  onChange={e => setNewIntention(e.target.value)}
                  className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2.5 text-xs text-[#49233f] focus:outline-none focus:border-[#b64d70]"
                >
                  <option value="Casual meetups">Casual meetups</option>
                  <option value="Casual conversations">Casual conversations</option>
                  <option value="Casual dating">Casual dating</option>
                  <option value="Friendship">Friendship</option>
                  <option value="Flirting">Flirting</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#49233f] uppercase tracking-wider">
                  Description & What to Expect
                </label>
                <textarea
                  rows={3}
                  placeholder="Share a short note on what kind of company you're looking for, music taste, or what you'd like to chat about..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2.5 text-xs text-[#49233f] focus:outline-none focus:border-[#b64d70]"
                />
              </div>

              {/* Safety notice */}
              <div className="rounded-xl bg-[#f5fbf7] border border-[#c4e3cf] p-3 text-xs text-[#2b5838] flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-[#2b884d]" />
                <p>
                  <strong>Approval Rule:</strong> When other adults express interest, you have full control to approve or decline before private chat is unlocked.
                </p>
              </div>

              {formError && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-2.5 text-xs text-red-700">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#ded1c2] text-xs font-semibold text-[#64495c] hover:bg-[#faf4ee] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#b64d70] to-[#db2777] text-white text-xs font-bold hover:from-[#c25a7d] hover:to-[#ec4899] shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting Plan...' : 'Post Meet-up Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Express Interest Modal */}
      {interestTargetPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white border border-[#ded1c2] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#f0e4d7] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#49233f]">
                Join "{interestTargetPlan.title}"
              </h3>
              <button
                onClick={() => setInterestTargetPlan(null)}
                className="rounded-full p-1 text-[#8c7484] hover:bg-[#ebdcd1] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-[#64495c] leading-relaxed">
              Express your interest to <strong>{interestTargetPlan.creatorProfile?.displayName.split(' ')[0]}</strong>. The creator must approve your request before private messaging unlocks.
            </p>

            <form onSubmit={handleInterestSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#49233f]">
                  Add a friendly note <span className="text-[#8c7484] font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={140}
                  placeholder="e.g. Free around 4:30 PM! I love iced pour-overs and know a great quiet booth there."
                  value={interestNote}
                  onChange={e => setInterestNote(e.target.value)}
                  className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] p-2.5 text-xs text-[#49233f] focus:outline-none focus:border-[#b64d70]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInterestTargetPlan(null)}
                  className="px-4 py-2 rounded-xl border border-[#ded1c2] text-xs font-semibold text-[#64495c] hover:bg-[#faf4ee] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#b64d70] to-[#db2777] text-white text-xs font-bold hover:from-[#c25a7d] hover:to-[#ec4899] shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending Request...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
