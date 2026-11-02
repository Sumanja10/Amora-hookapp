import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Home,
  Sparkles,
  Users,
  MessageCircle,
  User,
  Shield,
  ChevronDown,
  PlusCircle,
  Crown
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'explore'
  | 'meet-people'
  | 'messages'
  | 'profile'
  | 'admin'
  | 'safety'
  | 'how-it-works'
  | 'discover'
  | 'meetups'
  | 'creator';

interface NavbarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  currentUser: UserProfile;
  availableProfiles: Array<{
    id: string;
    displayName: string;
    age: number;
    university: string;
    intent: string;
    avatar?: string;
    isCreator?: boolean;
    role?: string;
    email?: string;
  }>;
  onSwitchProfile: (id: string) => void;
  onOpenSignUp: () => void;
  onOpenCreatorLogin: () => void;
  onOpenAdminModal?: () => void;
  onOpenCircles?: () => void;
  unreadCount: number;
  requestsCount: number;
  meetupsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  availableProfiles,
  onSwitchProfile,
  onOpenSignUp,
  onOpenCreatorLogin,
  onOpenAdminModal,
  onOpenCircles,
  unreadCount,
  requestsCount,
  meetupsCount
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isAdminOrCreator = currentUser.isCreator || currentUser.id === 'usr_creator_dennis' || currentUser.email === 'dennistarus10@gmail.com';
  const isHome = currentTab === 'home';

  // Normalize active tab states
  const isExploreActive = currentTab === 'explore';
  const isMeetPeopleActive = currentTab === 'meet-people' || currentTab === 'discover' || currentTab === 'meetups';
  const isMessagesActive = currentTab === 'messages';
  const isProfileActive = currentTab === 'profile';

  return (
    <>
      {/* Top Bar adhering to Top Bar Contract */}
      <header className={`sticky top-0 z-40 w-full border-b transition-colors duration-200 ${
        isHome
          ? 'border-[#260721]/80 bg-[#070208]/90 backdrop-blur-md'
          : 'border-[#e9ded1] bg-[#faf7f2]/95 backdrop-blur-md'
      }`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 text-left transition-opacity hover:opacity-90 whitespace-nowrap shrink-0 cursor-pointer group"
          >
            <img
              src="/assets/aistudio/amora_6904a15c.png"
              alt="AMORA"
              className={`h-10 w-10 rounded-xl object-contain shadow-xs border group-hover:scale-105 transition-transform ${
                isHome ? 'border-[#3d1235] bg-[#140416]' : 'border-[#e8d7c8]'
              }`}
            />
            <div className="flex flex-col">
              <span className={`font-serif text-2xl font-bold tracking-tight leading-none ${
                isHome ? 'text-white' : 'text-[#49233f]'
              }`}>
                AMORA
              </span>
              <span className="text-[10px] font-bold text-[#b64d70] tracking-wider uppercase">
                Creator & Adult Connections
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (5 Official Tabs) */}
          <nav className={`hidden md:flex items-center gap-6 text-sm font-medium ${
            isHome ? 'text-[#c29ebc]' : 'text-[#64495c]'
          }`}>
            <button
              onClick={() => setCurrentTab('home')}
              className={`cursor-pointer whitespace-nowrap shrink-0 py-1 transition-colors ${
                currentTab === 'home'
                  ? 'font-bold text-[#b64d70] border-b-2 border-[#b64d70]'
                  : isHome ? 'hover:text-white' : 'hover:text-[#49233f]'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setCurrentTab('explore')}
              className={`flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 py-1 transition-colors ${
                isExploreActive
                  ? 'font-bold text-[#b64d70] border-b-2 border-[#b64d70]'
                  : isHome ? 'hover:text-white' : 'hover:text-[#49233f]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Explore</span>
            </button>

            <button
              onClick={() => setCurrentTab('meet-people')}
              className={`flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 py-1 transition-colors ${
                isMeetPeopleActive
                  ? 'font-bold text-[#b64d70] border-b-2 border-[#b64d70]'
                  : isHome ? 'hover:text-white' : 'hover:text-[#49233f]'
              }`}
            >
              <Users className="h-3.5 w-3.5 text-[#b64d70]" />
              <span>Meet People</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" title="Live Connections" />
            </button>

            <button
              onClick={() => setCurrentTab('messages')}
              className={`relative cursor-pointer whitespace-nowrap shrink-0 py-1 transition-colors ${
                isMessagesActive
                  ? 'font-bold text-[#b64d70] border-b-2 border-[#b64d70]'
                  : isHome ? 'hover:text-white' : 'hover:text-[#49233f]'
              }`}
            >
              Messages
              {(unreadCount > 0 || requestsCount > 0) && (
                <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b64d70] px-1 text-[10px] font-bold text-white">
                  {unreadCount + requestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('profile')}
              className={`cursor-pointer whitespace-nowrap shrink-0 py-1 transition-colors ${
                isProfileActive
                  ? 'font-bold text-[#b64d70] border-b-2 border-[#b64d70]'
                  : isHome ? 'hover:text-white' : 'hover:text-[#49233f]'
              }`}
            >
              My Profile
            </button>
          </nav>

          {/* Zone 3: Profile Switcher & Actions */}
          <div className="flex items-center gap-3">
            {/* Admin Console trigger for Dennis */}
            {isAdminOrCreator ? (
              <button
                onClick={onOpenAdminModal}
                className="hidden sm:flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#d8b975] to-[#f3cf7a] px-3 py-1.5 text-xs font-bold text-[#2a1324] shadow-xs hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              >
                <Crown className="h-3.5 w-3.5 text-[#2a1324]" />
                <span>Admin Console</span>
              </button>
            ) : (
              <button
                onClick={onOpenCreatorLogin}
                className="hidden sm:block text-xs font-medium text-[#b64d70] hover:underline cursor-pointer"
              >
                Admin / Creator Login
              </button>
            )}

            {/* Account Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2.5 rounded-full border p-1 pl-2 pr-3 text-xs font-medium transition-colors cursor-pointer ${
                  isHome
                    ? 'border-[#3d1235] bg-[#140416] text-white hover:bg-[#200723]'
                    : 'border-[#ded1c2] bg-white text-[#49233f] hover:bg-[#f6eee3]'
                }`}
              >
                <div className="relative">
                  <img
                    src={currentUser.photos[0]?.url || '/images/creator_dennis_tarus_1793271699871.jpg'}
                    alt={currentUser.displayName}
                    className="h-7 w-7 rounded-full object-cover border border-[#b64d70]"
                  />
                  {currentUser.verifiedAdult && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-white font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-semibold truncate max-w-[110px] leading-tight">
                    {currentUser.displayName}
                  </span>
                  <span className="text-[10px] text-[#b64d70] uppercase font-bold">
                    {currentUser.accountType || (currentUser.isCreator ? 'Creator' : 'Member')}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#140618] border border-[#3e133a] p-2 text-white shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-[#3e133a]">
                    <p className="text-xs font-bold text-white">Switch Member Profile</p>
                    <p className="text-[11px] text-slate-400">
                      Testing multi-account creator & buyer flows
                    </p>
                  </div>

                  <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                    {availableProfiles.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSwitchProfile(p.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                          p.id === currentUser.id
                            ? 'bg-[#b64d70] text-white font-bold'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <img
                            src={p.avatar || '/images/creator_dennis_tarus_1793271699871.jpg'}
                            alt={p.displayName}
                            className="h-7 w-7 rounded-full object-cover shrink-0 border border-white/20"
                          />
                          <div className="truncate">
                            <p className="truncate font-medium">{p.displayName}</p>
                            <p className="text-[10px] text-slate-400 truncate">{p.university}</p>
                          </div>
                        </div>
                        {p.isCreator && (
                          <span className="text-[10px] text-amber-300 font-bold">👑</span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#3e133a] space-y-1">
                    <button
                      onClick={() => {
                        onOpenSignUp();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-[#b64d70] hover:bg-[#b64d70]/20 font-bold transition-colors cursor-pointer"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Register New Account</span>
                    </button>
                    
                    {isAdminOrCreator && onOpenAdminModal && (
                      <button
                        onClick={() => {
                          onOpenAdminModal();
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-amber-300 hover:bg-amber-500/20 font-bold transition-colors cursor-pointer"
                      >
                        <Crown className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (5 Main Tabs: Home, Explore, Meet People, Messages, My Profile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#120415]/95 backdrop-blur-md border-t border-[#341130] px-2 py-1.5 flex items-center justify-around shadow-2xl">
        
        {/* 1. Home */}
        <button
          onClick={() => setCurrentTab('home')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors cursor-pointer ${
            currentTab === 'home' ? 'text-[#b64d70]' : 'text-slate-400'
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </button>

        {/* 2. Explore */}
        <button
          onClick={() => setCurrentTab('explore')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors cursor-pointer ${
            isExploreActive ? 'text-[#b64d70]' : 'text-slate-400'
          }`}
        >
          <Sparkles className="h-5 w-5 text-amber-400" />
          <span>Explore</span>
        </button>

        {/* 3. Meet People */}
        <button
          onClick={() => setCurrentTab('meet-people')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors cursor-pointer relative ${
            isMeetPeopleActive ? 'text-[#b64d70]' : 'text-slate-400'
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Meet People</span>
          <span className="absolute top-1 right-2 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        {/* 4. Messages */}
        <button
          onClick={() => setCurrentTab('messages')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors cursor-pointer relative ${
            isMessagesActive ? 'text-[#b64d70]' : 'text-slate-400'
          }`}
        >
          <MessageCircle className="h-5 w-5" />
          <span>Messages</span>
          {(unreadCount > 0 || requestsCount > 0) && (
            <span className="absolute top-0 right-1 px-1 rounded-full bg-[#b64d70] text-white text-[9px] font-bold">
              {unreadCount + requestsCount}
            </span>
          )}
        </button>

        {/* 5. My Profile */}
        <button
          onClick={() => setCurrentTab('profile')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors cursor-pointer ${
            isProfileActive ? 'text-[#b64d70]' : 'text-slate-400'
          }`}
        >
          <User className="h-5 w-5" />
          <span>My Profile</span>
        </button>
      </nav>
    </>
  );
};
