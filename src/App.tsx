import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Match,
  Message,
  DashboardSummary,
  SafetyPrinciple,
  ConnectionRequest,
  MeetupPlan,
  CreatorPost
} from './types';
import * as api from './api';
import { Navbar, NavTab } from './components/Navbar';
import { HeroHome } from './components/HeroHome';
import { DiscoveryView } from './components/DiscoveryView';
import { MeetupsView } from './components/MeetupsView';
import { MatchesMessagesView } from './components/MatchesMessagesView';
import { ProfileView } from './components/ProfileView';
import { CampusCirclesModal } from './components/CampusCirclesModal';
import { VideoIntroModal } from './components/VideoIntroModal';
import { MatchCelebrationModal } from './components/MatchCelebrationModal';
import { SafetyCharterModal } from './components/SafetyCharterModal';
import { ReportModal } from './components/ReportModal';
import { SignUpModal } from './components/SignUpModal';
import { MpesaPaymentModal } from './components/MpesaPaymentModal';
import { CreatorLoginModal } from './components/CreatorLoginModal';
import { CreatorHubView } from './components/CreatorHubView';
import { HowItWorksView } from './components/HowItWorksView';
import { ExploreMarketplaceView } from './components/ExploreMarketplaceView';
import { MeetPeopleView } from './components/MeetPeopleView';
import { MpesaPurchaseModal } from './components/MpesaPurchaseModal';
import { CreatorStudioModal } from './components/CreatorStudioModal';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [availableProfiles, setAvailableProfiles] = useState<Array<{
    id: string;
    displayName: string;
    age: number;
    university: string;
    intent: string;
    avatar?: string;
    isCreator?: boolean;
    role?: string;
    email?: string;
  }>>([]);

  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  // Discovery state
  const [discoveryProfiles, setDiscoveryProfiles] = useState<UserProfile[]>([]);
  const [filters, setFilters] = useState<any>({
    intent: 'all',
    gender: 'all',
    university: 'all',
    radiusKm: 'all',
    region: 'all',
    availableOnly: false
  });
  const [isLoadingDiscovery, setIsLoadingDiscovery] = useState(false);

  // Connection Requests state ("Interested in You")
  const [connectionRequests, setConnectionRequests] = useState<{
    incoming: ConnectionRequest[];
    outgoing: ConnectionRequest[];
  }>({ incoming: [], outgoing: [] });

  // Meet-up Plans state
  const [meetupPlans, setMeetupPlans] = useState<MeetupPlan[]>([]);
  const [isLoadingMeetups, setIsLoadingMeetups] = useState(false);

  // Matches & Messages state
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeMatchId, setActiveMatchId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Modals state
  const [celebrationMatch, setCelebrationMatch] = useState<Match | null>(null);
  const [mpesaModalMatch, setMpesaModalMatch] = useState<Match | null>(null);
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [safetyGuidelines, setSafetyGuidelines] = useState<SafetyPrinciple[]>([]);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [creatorLoginModalOpen, setCreatorLoginModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<UserProfile | null>(null);
  const [circlesModalOpen, setCirclesModalOpen] = useState(false);
  const [activeVideoModalProfile, setActiveVideoModalProfile] = useState<UserProfile | null>(null);
  const [purchasingPost, setPurchasingPost] = useState<CreatorPost | null>(null);
  const [creatorStudioOpen, setCreatorStudioOpen] = useState(false);
  const [ageModalOpen, setAgeModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Initial Data Fetch
  const loadInitialData = async () => {
    try {
      const authData = await api.fetchCurrentAuth();
      setCurrentUser(authData.user);
      setAvailableProfiles(authData.availableProfiles);

      const [sum, matchData, reqs, meetups, safety] = await Promise.all([
        api.fetchDashboardSummary(),
        api.fetchMatches(),
        api.fetchConnectionRequests(),
        api.fetchMeetupPlans(),
        api.fetchSafetyGuidelines()
      ]);

      setSummary(sum);
      setMatches(matchData);
      setConnectionRequests(reqs);
      setMeetupPlans(meetups);
      setSafetyGuidelines(safety.principles);

      if (matchData.length > 0 && !activeMatchId) {
        setActiveMatchId(matchData[0].id);
      }
    } catch (err) {
      console.error('Failed to load initial data', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Fetch Discovery Profiles whenever filters or tab changes to discover
  const loadDiscovery = async () => {
    setIsLoadingDiscovery(true);
    try {
      const data = await api.fetchDiscoveryProfiles(filters);
      setDiscoveryProfiles(data);
    } catch (err) {
      console.error('Failed to load discovery profiles', err);
    } finally {
      setIsLoadingDiscovery(false);
    }
  };

  useEffect(() => {
    if (currentTab === 'discover' || currentTab === 'meet-people') {
      loadDiscovery();
    }
  }, [currentTab, filters]);

  // Fetch Meetups when tab is meetups or meet-people
  const loadMeetups = async () => {
    setIsLoadingMeetups(true);
    try {
      const data = await api.fetchMeetupPlans();
      setMeetupPlans(data);
    } catch (err) {
      console.error('Failed to load meetups', err);
    } finally {
      setIsLoadingMeetups(false);
    }
  };

  useEffect(() => {
    if (currentTab === 'meetups' || currentTab === 'meet-people') {
      loadMeetups();
    }
  }, [currentTab]);

  // Load Messages when activeMatchId changes
  useEffect(() => {
    if (!activeMatchId) return;

    let isSubscribed = true;
    const fetchChat = async () => {
      setIsLoadingMessages(true);
      try {
        const msgs = await api.fetchMessages(activeMatchId);
        if (isSubscribed) {
          setMessages(msgs);
          await api.markMessagesRead(activeMatchId);
          api.fetchDashboardSummary().then(setSummary);
        }
      } catch (err) {
        console.error('Failed to load messages', err);
      } finally {
        if (isSubscribed) setIsLoadingMessages(false);
      }
    };

    fetchChat();

    const interval = setInterval(async () => {
      try {
        const msgs = await api.fetchMessages(activeMatchId);
        if (isSubscribed) setMessages(msgs);
      } catch {}
    }, 3000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [activeMatchId]);

  // Handlers
  const handleSwitchProfile = async (id: string) => {
    try {
      const res = await api.switchAuthProfile(id);
      setCurrentUser(res.user);

      const [sum, matchData, reqs, meetups] = await Promise.all([
        api.fetchDashboardSummary(),
        api.fetchMatches(),
        api.fetchConnectionRequests(),
        api.fetchMeetupPlans()
      ]);

      setSummary(sum);
      setMatches(matchData);
      setConnectionRequests(reqs);
      setMeetupPlans(meetups);
      if (matchData.length > 0) setActiveMatchId(matchData[0].id);

      loadDiscovery();
    } catch (err) {
      console.error('Switch error', err);
    }
  };

  const handleCreatorLogin = async (email: string) => {
    try {
      const res = await api.loginAsCreator(email);
      setCurrentUser(res.user);

      const [sum, matchData, reqs, meetups] = await Promise.all([
        api.fetchDashboardSummary(),
        api.fetchMatches(),
        api.fetchConnectionRequests(),
        api.fetchMeetupPlans()
      ]);

      setSummary(sum);
      setMatches(matchData);
      setConnectionRequests(reqs);
      setMeetupPlans(meetups);
      if (matchData.length > 0) setActiveMatchId(matchData[0].id);

      setCurrentTab('creator');
      loadDiscovery();
    } catch (err) {
      console.error('Creator login error', err);
      throw err;
    }
  };

  // Connection Requests Handlers
  const handleSendConnectionRequest = async (data: { recipientId: string; intention: string; message: string }) => {
    try {
      const res = await api.sendConnectionRequest(data);
      const [reqs, sum] = await Promise.all([
        api.fetchConnectionRequests(),
        api.fetchDashboardSummary()
      ]);
      setConnectionRequests(reqs);
      setSummary(sum);
      loadDiscovery();
    } catch (err) {
      console.error('Send request error', err);
      throw err;
    }
  };

  const handleRespondConnectionRequest = async (requestId: string, action: 'accept' | 'decline') => {
    try {
      const res = await api.respondConnectionRequest(requestId, action);
      const [reqs, matchData, sum] = await Promise.all([
        api.fetchConnectionRequests(),
        api.fetchMatches(),
        api.fetchDashboardSummary()
      ]);
      setConnectionRequests(reqs);
      setMatches(matchData);
      setSummary(sum);

      if (action === 'accept' && res.match) {
        setCelebrationMatch(res.match);
        setActiveMatchId(res.match.id);
      }
    } catch (err) {
      console.error('Respond request error', err);
    }
  };

  // Meet-up Plans Handlers
  const handleCreateMeetupPlan = async (data: {
    title: string;
    category: string;
    locationArea: string;
    timeframe: string;
    intention: string;
    description: string;
    maxCompany?: number;
  }) => {
    try {
      await api.createMeetupPlan(data);
      loadMeetups();
      const sum = await api.fetchDashboardSummary();
      setSummary(sum);
    } catch (err) {
      console.error('Create plan error', err);
      throw err;
    }
  };

  const handleExpressMeetupInterest = async (planId: string, note?: string) => {
    try {
      await api.expressMeetupInterest(planId, note);
      loadMeetups();
    } catch (err) {
      console.error('Express interest error', err);
    }
  };

  const handleRespondMeetupInterest = async (planId: string, requestId: string, action: 'approve' | 'decline') => {
    try {
      const res = await api.respondMeetupInterest(planId, requestId, action);
      loadMeetups();
      const matchData = await api.fetchMatches();
      setMatches(matchData);
      if (action === 'approve' && res.match) {
        setActiveMatchId(res.match.id);
        setCurrentTab('messages');
      }
    } catch (err) {
      console.error('Respond meetup interest error', err);
    }
  };

  const handleBlock = async (targetId: string) => {
    try {
      await api.blockProfile(targetId);
      loadDiscovery();
      const updatedMatches = await api.fetchMatches();
      setMatches(updatedMatches);
      if (activeMatchId === targetId) {
        setActiveMatchId(updatedMatches[0]?.id);
      }
    } catch (err) {
      console.error('Block error', err);
    }
  };

  const handleReport = async (targetId: string, category: string, details: string) => {
    try {
      await api.reportProfile(targetId, category, details);
      loadDiscovery();
      const updatedMatches = await api.fetchMatches();
      setMatches(updatedMatches);
    } catch (err) {
      console.error('Report error', err);
    }
  };

  const handleSendMessage = async (matchId: string, text: string) => {
    try {
      const newMsg = await api.sendMessage(matchId, text);
      setMessages(prev => [...prev, newMsg]);

      setMatches(prev => prev.map(m => {
        if (m.id === matchId) {
          return {
            ...m,
            lastMessage: text,
            lastMessageAt: newMsg.createdAt
          };
        }
        return m;
      }));
    } catch (err) {
      console.error('Send message error', err);
    }
  };

  const handleDeleteConversation = async (matchId: string) => {
    try {
      await api.deleteConversation(matchId);
      const updated = await api.fetchMatches();
      setMatches(updated);
      if (activeMatchId === matchId) {
        setActiveMatchId(updated[0]?.id);
        setMessages([]);
      }
    } catch (err) {
      console.error('Delete conversation error', err);
    }
  };

  const handleSaveProfile = async (updates: Partial<UserProfile>) => {
    try {
      const res = await api.updateMyProfile(updates);
      setCurrentUser(res.profile);
      const sum = await api.fetchDashboardSummary();
      setSummary(sum);
    } catch (err) {
      console.error('Save profile error', err);
      throw err;
    }
  };

  const handleAddPhoto = async (url: string, visibility: 'public' | 'matched-only', caption?: string) => {
    try {
      await api.addProfilePhoto(url, visibility, caption);
      const updated = await api.fetchMyProfile();
      setCurrentUser(updated);
    } catch (err) {
      console.error('Add photo error', err);
    }
  };

  const handleTogglePhotoVisibility = async (photoId: string, currentVisibility: 'public' | 'matched-only') => {
    try {
      const nextVisibility = currentVisibility === 'public' ? 'matched-only' : 'public';
      await api.updatePhotoVisibility(photoId, nextVisibility);
      const updated = await api.fetchMyProfile();
      setCurrentUser(updated);
    } catch (err) {
      console.error('Toggle photo error', err);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      await api.deleteProfilePhoto(photoId);
      const updated = await api.fetchMyProfile();
      setCurrentUser(updated);
    } catch (err) {
      console.error('Delete photo error', err);
      throw err;
    }
  };

  const handleSignUp = async (data: Partial<UserProfile>) => {
    try {
      const res = await api.signUpUser(data);
      setCurrentUser(res.user);
      await loadInitialData();
      setCurrentTab('discover');
    } catch (err) {
      console.error('Signup error', err);
      throw err;
    }
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
        <div className="flex flex-col items-center space-y-3">
          <img src="/logo.svg" alt="TEKA" className="h-12 w-12 animate-pulse" />
          <p className="font-serif text-xl font-bold tracking-wider text-[#49233f]">TEKA</p>
          <p className="text-xs text-[#8a7283]">Your vibe. Your people. Your choice.</p>
        </div>
      </div>
    );
  }

  const incomingPendingCount = connectionRequests.incoming.filter(r => r.status === 'pending').length;

  return (
    <div className={`min-h-screen font-sans flex flex-col selection:bg-[#db2777] selection:text-white transition-colors duration-200 ${
      currentTab === 'home' ? 'bg-[#070208] text-white' : 'bg-[#faf7f2] text-[#381f33]'
    }`}>
      
      {/* Top Bar adhering to Top Bar Contract */}
      {/* Top Bar adhering to Top Bar Contract */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        availableProfiles={availableProfiles}
        onSwitchProfile={handleSwitchProfile}
        onOpenSignUp={() => setSignUpModalOpen(true)}
        onOpenCreatorLogin={() => setCreatorLoginModalOpen(true)}
        onOpenAdminModal={() => setAdminModalOpen(true)}
        onOpenCircles={() => setCirclesModalOpen(true)}
        unreadCount={summary?.unreadMessagesCount || 0}
        requestsCount={incomingPendingCount}
        meetupsCount={meetupPlans.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">
        {currentTab === 'home' && (
          <HeroHome
            onExploreMarketplace={() => setCurrentTab('explore')}
            onMeetPeople={() => setCurrentTab('meet-people')}
            onOpenLogin={() => setCreatorLoginModalOpen(true)}
            onOpenHowItWorks={() => setCurrentTab('how-it-works')}
            onOpenSafety={() => setSafetyModalOpen(true)}
          />
        )}

        {/* 1. Creator Content Marketplace View */}
        {currentTab === 'explore' && (
          <ExploreMarketplaceView
            currentUser={currentUser}
            onOpenMpesaPurchase={post => setPurchasingPost(post)}
            onOpenCreatorStudio={() => setCreatorStudioOpen(true)}
          />
        )}

        {/* 2. Meet People — Adult Connections View */}
        {currentTab === 'meet-people' && (
          <MeetPeopleView
            currentUser={currentUser}
            discoveryProfiles={discoveryProfiles}
            meetupPlans={meetupPlans}
            isLoadingDiscovery={isLoadingDiscovery}
            isLoadingMeetups={isLoadingMeetups}
            filters={filters}
            onFilterChange={setFilters}
            onSendConnectionRequest={handleSendConnectionRequest}
            onCreateMeetupPlan={handleCreateMeetupPlan}
            onExpressMeetupInterest={handleExpressMeetupInterest}
            onRespondMeetupInterest={handleRespondMeetupInterest}
            onReport={p => setReportTarget(p)}
            onBlock={id => handleBlock(id)}
            onNavigateToMessages={matchId => {
              if (matchId) setActiveMatchId(matchId);
              setCurrentTab('messages');
            }}
            onOpenMyAvailability={() => setCurrentTab('profile')}
            onOpenCircles={() => setCirclesModalOpen(true)}
          />
        )}

        {/* Fallback routes for direct discovery and meetups tabs */}
        {currentTab === 'discover' && (
          <DiscoveryView
            currentUser={currentUser}
            profiles={discoveryProfiles}
            onSendConnectionRequest={handleSendConnectionRequest}
            onReport={p => setReportTarget(p)}
            onBlock={id => handleBlock(id)}
            onNavigateToMessages={matchId => {
              if (matchId) setActiveMatchId(matchId);
              setCurrentTab('messages');
            }}
            filters={filters}
            onFilterChange={setFilters}
            isLoading={isLoadingDiscovery}
            onOpenMyAvailability={() => setCurrentTab('profile')}
          />
        )}

        {currentTab === 'meetups' && (
          <MeetupsView
            currentUser={currentUser}
            plans={meetupPlans}
            onCreatePlan={handleCreateMeetupPlan}
            onExpressInterest={handleExpressMeetupInterest}
            onRespondInterest={handleRespondMeetupInterest}
            onNavigateToMessages={matchId => {
              if (matchId) setActiveMatchId(matchId);
              setCurrentTab('messages');
            }}
            isLoading={isLoadingMeetups}
          />
        )}

        {currentTab === 'how-it-works' && (
          <HowItWorksView
            onStartDiscovery={() => setCurrentTab('meet-people')}
            onOpenSafetyCharter={() => setSafetyModalOpen(true)}
            currentUser={currentUser}
          />
        )}

        {/* 3. Messages & Interested in You View */}
        {currentTab === 'messages' && (
          <MatchesMessagesView
            matches={matches}
            currentUser={currentUser}
            activeMatchId={activeMatchId}
            onSelectMatch={id => {
              setActiveMatchId(id);
            }}
            onSendMessage={handleSendMessage}
            messages={messages}
            isLoadingMessages={isLoadingMessages}
            onBlockMatch={handleBlock}
            onReportMatch={p => setReportTarget(p)}
            onOpenMpesaModal={match => setMpesaModalMatch(match)}
            onDeleteConversation={handleDeleteConversation}
            incomingRequests={connectionRequests.incoming}
            outgoingRequests={connectionRequests.outgoing}
            onRespondRequest={handleRespondConnectionRequest}
            onWatchVideoIntro={profile => setActiveVideoModalProfile(profile)}
          />
        )}

        {/* 4. Combined Profile View */}
        {currentTab === 'profile' && (
          <ProfileView
            profile={currentUser}
            onSaveProfile={handleSaveProfile}
            onAddPhoto={handleAddPhoto}
            onTogglePhotoVisibility={handleTogglePhotoVisibility}
            onDeletePhoto={handleDeletePhoto}
            onAvailabilityUpdated={updated => setCurrentUser(updated)}
            onAccountDeleted={() => loadInitialData()}
            onOpenAgeVerification={() => setAgeModalOpen(true)}
            onOpenCreatorStudio={() => setCreatorStudioOpen(true)}
            onNavigateToExplore={() => setCurrentTab('explore')}
          />
        )}

        {currentTab === 'safety' && (
          <div className="mx-auto max-w-4xl px-4 py-8">
            <SafetyCharterModal
              onClose={() => setCurrentTab('home')}
              guidelines={safetyGuidelines}
            />
          </div>
        )}

        {currentTab === 'creator' && currentUser && (
          <CreatorHubView
            currentUser={currentUser}
            onNavigateTab={setCurrentTab as any}
            onSwitchProfile={handleSwitchProfile}
          />
        )}
      </main>

      {/* Video Intro Modal Preview */}
      {activeVideoModalProfile && activeVideoModalProfile.videoIntro && (
        <VideoIntroModal
          profile={activeVideoModalProfile}
          video={activeVideoModalProfile.videoIntro}
          onClose={() => setActiveVideoModalProfile(null)}
          onConnect={p => {
            setActiveVideoModalProfile(null);
            handleSendConnectionRequest({
              recipientId: p.id,
              intention: (p.intentions && p.intentions[0]) || 'Casual meetups',
              message: ''
            });
          }}
        />
      )}

      {/* Campus Circles Modal */}
      {circlesModalOpen && (
        <CampusCirclesModal
          currentUser={currentUser}
          onClose={() => setCirclesModalOpen(false)}
        />
      )}

      {/* Celebration Modal when mutual match occurs */}
      {celebrationMatch && (
        <MatchCelebrationModal
          currentUser={currentUser}
          match={celebrationMatch}
          onClose={() => setCelebrationMatch(null)}
          onOpenChat={matchId => {
            setActiveMatchId(matchId);
            setCurrentTab('messages');
          }}
          onInitiateMpesa={match => setMpesaModalMatch(match)}
        />
      )}

      {/* One-time M-Pesa Exclusive Content Purchase Modal */}
      {purchasingPost && (
        <MpesaPurchaseModal
          post={purchasingPost}
          onClose={() => setPurchasingPost(null)}
          onPurchaseSuccess={async () => {
            const sum = await api.fetchDashboardSummary();
            setSummary(sum);
          }}
        />
      )}

      {/* Creator Content Studio Modal */}
      <CreatorStudioModal
        currentUser={currentUser}
        isOpen={creatorStudioOpen}
        onClose={() => setCreatorStudioOpen(false)}
        onPostPublished={() => {}}
      />

      {/* 18+ Age & Identity Verification Modal */}
      <AgeVerificationModal
        currentUser={currentUser}
        isOpen={ageModalOpen}
        onClose={() => setAgeModalOpen(false)}
        onVerificationComplete={updatedUser => {
          setCurrentUser(updatedUser);
        }}
      />

      {/* Administrator & Founder Dashboard Modal for Dennis Tarus */}
      <AdminDashboardModal
        currentUser={currentUser}
        isOpen={adminModalOpen || currentTab === 'admin'}
        onClose={() => {
          setAdminModalOpen(false);
          if (currentTab === 'admin') setCurrentTab('home');
        }}
      />

      {/* Lipa Na M-Pesa Date Treat Modal */}
      {mpesaModalMatch && currentUser && (
        <MpesaPaymentModal
          match={mpesaModalMatch}
          currentUser={currentUser}
          onClose={() => setMpesaModalMatch(null)}
          onPaymentSuccess={async () => {
            const updated = await api.fetchMatches();
            setMatches(updated);
            if (activeMatchId) {
              const msgs = await api.fetchMessages(activeMatchId);
              setMessages(msgs);
            }
          }}
        />
      )}

      {/* Safety Charter Popup Modal */}
      {safetyModalOpen && (
        <SafetyCharterModal
          onClose={() => setSafetyModalOpen(false)}
          guidelines={safetyGuidelines}
        />
      )}

      {/* Anonymous Report Modal */}
      {reportTarget && (
        <ReportModal
          targetProfile={reportTarget}
          onClose={() => setReportTarget(null)}
          onSubmitReport={handleReport}
        />
      )}

      {/* New Adult Registration Modal */}
      {signUpModalOpen && (
        <SignUpModal
          onClose={() => setSignUpModalOpen(false)}
          onSignUp={handleSignUp}
        />
      )}

      {/* Creator Login Modal for Dennis Tarus */}
      {creatorLoginModalOpen && (
        <CreatorLoginModal
          onClose={() => setCreatorLoginModalOpen(false)}
          onLoginSuccess={() => setCurrentTab('creator')}
          onCreatorLogin={handleCreatorLogin}
        />
      )}

    </div>
  );
}
