import React, { useState, useEffect } from 'react';
import { UserProfile, CampusCircle } from '../types';
import * as api from '../api';
import {
  Users,
  Moon,
  Coffee,
  Code,
  Compass,
  Dumbbell,
  Sparkles,
  Heart,
  Send,
  X,
  PlusCircle,
  GraduationCap
} from 'lucide-react';

interface CampusCirclesModalProps {
  currentUser: UserProfile;
  onClose: () => void;
}

export const CampusCirclesModal: React.FC<CampusCirclesModalProps> = ({
  currentUser,
  onClose
}) => {
  const [circles, setCircles] = useState<CampusCircle[]>([]);
  const [selectedCircleId, setSelectedCircleId] = useState<string>('circle_night');
  const [newPostText, setNewPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadCircles = async () => {
    try {
      const data = await api.fetchCampusCircles();
      setCircles(data);
      if (data.length > 0 && !selectedCircleId) {
        setSelectedCircleId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCircles();
  }, []);

  const activeCircle = circles.find(c => c.id === selectedCircleId) || circles[0];

  const handleToggleJoin = async (circle: CampusCircle) => {
    const action = circle.isJoined ? 'leave' : 'join';
    try {
      await api.toggleJoinCircle(circle.id, action);
      loadCircles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() || !activeCircle || isPosting) return;

    setIsPosting(true);
    try {
      await api.postCircleUpdate(activeCircle.id, newPostText.trim());
      setNewPostText('');
      loadCircles();
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!activeCircle) return;
    try {
      await api.likeCirclePost(activeCircle.id, postId);
      loadCircles();
    } catch (err) {
      console.error(err);
    }
  };

  const getCircleIcon = (icon: string) => {
    switch (icon) {
      case 'Moon':
        return <Moon className="h-5 w-5 text-[#d946ef]" />;
      case 'Coffee':
        return <Coffee className="h-5 w-5 text-[#b45309]" />;
      case 'Code':
        return <Code className="h-5 w-5 text-[#2563eb]" />;
      case 'Compass':
        return <Compass className="h-5 w-5 text-[#059669]" />;
      case 'Dumbbell':
        return <Dumbbell className="h-5 w-5 text-[#dc2626]" />;
      default:
        return <Sparkles className="h-5 w-5 text-[#b64d70]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white border border-[#ded1c2] shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#ece0d4] px-6 py-4 bg-[#faf7f2]">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#b64d70]" />
            <div>
              <h3 className="font-serif text-lg font-bold text-[#49233f]">Campus Circles</h3>
              <p className="text-[11px] text-[#7e6576]">Interest-based communities for university adults</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#8c7484] hover:bg-[#ebdcd1] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Circles List */}
          <div className="w-full md:w-80 border-r border-[#ece0d4] bg-[#fffdfa] overflow-y-auto p-3 space-y-2 shrink-0">
            <p className="px-2 text-[10px] font-bold text-[#917587] uppercase tracking-wider">
              Explore Communities
            </p>

            {circles.map(circle => {
              const isSelected = circle.id === activeCircle?.id;
              return (
                <button
                  key={circle.id}
                  onClick={() => setSelectedCircleId(circle.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#fbe8ee] border-[#f0cdd6] shadow-xs'
                      : 'bg-white border-[#ece0d4] hover:bg-[#faf4ee]'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white border border-[#ebdcd1] shadow-2xs">
                    {getCircleIcon(circle.icon)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif text-sm font-bold text-[#49233f] truncate">
                      {circle.name}
                    </h4>
                    <p className="text-[11px] text-[#7e6576] truncate mt-0.5">
                      {circle.memberCount} adult members
                    </p>
                  </div>
                  {circle.isJoined && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                      Joined
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Circle Feed */}
          {activeCircle && (
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              
              {/* Circle Banner */}
              <div className="p-5 border-b border-[#ece0d4] bg-[#faf7f2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#b64d70] uppercase tracking-wider bg-[#f8ecf0] px-2 py-0.5 rounded-md">
                      {activeCircle.category} Community
                    </span>
                    <span className="text-xs text-[#8c7484]">· {activeCircle.memberCount} members</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#49233f] mt-1">
                    {activeCircle.name}
                  </h3>
                  <p className="text-xs text-[#64495c] mt-0.5">
                    {activeCircle.tagline}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleJoin(activeCircle)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeCircle.isJoined
                      ? 'bg-stone-100 text-stone-700 border border-stone-300 hover:bg-stone-200'
                      : 'bg-[#49233f] text-white hover:bg-[#5e2e51] shadow-xs'
                  }`}
                >
                  {activeCircle.isJoined ? 'Leave Circle' : '+ Join Community'}
                </button>
              </div>

              {/* Feed Posts */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                
                {/* Create Post Input */}
                {activeCircle.isJoined ? (
                  <form onSubmit={handleCreatePost} className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ebdcd1] space-y-2">
                    <textarea
                      rows={2}
                      placeholder={`Share an update or activity idea with ${activeCircle.name}...`}
                      value={newPostText}
                      onChange={e => setNewPostText(e.target.value)}
                      className="w-full rounded-xl border border-[#ded1c2] bg-white p-2.5 text-xs text-[#49233f] focus:outline-none focus:border-[#b64d70]"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isPosting || !newPostText.trim()}
                        className="px-4 py-1.5 rounded-xl bg-[#b64d70] hover:bg-[#c25a7d] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="h-3 w-3" />
                        Post
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-3 rounded-xl bg-[#faf5ef] border border-[#ece0d4] text-xs text-[#7e6576] text-center">
                    Join this circle to share updates and interact with community discussions.
                  </div>
                )}

                {/* Posts List */}
                {activeCircle.posts && activeCircle.posts.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#8c7484]">
                    No discussions in this circle yet. Be the first to start a conversation!
                  </div>
                ) : (
                  activeCircle.posts.map(post => {
                    const isLiked = post.likedBy?.includes(currentUser.id);
                    return (
                      <div key={post.id} className="p-4 rounded-2xl bg-white border border-[#ece0d4] shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={post.authorAvatar || '/logo.svg'}
                              alt={post.authorName}
                              className="h-9 w-9 rounded-full object-cover border border-[#ded1c2]"
                            />
                            <div>
                              <p className="text-xs font-bold text-[#49233f]">{post.authorName}</p>
                              <p className="text-[10px] text-[#7e6576] flex items-center gap-1">
                                <GraduationCap className="h-3 w-3 text-[#b64d70]" />
                                {post.authorCampus}
                              </p>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-[#381f33] leading-relaxed whitespace-pre-wrap">
                          {post.content}
                        </p>

                        <div className="pt-2 border-t border-[#f5ede4] flex items-center justify-between text-xs text-[#7e6576]">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className={`flex items-center gap-1 transition-colors cursor-pointer ${
                              isLiked ? 'text-[#b64d70] font-bold' : 'hover:text-[#49233f]'
                            }`}
                          >
                            <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current text-[#b64d70]' : ''}`} />
                            <span>{post.likesCount || 0}</span>
                          </button>

                          <span className="text-[10px]">Campus Adult Moderated</span>
                        </div>
                      </div>
                    );
                  })
                )}

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
