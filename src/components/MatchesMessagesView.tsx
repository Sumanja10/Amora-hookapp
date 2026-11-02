import React, { useState, useEffect, useRef } from 'react';
import { Match, Message, UserProfile, ConnectionRequest } from '../types';
import {
  Send,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  MessageCircle,
  Sparkles,
  Smartphone,
  Copy,
  AlertCircle,
  GraduationCap,
  MapPin,
  Clock,
  Play,
  UserCheck,
  UserPlus,
  Trash2,
  Flag,
  UserX
} from 'lucide-react';

interface MatchesMessagesViewProps {
  matches: Match[];
  currentUser: UserProfile;
  activeMatchId?: string;
  onSelectMatch: (matchId: string) => void;
  onSendMessage: (matchId: string, text: string) => Promise<void>;
  messages: Message[];
  isLoadingMessages: boolean;
  onBlockMatch: (targetId: string) => void;
  onReportMatch: (targetProfile: UserProfile) => void;
  onOpenMpesaModal: (match: Match) => void;
  onDeleteConversation?: (matchId: string) => Promise<void>;
  // Connection requests for "Interested in You"
  incomingRequests: ConnectionRequest[];
  outgoingRequests: ConnectionRequest[];
  onRespondRequest: (requestId: string, action: 'accept' | 'decline') => Promise<void>;
  onWatchVideoIntro?: (profile: UserProfile) => void;
  initialSubTab?: 'chats' | 'requests';
}

export const MatchesMessagesView: React.FC<MatchesMessagesViewProps> = ({
  matches,
  currentUser,
  activeMatchId,
  onSelectMatch,
  onSendMessage,
  messages,
  isLoadingMessages,
  onBlockMatch,
  onReportMatch,
  onOpenMpesaModal,
  onDeleteConversation,
  incomingRequests,
  outgoingRequests,
  onRespondRequest,
  onWatchVideoIntro,
  initialSubTab = 'chats'
}) => {
  const [subTab, setSubTab] = useState<'chats' | 'requests'>(initialSubTab);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSafetyBanner, setShowSafetyBanner] = useState(true);
  const [copiedBanner, setCopiedBanner] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeMatch = matches.find(m => m.id === activeMatchId) || matches[0] || null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredMatches = matches.filter(m =>
    m.profile.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.profile.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeMatch || isSending) return;

    if (!activeMatch.chatUnlocked) {
      onOpenMpesaModal(activeMatch);
      return;
    }

    const textToSend = inputText.trim();
    setInputText('');
    setIsSending(true);
    setSendError(null);

    try {
      await onSendMessage(activeMatch.id, textToSend);
    } catch (err: any) {
      setSendError(err.message || 'Send failed. Please unlock chat.');
    } finally {
      setIsSending(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    setRespondingId(requestId);
    try {
      await onRespondRequest(requestId, 'accept');
      setSubTab('chats');
    } finally {
      setRespondingId(null);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    setRespondingId(requestId);
    try {
      await onRespondRequest(requestId, 'decline');
    } finally {
      setRespondingId(null);
    }
  };

  const pendingIncoming = incomingRequests.filter(r => r.status === 'pending');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      
      {/* Top Header Switcher: Conversations vs Interested in You */}
      <div className="flex items-center justify-between border-b border-[#e5d7ca] pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSubTab('chats')}
            className={`flex items-center gap-2 pb-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              subTab === 'chats'
                ? 'border-[#b64d70] text-[#49233f]'
                : 'border-transparent text-[#7e6576] hover:text-[#49233f]'
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            <span>Messages & Chats ({matches.length})</span>
          </button>

          <button
            onClick={() => setSubTab('requests')}
            className={`flex items-center gap-2 pb-2 text-sm font-bold border-b-2 transition-all cursor-pointer relative ${
              subTab === 'requests'
                ? 'border-[#b64d70] text-[#49233f]'
                : 'border-transparent text-[#7e6576] hover:text-[#49233f]'
            }`}
          >
            <Sparkles className="h-4 w-4 text-[#b64d70]" />
            <span>Interested in You</span>
            {pendingIncoming.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#b64d70] text-white text-[10px] font-bold">
                {pendingIncoming.length} new
              </span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW 1: INTERESTED IN YOU (Connection Requests) */}
      {subTab === 'requests' ? (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#ded1c2] bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0e4d7] pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#49233f]">
                  Incoming Connection Requests
                </h3>
                <p className="text-xs text-[#7e6576]">
                  These members want to connect with you. Accepting unlocks mutual private messaging.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#b64d70] bg-[#f8ecf0] px-3 py-1 rounded-full self-start sm:self-center">
                {pendingIncoming.length} pending
              </span>
            </div>

            {pendingIncoming.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf5ef] text-[#b64d70]">
                  <Sparkles className="h-6 w-6 opacity-70" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#49233f]">
                  No pending connection requests right now
                </h4>
                <p className="text-xs text-[#8c7484] max-w-sm mx-auto">
                  Activate your "Available Now" status in your profile or browse Discovery to connect with consenting adult peers!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pendingIncoming.map(req => {
                  const sender = req.senderProfile;
                  if (!sender) return null;

                  return (
                    <div
                      key={req.id}
                      className="flex flex-col justify-between rounded-3xl border border-[#ebdcd1] bg-[#faf7f2] p-5 shadow-xs space-y-4"
                    >
                      {/* Top: Sender Details */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={sender.photos[0]?.url || '/logo.svg'}
                              alt={sender.displayName}
                              className="h-16 w-16 rounded-2xl object-cover border border-[#ded1c2] shrink-0"
                            />
                            <div>
                              <h4 className="font-serif text-lg font-bold text-[#49233f]">
                                {sender.displayName}, {sender.age}
                              </h4>
                              <p className="text-xs text-[#7e6576] flex items-center gap-1 mt-0.5">
                                <GraduationCap className="h-3.5 w-3.5 text-[#b64d70] shrink-0" />
                                <span className="truncate">{sender.university}</span>
                              </p>
                              {sender.distanceKm !== undefined && (
                                <p className="text-xs text-[#9a7e92] flex items-center gap-1 mt-0.5">
                                  <MapPin className="h-3 w-3 text-[#b64d70] shrink-0" />
                                  <span>~{sender.distanceKm} km away</span>
                                </p>
                              )}
                            </div>
                          </div>

                          {sender.videoIntro && onWatchVideoIntro && (
                            <button
                              onClick={() => onWatchVideoIntro(sender)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ec4899] text-white text-[11px] font-bold shadow-xs hover:bg-[#db2777] transition-all cursor-pointer shrink-0"
                            >
                              <Play className="h-3 w-3 fill-current" />
                              Video
                            </button>
                          )}
                        </div>

                        {/* Selected Intention */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase text-[#8c7484] tracking-wider">
                            Intention:
                          </span>
                          <span className="text-xs font-semibold text-[#963756] bg-[#fbe8ee] border border-[#f0cdd6] px-2.5 py-0.5 rounded-lg">
                            {req.intention || 'Casual meetups'}
                          </span>
                        </div>

                        {/* Intro Note */}
                        {req.message && (
                          <div className="p-3 rounded-2xl bg-white border border-[#ebdcd1] text-xs text-[#49233f] italic leading-relaxed">
                            "{req.message}"
                          </div>
                        )}

                        {/* Shared Interests */}
                        {sender.interests && sender.interests.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {sender.interests.slice(0, 3).map(interest => (
                              <span
                                key={interest}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white text-[#6d5366] border border-[#ebdcd1]"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Buttons */}
                      <div className="pt-3 border-t border-[#ebdcd1] flex items-center gap-3">
                        <button
                          onClick={() => handleAcceptRequest(req.id)}
                          disabled={respondingId === req.id}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Accept & Unlock Chat
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(req.id)}
                          disabled={respondingId === req.id}
                          className="py-2.5 px-4 rounded-xl border border-[#ded1c2] text-[#8c7484] hover:bg-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Outgoing Requests */}
          {outgoingRequests.length > 0 && (
            <div className="rounded-3xl border border-[#ded1c2] bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-[#49233f]">
                Requests You Sent ({outgoingRequests.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {outgoingRequests.map(req => {
                  const recipient = req.recipientProfile;
                  return (
                    <div key={req.id} className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ebdcd1] flex items-center gap-3">
                      <img
                        src={recipient?.photos[0]?.url || '/logo.svg'}
                        alt={recipient?.displayName || 'Recipient'}
                        className="h-10 w-10 rounded-xl object-cover border border-[#ded1c2]"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#49233f] truncate">
                          {recipient?.displayName}
                        </p>
                        <p className="text-[10px] text-[#7e6576] truncate">
                          {req.intention || 'Casual meetups'} · {req.status === 'pending' ? 'Pending Acceptance' : req.status}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: CHATS & MESSAGES */
        <div className="rounded-3xl border border-[#ded1c2] bg-white shadow-xl overflow-hidden min-h-[640px] flex flex-col md:flex-row">
          
          {/* Left Column: Matches List */}
          <div className={`w-full md:w-80 lg:w-96 border-r border-[#ece0d4] flex flex-col bg-[#fffdfa] ${
            activeMatch && 'hidden md:flex'
          }`}>
            <div className="p-4 border-b border-[#ece0d4] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-[#49233f]">
                  Active Conversations
                </h3>
                <span className="text-xs font-semibold text-[#b64d70] bg-[#f4e5e9] px-2.5 py-0.5 rounded-full tabular-nums">
                  {matches.length}
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#917587]" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] pl-8 pr-3 py-1.5 text-xs text-[#49233f] placeholder-[#917587] focus:border-[#b64d70] focus:bg-white"
                />
              </div>
            </div>

            {/* List of Matches */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#f5ede4]">
              {filteredMatches.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#7e6878] space-y-2">
                  <MessageCircle className="mx-auto h-8 w-8 text-[#d8b975] opacity-60" />
                  <p className="font-medium">No conversations found.</p>
                  <p>Browse campus discovery to send connection requests or check "Interested in You"!</p>
                </div>
              ) : (
                filteredMatches.map(match => {
                  const isSelected = activeMatch?.id === match.id;
                  return (
                    <button
                      key={match.id}
                      onClick={() => onSelectMatch(match.id)}
                      className={`w-full flex items-center gap-3 p-3.5 text-left transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#f4e5e9]/70' : 'hover:bg-[#faf4ee]'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={match.profile.photos[0]?.url || '/logo.svg'}
                          alt={match.profile.displayName}
                          className="h-12 w-12 rounded-full object-cover border border-[#e5d8cb]"
                        />
                        {match.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b64d70] px-1 text-[10px] font-bold text-white">
                            {match.unreadCount}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between">
                          <h4 className="font-serif text-sm font-bold text-[#49233f] truncate">
                            {match.profile.displayName}
                          </h4>
                          {match.lastMessageAt && (
                            <span className="text-[10px] text-[#8e7686]">
                              {new Date(match.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#6e5466] truncate mt-0.5">
                          {match.lastMessage || 'Connected! Start the conversation...'}
                        </p>

                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] text-[#937b8b] flex items-center gap-1">
                            <GraduationCap className="h-3 w-3 text-[#b64d70]" />
                            {match.profile.university.split(' ')[0]}
                          </span>
                          {match.profile.distanceKm !== undefined && (
                            <span className="text-[10px] text-[#8e7686]">
                              · ~{match.profile.distanceKm} km
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Chat Stream */}
          {activeMatch ? (
            <div className="flex-1 flex flex-col bg-white">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-[#ece0d4] bg-[#faf7f2] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={activeMatch.profile.photos[0]?.url || '/logo.svg'}
                    alt={activeMatch.profile.displayName}
                    className="h-10 w-10 rounded-full object-cover border border-[#ded1c2]"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#49233f] flex items-center gap-1.5">
                      {activeMatch.profile.displayName}, {activeMatch.profile.age}
                      {activeMatch.profile.isAvailable && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Available Now" />
                      )}
                    </h4>
                    <p className="text-[11px] text-[#7e6576]">
                      {activeMatch.profile.university} {activeMatch.profile.distanceKm ? `· ~${activeMatch.profile.distanceKm} km away` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="hidden sm:flex text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Mutual Consent
                  </span>

                  {onDeleteConversation && (
                    <button
                      onClick={async () => {
                        if (confirm('Delete this conversation history?')) {
                          await onDeleteConversation(activeMatch.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Conversation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    onClick={() => onReportMatch(activeMatch.profile)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                    title="Report Member"
                  >
                    <Flag className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Block ${activeMatch.profile.displayName}? You will no longer see each other.`)) {
                        onBlockMatch(activeMatch.profile.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Block Member"
                  >
                    <UserX className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#fdfbf7]">
                {messages.length === 0 ? (
                  <div className="py-16 text-center text-xs text-[#8c7484] space-y-2">
                    <p className="font-bold text-[#49233f] text-sm font-serif">You are mutually connected!</p>
                    <p>Send a message to coordinate your meetup plans.</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.senderId === currentUser.id;
                    const isSystemPayment = msg.type === 'mpesa_payment';

                    if (isSystemPayment) {
                      return (
                        <div key={msg.id} className="mx-auto my-2 max-w-sm rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-center text-xs text-emerald-900 shadow-2xs">
                          <p className="font-bold">{msg.text}</p>
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                            isMe
                              ? 'bg-[#49233f] text-white rounded-br-xs'
                              : 'bg-white text-[#381f33] border border-[#ece0d4] rounded-bl-xs'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                          <span className={`block text-[9px] mt-1 text-right ${isMe ? 'text-white/60' : 'text-[#8e7686]'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Box */}
              <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-[#ece0d4] bg-[#faf7f2] flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a respectful message..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="flex-1 rounded-xl border border-[#ded1c2] bg-white px-4 py-2.5 text-xs text-[#49233f] focus:outline-none focus:border-[#b64d70]"
                />
                <button
                  type="submit"
                  disabled={isSending || !inputText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#b64d70] hover:bg-[#c25a7d] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send</span>
                </button>
              </form>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-[#8c7484]">
              Select a conversation to start chatting.
            </div>
          )}

        </div>
      )}

    </div>
  );
};
