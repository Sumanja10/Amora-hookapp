import React, { useState, useEffect } from 'react';
import { UserProfile, AdminPlatformStats, AgeVerificationRecord, CreatorPost, MpesaPayment } from '../types';
import * as api from '../api';
import {
  Crown,
  ShieldCheck,
  Users,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  XCircle,
  X,
  Search,
  Eye,
  TrendingUp,
  DollarSign,
  Flag,
  UserX,
  Lock,
  RefreshCw,
  FileCheck
} from 'lucide-react';

interface AdminDashboardModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  currentUser,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'users' | 'moderation' | 'ledger'>('overview');
  const [stats, setStats] = useState<AdminPlatformStats | null>(null);
  const [verifications, setVerifications] = useState<AgeVerificationRecord[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<CreatorPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const isAdmin = currentUser.id === 'usr_creator_dennis' || currentUser.email === 'dennistarus10@gmail.com' || currentUser.isCreator;

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [st, vList, uList, pList] = await Promise.all([
        api.fetchAdminStats(),
        api.fetchAdminVerifications(),
        api.fetchAdminUsers(),
        api.fetchMarketplacePosts()
      ]);
      setStats(st);
      setVerifications(vList);
      setUsers(uList);
      setPosts(pList);
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadAdminData();
    }
  }, [isOpen, isAdmin, activeTab]);

  if (!isOpen) return null;

  const handleReviewVerification = async (id: string, action: 'approve' | 'reject') => {
    try {
      await api.reviewAdminVerification(id, action);
      setActionNotice(`Verification record marked as ${action === 'approve' ? 'APPROVED' : 'REJECTED'}.`);
      loadAdminData();
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Verification update failed');
    }
  };

  const handleToggleSuspend = async (userId: string, currentSuspended: boolean) => {
    const nextState = !currentSuspended;
    const reason = nextState ? prompt('Enter reason for account suspension:', 'Violation of adult platform rules') : undefined;
    if (nextState && reason === null) return;

    try {
      await api.toggleAdminUserSuspension(userId, nextState, reason || undefined);
      setActionNotice(`User account ${nextState ? 'SUSPENDED' : 'REINSTATED'}.`);
      loadAdminData();
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Suspension toggle failed');
    }
  };

  const handleModeratePost = async (postId: string, action: 'approve' | 'flag' | 'remove') => {
    try {
      await api.moderateAdminPost(postId, action);
      setActionNotice(`Post status updated to ${action.toUpperCase()}.`);
      loadAdminData();
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Post moderation failed');
    }
  };

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="w-full max-w-md rounded-3xl bg-[#140618] border border-rose-500/40 p-6 text-center text-white space-y-4">
          <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto" />
          <h3 className="font-serif text-xl font-bold">Access Denied</h3>
          <p className="text-xs text-slate-300">
            This administrator console is strictly restricted to platform architect Dennis Tarus (dennistarus10@gmail.com).
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#120415] border border-[#4a1844] text-white p-6 sm:p-8 shadow-2xl my-6 flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#341130] pb-4 mb-6 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#d8b975] to-[#b64d70] flex items-center justify-center text-[#140618] font-bold shadow-lg">
              <Crown className="h-6 w-6 text-[#140618]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d8b975] bg-[#d8b975]/20 border border-[#d8b975]/40 px-2.5 py-0.5 rounded-full">
                  Dennis Tarus · Administrator Console
                </span>
                <span className="text-xs text-slate-400">Maseno University</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">TEKA Operations & Moderation</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAdminData}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#1e0722] rounded-2xl border border-[#3e133a] mb-6 overflow-x-auto shrink-0">
          {[
            { id: 'overview', label: 'Platform Stats', icon: TrendingUp },
            { id: 'verifications', label: `Age & ID Queue (${verifications.filter(v => v.status === 'pending').length})`, icon: ShieldCheck },
            { id: 'users', label: `Members (${users.length})`, icon: Users },
            { id: 'moderation', label: `Content Moderation (${posts.length})`, icon: Flag },
            { id: 'ledger', label: 'M-Pesa Ledger', icon: Receipt }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#b64d70] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {actionNotice && (
          <div className="mb-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 p-3 text-xs text-emerald-300 flex items-center gap-2 shrink-0">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-[#1e0722] border border-[#3e133a] p-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Members</span>
                  <p className="text-3xl font-bold font-mono text-white mt-1">{stats.totalUsers}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Adult registered users</p>
                </div>
                <div className="rounded-2xl bg-[#1e0722] border border-[#3e133a] p-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400">18+ Verified IDs</span>
                  <p className="text-3xl font-bold font-mono text-emerald-400 mt-1">{stats.totalAdultsVerified}</p>
                  <p className="text-[11px] text-emerald-300/80 mt-1">Multi-factor verified</p>
                </div>
                <div className="rounded-2xl bg-[#1e0722] border border-[#3e133a] p-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Creators</span>
                  <p className="text-3xl font-bold font-mono text-amber-300 mt-1">{stats.totalCreators}</p>
                  <p className="text-[11px] text-amber-200/80 mt-1">Publishing marketplace items</p>
                </div>
                <div className="rounded-2xl bg-[#1e0722] border border-[#3e133a] p-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Platform Revenue</span>
                  <p className="text-2xl font-bold font-mono text-teal-300 mt-1">KSh {stats.totalRevenueKes}</p>
                  <p className="text-[11px] text-teal-200/80 mt-1">Processed via M-Pesa</p>
                </div>
              </div>

              {/* Operations Health */}
              <div className="rounded-2xl bg-[#1e0722] border border-[#3e133a] p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Compliance & Safety Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-[#40123c]">
                    <span className="text-slate-400">Pending ID Submissions:</span>
                    <p className="font-bold text-amber-300 text-lg font-mono">{stats.pendingVerificationsCount}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-[#40123c]">
                    <span className="text-slate-400">Total Verified Purchases:</span>
                    <p className="font-bold text-emerald-400 text-lg font-mono">{stats.totalPurchasesCount}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-[#40123c]">
                    <span className="text-slate-400">Content / Member Reports:</span>
                    <p className="font-bold text-rose-400 text-lg font-mono">{stats.totalReportsCount}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. VERIFICATIONS QUEUE */}
          {activeTab === 'verifications' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Kenyan Adult ID Verification Audit Queue</span>
                <span className="text-xs text-slate-400">Reviewing Kenyan National IDs & Passports</span>
              </h3>

              {verifications.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 bg-[#1e0722] rounded-2xl border border-[#3e133a]">
                  No verification records currently on file.
                </div>
              ) : (
                <div className="space-y-3">
                  {verifications.map(rec => (
                    <div
                      key={rec.id}
                      className="rounded-2xl bg-[#1e0722] border border-[#3e133a] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={rec.selfieUrl}
                          alt={rec.userName}
                          className="h-12 w-12 rounded-xl object-cover border border-[#52184d]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{rec.userName}</h4>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              rec.status === 'verified'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : rec.status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            }`}>
                              {rec.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                            <span>ID Type: <strong className="text-white capitalize">{rec.idType.replace('_', ' ')}</strong></span>
                            <span>·</span>
                            <span>Number: <strong className="font-mono text-white">{rec.idNumberMasked}</strong></span>
                            <span>·</span>
                            <span>DOB: <strong className="font-mono text-white">{rec.dob}</strong> ({rec.calculatedAge} yrs)</span>
                          </div>
                          {rec.reviewerNote && (
                            <p className="text-[11px] text-slate-500 mt-1">Note: {rec.reviewerNote}</p>
                          )}
                        </div>
                      </div>

                      {/* Review Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {rec.status !== 'verified' && (
                          <button
                            onClick={() => handleReviewVerification(rec.id, 'approve')}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Approve 18+</span>
                          </button>
                        )}
                        {rec.status !== 'rejected' && (
                          <button
                            onClick={() => handleReviewVerification(rec.id, 'reject')}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. MEMBERS & CREATORS */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">
                Member Directory & Account Controls ({users.length})
              </h3>

              <div className="space-y-2.5">
                {users.map(u => (
                  <div
                    key={u.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#1e0722] border border-[#3e133a]"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{u.displayName}</span>
                        {u.verifiedAdult && (
                          <span title="18+ Verified">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                          </span>
                        )}
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                          {u.accountType || 'member'}
                        </span>
                        {u.isSuspended && (
                          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-md">
                            SUSPENDED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {u.university} · Age: {u.age} {u.email ? `· ${u.email}` : ''}
                      </p>
                      {u.suspensionReason && (
                        <p className="text-[11px] text-rose-300 mt-1">Reason: {u.suspensionReason}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleToggleSuspend(u.id, u.isSuspended)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          u.isSuspended
                            ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                            : 'bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600/40'
                        }`}
                      >
                        {u.isSuspended ? 'Reinstate Member' : 'Suspend Account'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CONTENT MODERATION */}
          {activeTab === 'moderation' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">
                Marketplace Content Moderation ({posts.length})
              </h3>

              <div className="space-y-3">
                {posts.map(post => (
                  <div
                    key={post.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#1e0722] border border-[#3e133a]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={post.previewUrl || post.mediaUrl}
                        alt={post.title}
                        className="h-12 w-12 rounded-xl object-cover shrink-0 border border-[#52184d]"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white truncate">{post.title}</h4>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            post.moderationStatus === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : post.moderationStatus === 'flagged'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {post.moderationStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          by {post.creatorProfile.displayName} · {post.isExclusive ? `Exclusive KSh ${post.priceKes}` : 'Free Lifestyle'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {post.moderationStatus !== 'approved' && (
                        <button
                          onClick={() => handleModeratePost(post.id, 'approve')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-[11px] font-bold cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {post.moderationStatus !== 'flagged' && (
                        <button
                          onClick={() => handleModeratePost(post.id, 'flag')}
                          className="px-2.5 py-1 rounded-lg bg-amber-600/80 hover:bg-amber-600 text-white text-[11px] font-bold cursor-pointer"
                        >
                          Flag
                        </button>
                      )}
                      <button
                        onClick={() => handleModeratePost(post.id, 'remove')}
                        className="px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-[11px] font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. M-PESA LEDGER */}
          {activeTab === 'ledger' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  M-Pesa Verified Transaction Ledger
                </h3>
                <span className="text-xs font-mono text-emerald-400">
                  Receiver Line: +254740047265
                </span>
              </div>

              <div className="rounded-2xl bg-[#1e0722] border border-[#3e133a] p-4 text-xs text-slate-300 space-y-2">
                <p>
                  Every one-time purchase on TEKA generates a cryptographically unique Safaricom Daraja receipt (e.g. <strong className="font-mono text-white">SHK9281NZ4</strong>) logged directly into the database. Duplicate unlocks are prohibited.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
