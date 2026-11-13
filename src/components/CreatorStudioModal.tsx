import React, { useState, useEffect } from 'react';
import { UserProfile, CreatorPost } from '../types';
import * as api from '../api';
import {
  Upload,
  Image as ImageIcon,
  Video,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  Eye,
  TrendingUp,
  Tag,
  Lock,
  Globe
} from 'lucide-react';

interface CreatorStudioModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onPostPublished: (post: CreatorPost) => void;
}

export const CreatorStudioModal: React.FC<CreatorStudioModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onPostPublished
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'performance'>('upload');
  
  // Upload form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'photo' | 'video'>('photo');
  const [mediaUrl, setMediaUrl] = useState('/images/african_woman_terrace_1793268562230.jpg');
  const [isExclusive, setIsExclusive] = useState(true);
  const [priceKes, setPriceKes] = useState(250);
  const [tagInput, setTagInput] = useState('Exclusive, Nairobi');
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Performance state
  const [stats, setStats] = useState<{
    postsCount: number;
    totalViews: number;
    totalSales: number;
    totalRevenueKes: number;
    withdrawableKes: number;
    myPosts: CreatorPost[];
  } | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Preset media options for quick demo selection
  const photoPresets = [
    { label: 'Terrace Sunset (Westlands)', url: '/images/african_woman_terrace_1793268562230.jpg' },
    { label: 'Evening Lounge Glamour', url: '/images/african_woman_evening_1793268636538.jpg' },
    { label: 'Lake Victoria Breeze (Kisumu)', url: '/images/african_woman_lake_1793268604137.jpg' },
    { label: 'Campus Courtyard Portrait', url: '/images/kenyan_student_stacy_1793273500891.jpg' },
    { label: 'Dennis Tarus Founder Studio', url: '/images/creator_dennis_tarus_1793271699871.jpg' }
  ];

  const videoPresets = [
    { label: 'Vertical Video Intro / Reel 1', url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-light-40156-large.mp4' },
    { label: 'Young Man Tech & Talk Reel', url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-smiling-and-talking-42999-large.mp4' }
  ];

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const data = await api.fetchCreatorPerformance();
      setStats(data);
    } catch (err) {
      console.error('Failed to load performance', err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'performance') {
      loadStats();
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!consentConfirmed) {
      setStatusMessage({
        type: 'error',
        text: 'You must confirm 18+ adult age, content ownership, and explicit consent for all depicted persons.'
      });
      return;
    }

    setIsPublishing(true);
    try {
      const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      const post = await api.publishCreatorPost({
        title,
        description,
        type,
        mediaUrl,
        previewUrl: mediaUrl,
        isExclusive,
        priceKes: isExclusive ? priceKes : 0,
        tags,
        consentConfirmed: true
      });

      setStatusMessage({
        type: 'success',
        text: `Successfully published "${post.title}" to the TEKA Creator Marketplace!`
      });
      onPostPublished(post);

      // Reset form
      setTitle('');
      setDescription('');
      setConsentConfirmed(false);
      setTimeout(() => {
        setActiveTab('performance');
        loadStats();
      }, 1200);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to publish post.'
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this content item?')) return;
    try {
      await api.deleteCreatorPost(postId);
      loadStats();
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#140618] border border-[#4a1844] text-white p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#341130] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#d8b975] to-[#b64d70] flex items-center justify-center text-[#140618] font-bold">
              👑
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">TEKA Creator Studio</h2>
              <p className="text-xs text-slate-400">
                Publish free lifestyle or paid exclusive content in Kenyan Shillings (KSh)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 bg-[#200926] rounded-xl border border-[#3e133a] mb-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'upload' ? 'bg-[#b64d70] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Upload Content</span>
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'performance' ? 'bg-[#b64d70] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Performance & Earnings</span>
          </button>
        </div>

        {statusMessage && (
          <div className={`mb-6 rounded-2xl p-4 text-xs flex items-center gap-3 border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* TAB 1: UPLOAD */}
        {activeTab === 'upload' && (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Title & Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Content Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Sunset Editorial Series · High Resolution"
                className="w-full rounded-xl bg-[#09020b] border border-[#3e133a] px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b64d70]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Description / Caption
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                placeholder="Share context, mood, or what makes this collection unique..."
                className="w-full rounded-xl bg-[#09020b] border border-[#3e133a] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b64d70]"
              />
            </div>

            {/* Media Type & Monetization Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Media Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setType('photo');
                      setMediaUrl(photoPresets[0].url);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      type === 'photo'
                        ? 'border-[#b64d70] bg-[#b64d70]/20 text-white'
                        : 'border-[#3e133a] bg-[#09020b] text-slate-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setType('video');
                      setMediaUrl(videoPresets[0].url);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      type === 'video'
                        ? 'border-[#b64d70] bg-[#b64d70]/20 text-white'
                        : 'border-[#3e133a] bg-[#09020b] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video className="h-4 w-4" />
                    <span>Video</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Monetization
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExclusive(false)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      !isExclusive
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                        : 'border-[#3e133a] bg-[#09020b] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    <span>Free Lifestyle</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExclusive(true)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      isExclusive
                        ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                        : 'border-[#3e133a] bg-[#09020b] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Lock className="h-4 w-4" />
                    <span>Paid Exclusive</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Price Selection (if exclusive) */}
            {isExclusive && (
              <div className="rounded-2xl bg-[#200926] border border-[#40123c] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-amber-400" />
                    <span>One-Time Purchase Price (Kenyan Shillings)</span>
                  </label>
                  <span className="text-sm font-mono font-bold text-white">
                    KSh {priceKes}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {[100, 150, 250, 350, 500, 1000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPriceKes(amt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                        priceKes === amt
                          ? 'bg-amber-400 text-[#140618] border-amber-400'
                          : 'bg-[#09020b] border-[#3e133a] text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      KSh {amt}
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <input
                    type="number"
                    min="50"
                    max="5000"
                    step="10"
                    value={priceKes}
                    onChange={e => setPriceKes(Number(e.target.value))}
                    className="w-full rounded-xl bg-[#09020b] border border-[#3e133a] px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    placeholder="Custom price (min KSh 50)"
                  />
                </div>
              </div>
            )}

            {/* Media Asset Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Media Asset
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                {(type === 'photo' ? photoPresets : videoPresets).map(preset => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setMediaUrl(preset.url)}
                    className={`p-2 rounded-xl border text-left text-[11px] truncate cursor-pointer ${
                      mediaUrl === preset.url
                        ? 'border-[#b64d70] bg-[#b64d70]/20 text-white font-bold'
                        : 'border-[#3e133a] bg-[#09020b] text-slate-400 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={mediaUrl}
                onChange={e => setMediaUrl(e.target.value)}
                placeholder="Or paste media URL..."
                className="w-full rounded-xl bg-[#09020b] border border-[#3e133a] px-4 py-2 text-xs text-white focus:outline-none focus:border-[#b64d70]"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="e.g. Exclusive, Rooftop, Glamour, Editorial"
                className="w-full rounded-xl bg-[#09020b] border border-[#3e133a] px-4 py-2 text-xs text-white focus:outline-none focus:border-[#b64d70]"
              />
            </div>

            {/* Mandatory Ownership & Consent Certification */}
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentConfirmed}
                  onChange={e => setConsentConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-amber-500 text-[#b64d70] focus:ring-0"
                  required
                />
                <div className="text-xs text-amber-200">
                  <strong className="block text-amber-300 font-semibold mb-0.5">
                    Adult Consent & Content Ownership Warranty (Strict Kenya 18+ Law)
                  </strong>
                  I certify that I am at least 18 years of age, hold full ownership and publishing rights to this media, and that all depicted adult persons gave voluntary, uncoerced consent to appear. Non-consensual or underage content results in immediate permanent ban and law enforcement escalation.
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={isPublishing}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#b64d70] to-[#db2777] hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-950/40 cursor-pointer disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              <span>{isPublishing ? 'Publishing...' : 'Publish to Marketplace'}</span>
            </button>
          </form>
        )}

        {/* TAB 2: PERFORMANCE & EARNINGS */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            {isLoadingStats ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading creator metrics...</div>
            ) : stats ? (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-2xl bg-[#200926] border border-[#40123c] p-3.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Total Views</span>
                    <p className="text-2xl font-bold font-mono text-white mt-1">{stats.totalViews}</p>
                  </div>
                  <div className="rounded-2xl bg-[#200926] border border-[#40123c] p-3.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Verified Sales</span>
                    <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{stats.totalSales}</p>
                  </div>
                  <div className="rounded-2xl bg-[#200926] border border-[#40123c] p-3.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Total Earned</span>
                    <p className="text-xl font-bold font-mono text-amber-300 mt-1">KSh {stats.totalRevenueKes}</p>
                  </div>
                  <div className="rounded-2xl bg-[#200926] border border-[#40123c] p-3.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Withdrawable</span>
                    <p className="text-xl font-bold font-mono text-teal-300 mt-1">KSh {stats.withdrawableKes}</p>
                  </div>
                </div>

                {/* Published Posts List */}
                <div>
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                    <span>Published Marketplace Items ({stats.myPosts.length})</span>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="text-xs text-[#b64d70] hover:underline cursor-pointer"
                    >
                      + Add New Content
                    </button>
                  </h3>

                  {stats.myPosts.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 bg-[#09020b] rounded-2xl border border-[#3e133a]">
                      No content uploaded yet. Switch to "Upload Content" to create your first listing.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {stats.myPosts.map(post => (
                        <div
                          key={post.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#200926] border border-[#40123c]"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={post.previewUrl || post.mediaUrl}
                              alt={post.title}
                              className="h-12 w-12 rounded-xl object-cover shrink-0 border border-[#52184d]"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">{post.title}</h4>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                                <span>{post.isExclusive ? `Exclusive · KSh ${post.priceKes}` : 'Free Lifestyle'}</span>
                                <span>·</span>
                                <span>{post.viewsCount || 0} views</span>
                                <span>·</span>
                                <span className="text-emerald-400 font-semibold">{post.salesCount || 0} sales</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-xl transition-colors cursor-pointer shrink-0"
                            title="Delete content"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
};
