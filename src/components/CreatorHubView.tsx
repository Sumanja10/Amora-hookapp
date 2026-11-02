import React, { useState, useEffect } from 'react';
import { UserProfile, CreatorDashboardStats } from '../types';
import * as api from '../api';
import {
  Crown,
  Smartphone,
  Users,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Eye,
  Sliders,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface CreatorHubViewProps {
  currentUser: UserProfile;
  onNavigateTab: (tab: 'home' | 'discover' | 'matches' | 'messages' | 'profile' | 'safety') => void;
  onSwitchProfile: (id: string) => void;
}

export const CreatorHubView: React.FC<CreatorHubViewProps> = ({
  currentUser,
  onNavigateTab,
  onSwitchProfile
}) => {
  const [stats, setStats] = useState<CreatorDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const data = await api.fetchCreatorStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load creator stats', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleDismissReport = async (reportId: string) => {
    try {
      await api.dismissReport(reportId);
      setActionMessage('Report dismissed successfully.');
      loadStats();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setActionMessage('Failed to dismiss report');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Creator Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#d4af37]/40 bg-gradient-to-r from-[#3e1b34] via-[#49233f] to-[#6a2b53] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0 flex items-center -space-x-4">
              <img
                src="/assets/aistudio/amora_6904a15c.png"
                alt="AMORA"
                className="h-16 w-16 rounded-2xl object-contain border-2 border-[#d4af37]/60 shadow-lg bg-[#200e1c] z-0"
              />
              <div className="relative z-10 shrink-0">
                <img
                  src={currentUser.photos[0]?.url || '/images/creator_dennis_tarus_1793271699871.jpg'}
                  alt={currentUser.displayName}
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-[#d4af37] shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#d4af37] text-xs shadow-xs">
                  👑
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-[#ffd700] uppercase">
                  Creator & Founder · Maseno University (Main campus)
                </span>
                <span className="text-xs text-white/70">· Computer Science · dennistarus10@gmail.com</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Dennis Tarus — Creator Console
              </h1>
              <p className="text-xs sm:text-sm text-[#e8d5e0]">
                Maseno University (Main campus) · Computer Science · M-Pesa Line: <strong className="text-[#ffd700] font-mono">+254740047265</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('discover')}
              className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Browse Discovery as Dennis</span>
            </button>
            <button
              onClick={() => onNavigateTab('profile')}
              className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Edit Creator Profile</span>
            </button>
            <button
              onClick={loadStats}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-xl bg-[#d4af37] px-3.5 py-2 text-xs font-bold text-[#3e1b34] hover:bg-[#e6c34e] transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* M-Pesa Revenue */}
        <div className="rounded-3xl border border-[#ded3c5] bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#887082]">
            <span>M-Pesa Revenue (KES)</span>
            <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-700">
              <Smartphone className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-[#2e7d32]">
              KES {stats?.totalRevenueKes?.toLocaleString() ?? 450}
            </span>
          </div>
          <p className="text-[11px] text-[#786172]">
            Target Number: <strong className="text-[#49233f] font-mono">+254740047265</strong> (Ksh 100/unlock)
          </p>
        </div>

        {/* Total Registered Students */}
        <div className="rounded-3xl border border-[#ded3c5] bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#887082]">
            <span>Total Campus Profiles</span>
            <div className="rounded-lg bg-[#faf0f4] p-1.5 text-[#b64d70]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-[#49233f]">
              {stats?.totalProfiles ?? 7}
            </span>
            <span className="text-xs font-semibold text-emerald-600">Active</span>
          </div>
          <p className="text-[11px] text-[#786172]">
            Verified adult students (UoN, JKUAT, Maseno, MMUST, etc.)
          </p>
        </div>

        {/* Mutual Connections & Matches */}
        <div className="rounded-3xl border border-[#ded3c5] bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#887082]">
            <span>Mutual Connections</span>
            <div className="rounded-lg bg-amber-50 p-1.5 text-amber-700">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-[#49233f]">
              {stats?.totalMatches ?? 2}
            </span>
            <span className="text-xs font-semibold text-[#b64d70]">
              {stats?.totalMessages ?? 4} messages
            </span>
          </div>
          <p className="text-[11px] text-[#786172]">
            High-intent mutual connections requiring KES 100 unlock
          </p>
        </div>

        {/* Safety & Incident Moderation */}
        <div className="rounded-3xl border border-[#ded3c5] bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#887082]">
            <span>Safety Moderation</span>
            <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-[#49233f]">
              {stats?.totalReports ?? 1}
            </span>
            <span className="text-xs font-semibold text-amber-600">Under Review</span>
          </div>
          <p className="text-[11px] text-[#786172]">
            Zero-tolerance charter & instant blocker logs
          </p>
        </div>

      </div>

      {/* 2-Column Split: M-Pesa Live Ledger + University Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Live M-Pesa Ledger Table (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-[#ded3c5] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-[#2e7d32]" />
                <h2 className="font-serif text-lg font-bold text-[#49233f]">
                  Live M-Pesa Payout Ledger (+254740047265)
                </h2>
              </div>
              <p className="text-xs text-[#786172]">
                Real-time transactions collected for mutual chat unlocks and date treats
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
              STK Push Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#f0e7dd] text-[10px] font-semibold text-[#887082] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Receipt / Code</th>
                  <th className="py-2.5 px-3">Student Sender</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Purpose</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f7f1ea]">
                {stats?.recentPayments && stats.recentPayments.length > 0 ? (
                  stats.recentPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#faf6f2] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#49233f]">
                        {p.mpesaReceiptNumber || p.checkoutRequestId.slice(0, 10)}
                      </td>
                      <td className="py-3 px-3 text-[#49233f] font-medium">
                        {p.senderName}
                      </td>
                      <td className="py-3 px-3 text-[#786172] font-mono">
                        {p.phoneNumber}
                      </td>
                      <td className="py-3 px-3 text-[#786172]">
                        {p.purposeLabel}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#2e7d32]">
                        KES {p.amount}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{p.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#887082]">
                      No M-Pesa transactions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-[#f0e7dd] flex items-center justify-between text-[11px] text-[#887082]">
            <span>Payments sent directly to Dennis Tarus via Safaricom Paybill/STK.</span>
            <span className="font-semibold text-[#49233f]">Recipient: +254740047265</span>
          </div>
        </div>

        {/* University Distribution & Quick Persona Switcher (1 col) */}
        <div className="space-y-6">
          
          {/* Kenyan University Network */}
          <div className="rounded-3xl border border-[#ded3c5] bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[#49233f]">
              Kenyan Campus Presence
            </h3>
            <div className="space-y-2.5">
              {[
                { name: 'University of Nairobi', campus: 'Chiromo, Law & Main', count: 2 },
                { name: 'Jomo Kenyatta (JKUAT)', campus: 'Juja Main', count: 1 },
                { name: 'Kenyatta University (KU)', campus: 'Kahawa Main', count: 1 },
                { name: 'Maseno University (Main campus)', campus: 'Equator', count: 1 },
                { name: 'Maseno University (city campus)', campus: 'Kisumu CBD', count: 1 },
                { name: "Maseno University (Odero Okang'o campus)", campus: 'Yala / Siaya', count: 1 },
                { name: 'Masinde Muliro (MMUST)', campus: 'Kakamega', count: 1 },
                { name: 'Uzima University', campus: 'Kisumu Medical', count: 1 },
                { name: 'Rongo University', campus: 'Kitere Hill', count: 1 },
                { name: 'Founder HQ', campus: 'Nairobi Westlands', count: 1 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#f5ece2] last:border-0">
                  <div>
                    <p className="font-semibold text-[#49233f]">{item.name}</p>
                    <p className="text-[10px] text-[#887082]">{item.campus}</p>
                  </div>
                  <span className="rounded-full bg-[#faf2e9] px-2 py-0.5 text-[11px] font-bold text-[#b64d70]">
                    {item.count} persona
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Reports Queue */}
          <div className="rounded-3xl border border-[#ded3c5] bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[#49233f] flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Moderation Queue</span>
              </h3>
              <span className="text-[11px] font-bold text-[#887082]">
                {stats?.recentReports?.length ?? 0} active
              </span>
            </div>

            {stats?.recentReports && stats.recentReports.length > 0 ? (
              <div className="space-y-3">
                {stats.recentReports.map(r => (
                  <div key={r.id} className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#49233f]">{r.targetName}</span>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        {r.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#786172]">{r.details}</p>
                    <div className="flex justify-end gap-2 pt-1 border-t border-amber-100">
                      <button
                        onClick={() => handleDismissReport(r.id)}
                        className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-semibold text-[#49233f] border border-[#d8c3b2] hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        Dismiss Flag
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#887082] py-2">
                No active safety violations or flags pending.
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
