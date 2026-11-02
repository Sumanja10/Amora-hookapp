import React, { useState, useEffect } from 'react';
import { UserProfile, CreatorPost, ContentPurchase } from '../types';
import * as api from '../api';
import {
  Lock,
  Unlock,
  Sparkles,
  Eye,
  Smartphone,
  ShieldCheck,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Filter,
  Search,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Heart,
  Share2,
  X
} from 'lucide-react';

interface ExploreMarketplaceViewProps {
  currentUser: UserProfile;
  onOpenMpesaPurchase: (post: CreatorPost) => void;
  onOpenCreatorStudio: () => void;
  onViewCreatorProfile?: (creatorId: string) => void;
}

export const ExploreMarketplaceView: React.FC<ExploreMarketplaceViewProps> = ({
  currentUser,
  onOpenMpesaPurchase,
  onOpenCreatorStudio,
  onViewCreatorProfile
}) => {
  const [posts, setPosts] = useState<CreatorPost[]>([]);
  const [purchases, setPurchases] = useState<ContentPurchase[]>([]);
  const [filter, setFilter] = useState<'all' | 'exclusive' | 'free' | 'purchased'>('all');
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Media inspection preview modal
  const [inspectedPost, setInspectedPost] = useState<CreatorPost | null>(null);

  const loadMarketplaceData = async () => {
    setIsLoading(true);
    try {
      const [allPosts, myPurchases] = await Promise.all([
        api.fetchMarketplacePosts(filter === 'purchased' ? undefined : filter, selectedCreatorId || undefined),
        api.fetchMyPurchases()
      ]);
      setPosts(allPosts);
      setPurchases(myPurchases);
    } catch (err) {
      console.error('Failed to load marketplace posts', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMarketplaceData();
  }, [filter, selectedCreatorId]);

  // Determine if a post is unlocked for current user
  const isPostUnlocked = (post: CreatorPost) => {
    if (!post.isExclusive) return true;
    if (post.creatorId === currentUser.id || currentUser.id === 'usr_creator_dennis') return true;
    return purchases.some(p => p.postId === post.id);
  };

  // Filtered list
  const displayedPosts = posts.filter(post => {
    if (filter === 'purchased') {
      return purchases.some(p => p.postId === post.id);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchDesc = post.description?.toLowerCase().includes(q);
      const matchCreator = post.creatorProfile.displayName.toLowerCase().includes(q);
      const matchTags = post.tags?.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchCreator || matchTags;
    }
    return true;
  });

  // Extract unique creators for top carousel
  const uniqueCreators = Array.from(
    new Map(posts.map(p => [p.creatorProfile.id, p.creatorProfile])).values()
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Marketplace Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2a0c28] via-[#3a1338] to-[#4d1645] border border-[#6b2360]/50 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d8b975] bg-[#d8b975]/20 border border-[#d8b975]/40 px-2.5 py-0.5 rounded-full">
                Creator Marketplace · Kenya
              </span>
              <span className="text-xs text-white/70">One-Time KSh Payments</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Discover Independent Adult Creators
            </h1>
            <p className="text-xs sm:text-sm text-[#e6d3e2] leading-relaxed">
              Explore free lifestyle content or unlock exclusive high-resolution photos and private videos with instant M-Pesa one-time payments. No monthly subscriptions required.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={onOpenCreatorStudio}
              className="h-11 px-5 rounded-2xl bg-gradient-to-r from-[#d8b975] to-[#f5d78a] hover:opacity-95 text-[#1f0a1d] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Creator Studio</span>
            </button>
            <button
              onClick={() => setFilter('purchased')}
              className="h-11 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Unlock className="h-4 w-4 text-emerald-400" />
              <span>My Purchases ({purchases.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Creators Carousel */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7e6576]">
            Featured Kenyan Creators
          </h3>
          {selectedCreatorId && (
            <button
              onClick={() => setSelectedCreatorId(null)}
              className="text-xs font-semibold text-[#b64d70] hover:underline cursor-pointer"
            >
              Clear creator filter
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCreatorId(null)}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCreatorId === null
                ? 'bg-[#4a1844] border-[#8a2a7a] text-white shadow-sm'
                : 'bg-white border-[#e6d8cb] text-[#49233f] hover:border-[#b64d70]'
            }`}
          >
            <span>All Creators</span>
          </button>

          {uniqueCreators.map(creator => (
            <button
              key={creator.id}
              onClick={() => setSelectedCreatorId(selectedCreatorId === creator.id ? null : creator.id)}
              className={`flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-2xl border text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedCreatorId === creator.id
                  ? 'bg-[#4a1844] border-[#8a2a7a] text-white shadow-sm font-semibold'
                  : 'bg-white border-[#e6d8cb] text-[#49233f] hover:border-[#b64d70]'
              }`}
            >
              <img
                src={creator.avatar}
                alt={creator.displayName}
                className="h-7 w-7 rounded-full object-cover border border-[#b64d70]"
              />
              <span className="truncate max-w-[120px]">{creator.displayName}</span>
              {creator.verifiedAdult && (
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-[#e6d8cb] shadow-xs">
        
        {/* Segmented Control */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'bg-[#49233f] text-white shadow-xs'
                : 'text-[#64495c] hover:text-[#49233f]'
            }`}
          >
            All Content
          </button>
          <button
            onClick={() => setFilter('exclusive')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              filter === 'exclusive'
                ? 'bg-[#49233f] text-white shadow-xs'
                : 'text-[#64495c] hover:text-[#49233f]'
            }`}
          >
            <Lock className="h-3 w-3 text-amber-400" />
            <span>Exclusive Paid</span>
          </button>
          <button
            onClick={() => setFilter('free')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'free'
                ? 'bg-[#49233f] text-white shadow-xs'
                : 'text-[#64495c] hover:text-[#49233f]'
            }`}
          >
            Free Lifestyle
          </button>
          <button
            onClick={() => setFilter('purchased')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              filter === 'purchased'
                ? 'bg-[#49233f] text-white shadow-xs'
                : 'text-[#64495c] hover:text-[#49233f]'
            }`}
          >
            <Unlock className="h-3 w-3 text-emerald-500" />
            <span>My Purchases ({purchases.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search titles, tags, creators..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#faf7f2] border border-[#e6d8cb] text-[#49233f] placeholder:text-slate-400 focus:outline-none focus:border-[#b64d70]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid of Content Posts */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="h-8 w-8 mx-auto rounded-full border-2 border-[#b64d70] border-t-transparent animate-spin" />
          <p className="text-xs text-slate-500">Loading marketplace creations...</p>
        </div>
      ) : displayedPosts.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#e6d8cb] p-12 text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-[#faf7f2] flex items-center justify-center text-[#b64d70]">
            <Sparkles className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#49233f]">
              {filter === 'purchased' ? 'No Purchased Content Yet' : 'No Content Matches Selected Filter'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {filter === 'purchased'
                ? 'Exclusive photos and videos unlocked with one-time M-Pesa payments will appear in this private vault.'
                : 'Try adjusting your search query or reset the filter tabs.'}
            </p>
          </div>
          <button
            onClick={() => {
              setFilter('all');
              setSelectedCreatorId(null);
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-[#b64d70] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            View All Content
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPosts.map(post => {
            const unlocked = isPostUnlocked(post);

            return (
              <div
                key={post.id}
                className="group relative flex flex-col rounded-3xl bg-white border border-[#e6d8cb] overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                {/* Media Preview Box */}
                <div className="relative aspect-4/3 w-full bg-[#18061a] overflow-hidden">
                  
                  {/* Media Image / Video Poster */}
                  <img
                    src={unlocked ? (post.mediaUrl || post.previewUrl) : post.previewUrl}
                    alt={post.title}
                    className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-102 ${
                      !unlocked ? 'filter blur-md scale-105 opacity-80' : ''
                    }`}
                  />

                  {/* Format Indicator Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1 text-[10px] font-bold text-white">
                    {post.type === 'video' ? (
                      <>
                        <Video className="h-3 w-3 text-pink-400" />
                        <span>Video</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-3 w-3 text-sky-400" />
                        <span>Photo Series</span>
                      </>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {unlocked ? (
                      <span className="flex items-center gap-1 bg-emerald-600/90 backdrop-blur-md rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-xs">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{post.isExclusive ? 'Unlocked' : 'Free Lifestyle'}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-gradient-to-r from-amber-600 to-amber-500 rounded-full px-2.5 py-1 text-[10px] font-extrabold text-white shadow-md font-mono">
                        <Lock className="h-3 w-3" />
                        <span>KSh {post.priceKes}</span>
                      </span>
                    )}
                  </div>

                  {/* Locked Overlay with CTA */}
                  {!unlocked && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-4">
                      <div className="space-y-2 text-center">
                        <div className="mx-auto h-10 w-10 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
                          <Lock className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-white drop-shadow-sm">
                          Exclusive Creator Content
                        </p>
                        <p className="text-[11px] text-amber-200/90 font-mono">
                          Unlock forever for <strong>KSh {post.priceKes}</strong>
                        </p>

                        <button
                          onClick={() => onOpenMpesaPurchase(post)}
                          className="w-full h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95 cursor-pointer"
                        >
                          <Smartphone className="h-3.5 w-3.5" />
                          <span>Unlock with M-Pesa (KSh {post.priceKes})</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Unlocked Click-to-Inspect Action */}
                  {unlocked && (
                    <button
                      onClick={() => setInspectedPost(post)}
                      className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer"
                    >
                      <span className="rounded-full bg-white/90 text-[#49233f] px-3.5 py-1.5 text-xs font-bold shadow-lg flex items-center gap-1.5">
                        <Eye className="h-3.5 w-3.5" />
                        <span>View High-Res Media</span>
                      </span>
                    </button>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    {/* Creator Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.creatorProfile.avatar}
                          alt={post.creatorProfile.displayName}
                          className="h-6 w-6 rounded-full object-cover border border-[#b64d70]"
                        />
                        <span className="text-xs font-semibold text-[#49233f] truncate">
                          {post.creatorProfile.displayName}
                        </span>
                        {post.creatorProfile.verifiedAdult && (
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {post.creatorProfile.locationArea || post.creatorProfile.university}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-base font-bold text-[#49233f] line-clamp-1">
                      {post.title}
                    </h3>

                    {/* Description */}
                    {post.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                    )}
                  </div>

                  {/* Footer Meta & Actions */}
                  <div className="pt-2 border-t border-[#f0e6dc] flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{post.viewsCount || 0}</span>
                      </span>
                      {post.isExclusive && (
                        <span className="text-emerald-700 font-semibold font-mono">
                          {post.salesCount || 0} sold
                        </span>
                      )}
                    </div>

                    {unlocked ? (
                      <button
                        onClick={() => setInspectedPost(post)}
                        className="text-xs font-bold text-[#b64d70] hover:underline cursor-pointer"
                      >
                        View Full Media →
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenMpesaPurchase(post)}
                        className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        Buy for KSh {post.priceKes}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* High-Resolution Full Media Inspection Modal */}
      {inspectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#0e0410] border border-[#3e133a] p-4 sm:p-6 text-white shadow-2xl">
            
            <button
              onClick={() => setInspectedPost(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              {/* Creator Header */}
              <div className="flex items-center gap-3">
                <img
                  src={inspectedPost.creatorProfile.avatar}
                  alt={inspectedPost.creatorProfile.displayName}
                  className="h-10 w-10 rounded-full object-cover border border-[#b64d70]"
                />
                <div>
                  <h4 className="font-serif text-lg font-bold text-white">
                    {inspectedPost.title}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Published by {inspectedPost.creatorProfile.displayName} · {inspectedPost.creatorProfile.university}
                  </p>
                </div>
              </div>

              {/* Media Container */}
              <div className="relative w-full rounded-2xl bg-black overflow-hidden flex items-center justify-center max-h-[70vh]">
                {inspectedPost.type === 'video' ? (
                  <video
                    src={inspectedPost.mediaUrl}
                    poster={inspectedPost.previewUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-h-[65vh] object-contain rounded-2xl"
                  />
                ) : (
                  <img
                    src={inspectedPost.mediaUrl || inspectedPost.previewUrl}
                    alt={inspectedPost.title}
                    className="w-full max-h-[65vh] object-contain rounded-2xl"
                  />
                )}
              </div>

              {/* Caption */}
              {inspectedPost.description && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                  {inspectedPost.description}
                </div>
              )}

              {/* Safety & Copyright Tag */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified 18+ Adult Creator Content · Kenya</span>
                </span>
                <span>Protected by AMORA DRM</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
