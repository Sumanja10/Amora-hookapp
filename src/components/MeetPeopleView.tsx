import React, { useState } from 'react';
import { UserProfile, MeetupPlan, ConnectionRequest } from '../types';
import { DiscoveryView } from './DiscoveryView';
import { MeetupsView } from './MeetupsView';
import {
  Users,
  Calendar,
  Compass,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Heart,
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface MeetPeopleViewProps {
  currentUser: UserProfile;
  discoveryProfiles: UserProfile[];
  meetupPlans: MeetupPlan[];
  isLoadingDiscovery: boolean;
  isLoadingMeetups: boolean;
  filters: any;
  onFilterChange: (filters: any) => void;
  onSendConnectionRequest: (data: { recipientId: string; intention: string; message: string }) => Promise<void>;
  onCreateMeetupPlan: (data: {
    title: string;
    category: string;
    locationArea: string;
    timeframe: string;
    intention: string;
    description: string;
    maxCompany?: number;
  }) => Promise<void>;
  onExpressMeetupInterest: (planId: string, note?: string) => Promise<void>;
  onRespondMeetupInterest: (planId: string, requestId: string, action: 'approve' | 'decline') => Promise<void>;
  onReport: (profile: UserProfile) => void;
  onBlock: (profileId: string) => void;
  onNavigateToMessages: (matchId?: string) => void;
  onOpenMyAvailability: () => void;
  onOpenCircles?: () => void;
}

export const MeetPeopleView: React.FC<MeetPeopleViewProps> = ({
  currentUser,
  discoveryProfiles,
  meetupPlans,
  isLoadingDiscovery,
  isLoadingMeetups,
  filters,
  onFilterChange,
  onSendConnectionRequest,
  onCreateMeetupPlan,
  onExpressMeetupInterest,
  onRespondMeetupInterest,
  onReport,
  onBlock,
  onNavigateToMessages,
  onOpenMyAvailability,
  onOpenCircles
}) => {
  const [activeSection, setActiveSection] = useState<'connections' | 'plans'>('connections');

  return (
    <div className="space-y-6">
      
      {/* Adult Connection Platform Notice & Regulatory Boundary */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#200926] to-[#120415] border border-[#4a1844] p-4 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Consenting Adults 18+ · Kenya Community
                </span>
                <span className="text-xs text-slate-400">· Independent Social Encounters</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                TEKA is a private connection platform only. Members independently decide whether and how to meet. TEKA does not broker, arrange, or manage paid sexual services, nor take commissions from encounters.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {onOpenCircles && (
              <button
                onClick={onOpenCircles}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Users className="h-3.5 w-3.5 text-[#ec4899]" />
                <span>Campus Circles</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-navigation Switcher */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center p-1 bg-white rounded-2xl border border-[#e6d8cb] max-w-md mx-auto shadow-xs">
          <button
            onClick={() => setActiveSection('connections')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeSection === 'connections'
                ? 'bg-[#49233f] text-white shadow-xs'
                : 'text-[#64495c] hover:text-[#49233f]'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Live Connections ({discoveryProfiles.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('plans')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeSection === 'plans'
                ? 'bg-[#49233f] text-white shadow-xs'
                : 'text-[#64495c] hover:text-[#49233f]'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Meet-up Plans ({meetupPlans.length})</span>
          </button>
        </div>
      </div>

      {/* Main Section Content */}
      {activeSection === 'connections' ? (
        <DiscoveryView
          currentUser={currentUser}
          profiles={discoveryProfiles}
          onSendConnectionRequest={onSendConnectionRequest}
          onReport={onReport}
          onBlock={onBlock}
          onNavigateToMessages={onNavigateToMessages}
          filters={filters}
          onFilterChange={onFilterChange}
          isLoading={isLoadingDiscovery}
          onOpenMyAvailability={onOpenMyAvailability}
        />
      ) : (
        <MeetupsView
          currentUser={currentUser}
          plans={meetupPlans}
          onCreatePlan={onCreateMeetupPlan}
          onExpressInterest={onExpressMeetupInterest}
          onRespondInterest={onRespondMeetupInterest}
          onNavigateToMessages={onNavigateToMessages}
          isLoading={isLoadingMeetups}
        />
      )}

    </div>
  );
};
