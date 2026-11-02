import {
  UserProfile,
  Match,
  Message,
  DashboardSummary,
  SafetyPrinciple,
  CreatorDashboardStats,
  CampusNode,
  ConnectionRequest,
  MeetupPlan,
  CampusCircle,
  VideoMedia,
  CreatorPost,
  ContentPurchase,
  AgeVerificationRecord,
  AdminPlatformStats,
  AccountType,
  PrivacySettings
} from './types';

const API_BASE = '/api';

export async function fetchCurrentAuth(): Promise<{
  user: UserProfile;
  availableProfiles: Array<{
    id: string;
    displayName: string;
    age: number;
    university: string;
    intent: string;
    avatar?: string;
  }>;
}> {
  const res = await fetch(`${API_BASE}/auth/current`);
  if (!res.ok) throw new Error('Failed to load current user');
  return res.json();
}

export async function switchAuthProfile(profileId: string): Promise<{ success: boolean; user: UserProfile }> {
  const res = await fetch(`${API_BASE}/auth/switch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileId })
  });
  if (!res.ok) throw new Error('Failed to switch profile');
  return res.json();
}

export async function signUpUser(data: Partial<UserProfile> & { photoUrl?: string }): Promise<{ success: boolean; user: UserProfile }> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Sign up failed' }));
    throw new Error(err.error || 'Sign up failed');
  }
  return res.json();
}

export async function fetchMyProfile(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/me/profile`);
  if (!res.ok) throw new Error('Failed to load profile');
  return res.json();
}

export async function updateMyProfile(data: Partial<UserProfile>): Promise<{ success: boolean; profile: UserProfile }> {
  const res = await fetch(`${API_BASE}/me/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Update failed' }));
    throw new Error(err.error || 'Update failed');
  }
  return res.json();
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE}/dashboard/summary`);
  if (!res.ok) throw new Error('Failed to load dashboard summary');
  return res.json();
}

export async function fetchRadarNodes(): Promise<{
  userLocation: { university: string; subCampus: string; faculty: string; region: string };
  nodes: CampusNode[];
}> {
  const res = await fetch(`${API_BASE}/radar/nodes`);
  if (!res.ok) throw new Error('Failed to fetch radar nodes');
  return res.json();
}

export async function fetchDiscoveryProfiles(filters: {
  intent?: string;
  gender?: string;
  university?: string;
  radiusKm?: number | string;
  region?: string;
  campusBoundary?: string;
  availableOnly?: boolean;
}): Promise<UserProfile[]> {
  const params = new URLSearchParams();
  if (filters.intent && filters.intent !== 'all') params.append('intent', filters.intent);
  if (filters.gender && filters.gender !== 'all') params.append('gender', filters.gender);
  if (filters.university && filters.university !== 'all') params.append('university', filters.university);
  if (filters.radiusKm && filters.radiusKm !== 'all' && Number(filters.radiusKm) > 0) params.append('radiusKm', String(filters.radiusKm));
  if (filters.region && filters.region !== 'all') params.append('region', filters.region);
  if (filters.availableOnly) params.append('availableOnly', 'true');

  const res = await fetch(`${API_BASE}/discovery/profiles?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch discovery profiles');
  return res.json();
}

// -------------------------------------------------------------
// Live Availability System
// -------------------------------------------------------------
export async function updateAvailability(data: {
  isAvailable: boolean;
  durationMinutes?: number;
  note?: string;
}): Promise<{ success: boolean; profile: UserProfile }> {
  const res = await fetch(`${API_BASE}/me/availability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update availability' }));
    throw new Error(err.error || 'Failed to update availability');
  }
  return res.json();
}

// -------------------------------------------------------------
// Connection Requests (Interested in You)
// -------------------------------------------------------------
export async function fetchConnectionRequests(): Promise<{
  incoming: ConnectionRequest[];
  outgoing: ConnectionRequest[];
}> {
  const res = await fetch(`${API_BASE}/connections/requests`);
  if (!res.ok) throw new Error('Failed to fetch connection requests');
  return res.json();
}

export async function sendConnectionRequest(data: {
  recipientId: string;
  intention?: string;
  message?: string;
}): Promise<{ success: boolean; request: ConnectionRequest; message: string }> {
  const res = await fetch(`${API_BASE}/connections/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to send request' }));
    throw new Error(err.error || 'Failed to send connection request');
  }
  return res.json();
}

export async function respondConnectionRequest(
  requestId: string,
  action: 'accept' | 'decline'
): Promise<{ success: boolean; match?: Match; message: string }> {
  const res = await fetch(`${API_BASE}/connections/requests/${requestId}/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to respond to request' }));
    throw new Error(err.error || 'Failed to respond to connection request');
  }
  return res.json();
}

// -------------------------------------------------------------
// Meet-up Plans (Coffee, Lunch, Movies, Outings, etc.)
// -------------------------------------------------------------
export async function fetchMeetupPlans(category?: string): Promise<MeetupPlan[]> {
  const url = category && category !== 'all' ? `${API_BASE}/meetups?category=${category}` : `${API_BASE}/meetups`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load meetup plans');
  return res.json();
}

export async function createMeetupPlan(data: {
  title: string;
  category: string;
  locationArea: string;
  timeframe: string;
  intention: string;
  description: string;
  maxCompany?: number;
}): Promise<{ success: boolean; plan: MeetupPlan }> {
  const res = await fetch(`${API_BASE}/meetups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create plan' }));
    throw new Error(err.error || 'Failed to post meet-up plan');
  }
  return res.json();
}

export async function expressMeetupInterest(planId: string, note?: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/meetups/${planId}/interest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to express interest' }));
    throw new Error(err.error || 'Failed to join meetup plan');
  }
  return res.json();
}

export async function respondMeetupInterest(
  planId: string,
  requestId: string,
  action: 'approve' | 'decline'
): Promise<{ success: boolean; match?: Match; message: string }> {
  const res = await fetch(`${API_BASE}/meetups/${planId}/requests/${requestId}/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to respond' }));
    throw new Error(err.error || 'Failed to respond to meetup request');
  }
  return res.json();
}

// -------------------------------------------------------------
// Campus Circles
// -------------------------------------------------------------
export async function fetchCampusCircles(): Promise<CampusCircle[]> {
  const res = await fetch(`${API_BASE}/circles`);
  if (!res.ok) throw new Error('Failed to fetch campus circles');
  return res.json();
}

export async function toggleJoinCircle(circleId: string, action: 'join' | 'leave'): Promise<{ success: boolean; circle: CampusCircle }> {
  const res = await fetch(`${API_BASE}/circles/${circleId}/${action}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error(`Failed to ${action} circle`);
  return res.json();
}

export async function postCircleUpdate(circleId: string, content: string): Promise<{ success: boolean; post: any }> {
  const res = await fetch(`${API_BASE}/circles/${circleId}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  if (!res.ok) throw new Error('Failed to post update');
  return res.json();
}

export async function likeCirclePost(circleId: string, postId: string): Promise<{ success: boolean; likesCount: number }> {
  const res = await fetch(`${API_BASE}/circles/${circleId}/posts/${postId}/like`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to like post');
  return res.json();
}

// -------------------------------------------------------------
// Profile Media & Video Intro
// -------------------------------------------------------------
export async function updateVideoIntro(videoData: VideoMedia | null): Promise<{ success: boolean; videoIntro?: VideoMedia }> {
  const res = await fetch(`${API_BASE}/me/video-intro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoIntro: videoData })
  });
  if (!res.ok) throw new Error('Failed to update video intro');
  return res.json();
}

export async function deleteAccount(): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/me/delete-account`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to delete account');
  return res.json();
}

// -------------------------------------------------------------
// Matches, Messaging & Safety
// -------------------------------------------------------------
export async function likeProfile(targetId: string, type: 'like' | 'superlike' = 'like'): Promise<{ isMatch: boolean; match?: Match }> {
  const res = await fetch(`${API_BASE}/profiles/${targetId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type })
  });
  if (!res.ok) throw new Error('Failed to like profile');
  return res.json();
}

export async function passProfile(targetId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/profiles/${targetId}/pass`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to pass profile');
  return res.json();
}

export async function blockProfile(targetId: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/profiles/${targetId}/block`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to block profile');
  return res.json();
}

export async function reportProfile(targetId: string, category: string, details: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/profiles/${targetId}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, details })
  });
  if (!res.ok) throw new Error('Failed to report profile');
  return res.json();
}

export async function fetchMatches(): Promise<Match[]> {
  const res = await fetch(`${API_BASE}/matches`);
  if (!res.ok) throw new Error('Failed to fetch matches');
  return res.json();
}

export async function fetchMessages(matchId: string): Promise<Message[]> {
  const res = await fetch(`${API_BASE}/matches/${matchId}/messages`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function sendMessage(matchId: string, text: string): Promise<Message> {
  const res = await fetch(`${API_BASE}/matches/${matchId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

export async function markMessagesRead(matchId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/matches/${matchId}/read`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to mark read');
  return res.json();
}

export async function addProfilePhoto(url: string, visibility: 'public' | 'matched-only' = 'public', caption = ''): Promise<void> {
  const res = await fetch(`${API_BASE}/me/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, visibility, caption })
  });
  if (!res.ok) throw new Error('Failed to add photo');
}

export async function updatePhotoVisibility(photoId: string, visibility: 'public' | 'matched-only'): Promise<void> {
  const res = await fetch(`${API_BASE}/me/photos/${photoId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visibility })
  });
  if (!res.ok) throw new Error('Failed to update photo');
}

export async function deleteProfilePhoto(photoId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/me/photos/${photoId}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Cannot delete photo' }));
    throw new Error(err.error || 'Failed to delete photo');
  }
}

export async function fetchSafetyGuidelines(): Promise<{ title: string; principles: SafetyPrinciple[] }> {
  const res = await fetch(`${API_BASE}/safety/guidelines`);
  if (!res.ok) throw new Error('Failed to fetch safety guidelines');
  return res.json();
}

export async function initiateMpesaPayment(data: {
  matchId: string;
  phoneNumber: string;
  amount?: number;
  purpose?: 'connection_pass' | 'coffee_treat' | 'drinks_date';
}): Promise<{
  success: boolean;
  checkoutRequestId: string;
  merchantRequestId: string;
  phoneNumber: string;
  amount: number;
  purposeLabel: string;
  message: string;
}> {
  const res = await fetch(`${API_BASE}/payments/mpesa/initiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Payment initiation failed' }));
    throw new Error(err.error || 'Payment initiation failed');
  }
  return res.json();
}

export async function fetchMpesaStatus(checkoutRequestId: string): Promise<{
  status: 'pending' | 'completed' | 'failed';
  payment?: any;
  receiptNumber?: string;
}> {
  const res = await fetch(`${API_BASE}/payments/mpesa/status/${checkoutRequestId}`);
  if (!res.ok) throw new Error('Failed to check M-Pesa status');
  return res.json();
}

export async function fetchMatchPayments(matchId: string): Promise<any[]> {
  const res = await fetch(`${API_BASE}/matches/${matchId}/payments`);
  if (!res.ok) throw new Error('Failed to fetch match payments');
  return res.json();
}

export async function unlockChatWithMpesa(matchId: string, data?: { mpesaCode?: string; phoneNumber?: string }): Promise<{
  success: boolean;
  chatUnlocked: boolean;
  receiptNumber: string;
  recipientNumber: string;
  amount: number;
  message: string;
}> {
  const res = await fetch(`${API_BASE}/matches/${matchId}/unlock-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data || {})
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to unlock chat' }));
    throw new Error(err.error || 'Failed to unlock chat');
  }
  return res.json();
}

export async function loginAsCreator(email = 'dennistarus10@gmail.com'): Promise<{ success: boolean; user: UserProfile; message: string }> {
  const res = await fetch(`${API_BASE}/auth/creator-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Creator login failed' }));
    throw new Error(err.error || 'Creator login failed');
  }
  return res.json();
}

export async function fetchCreatorStats(): Promise<CreatorDashboardStats> {
  const res = await fetch(`${API_BASE}/creator/stats`);
  if (!res.ok) throw new Error('Failed to load creator statistics');
  return res.json();
}

export async function dismissReport(reportId: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/creator/dismiss-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reportId })
  });
  if (!res.ok) throw new Error('Failed to dismiss report');
  return res.json();
}

// Conversation Deletion
export async function deleteConversation(matchId: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/messages/conversation/${matchId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete conversation');
  return res.json();
}

// Creator Marketplace
export async function fetchMarketplacePosts(filter?: 'all' | 'exclusive' | 'free', creatorId?: string): Promise<CreatorPost[]> {
  const params = new URLSearchParams();
  if (filter && filter !== 'all') params.set('filter', filter);
  if (creatorId) params.set('creatorId', creatorId);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE}/marketplace/posts${query}`);
  if (!res.ok) throw new Error('Failed to load marketplace posts');
  return res.json();
}

export async function publishCreatorPost(data: {
  title: string;
  description?: string;
  type: 'photo' | 'video';
  mediaUrl: string;
  previewUrl?: string;
  isExclusive: boolean;
  priceKes?: number;
  tags?: string[];
  consentConfirmed: boolean;
}): Promise<CreatorPost> {
  const res = await fetch(`${API_BASE}/marketplace/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to publish post' }));
    throw new Error(err.error || 'Failed to publish post');
  }
  return res.json();
}

export async function purchaseContentItem(postId: string, phoneNumber?: string): Promise<{
  success: boolean;
  unlocked: boolean;
  receiptNumber: string;
  amountKes: number;
  purchase: ContentPurchase;
  postDetails: CreatorPost;
  message: string;
}> {
  const res = await fetch(`${API_BASE}/marketplace/posts/${postId}/purchase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to complete purchase' }));
    throw new Error(err.error || 'Failed to complete purchase');
  }
  return res.json();
}

export async function fetchMyPurchases(): Promise<ContentPurchase[]> {
  const res = await fetch(`${API_BASE}/marketplace/my-purchases`);
  if (!res.ok) throw new Error('Failed to load purchases');
  return res.json();
}

export async function fetchCreatorPerformance(): Promise<{
  postsCount: number;
  totalViews: number;
  totalSales: number;
  totalRevenueKes: number;
  withdrawableKes: number;
  recentSales: ContentPurchase[];
  myPosts: CreatorPost[];
}> {
  const res = await fetch(`${API_BASE}/marketplace/creator-stats`);
  if (!res.ok) throw new Error('Failed to load creator performance');
  return res.json();
}

export async function deleteCreatorPost(postId: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/marketplace/posts/${postId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete creator post');
  return res.json();
}

// Combined Profile Preferences
export async function updateAccountType(accountType: AccountType): Promise<{ success: boolean; user: UserProfile }> {
  const res = await fetch(`${API_BASE}/profile/update-account-type`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountType })
  });
  if (!res.ok) throw new Error('Failed to update account preferences');
  return res.json();
}

export async function updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<{ success: boolean; privacySettings: PrivacySettings }> {
  const res = await fetch(`${API_BASE}/profile/privacy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  if (!res.ok) throw new Error('Failed to update privacy settings');
  return res.json();
}

// Age Verification
export async function submitAgeVerification(data: {
  idType: 'national_id' | 'passport' | 'military_id' | 'driving_license';
  idNumber: string;
  dob: string;
  selfieUrl?: string;
  documentFrontUrl?: string;
  autoVerifyTestMode?: boolean;
}): Promise<{ success: boolean; verification: AgeVerificationRecord; message: string }> {
  const res = await fetch(`${API_BASE}/verification/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Verification submission failed' }));
    throw new Error(err.error || 'Verification submission failed');
  }
  return res.json();
}

export async function fetchVerificationStatus(): Promise<{
  verifiedAdult: boolean;
  ageVerificationStatus: string;
  record?: AgeVerificationRecord;
}> {
  const res = await fetch(`${API_BASE}/verification/status`);
  if (!res.ok) throw new Error('Failed to check verification status');
  return res.json();
}

// Admin Functions
export async function fetchAdminStats(): Promise<AdminPlatformStats> {
  const res = await fetch(`${API_BASE}/admin/stats`);
  if (!res.ok) throw new Error('Failed to load admin stats');
  return res.json();
}

export async function fetchAdminVerifications(): Promise<AgeVerificationRecord[]> {
  const res = await fetch(`${API_BASE}/admin/verifications`);
  if (!res.ok) throw new Error('Failed to load admin verifications');
  return res.json();
}

export async function reviewAdminVerification(id: string, action: 'approve' | 'reject', note?: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/verifications/${id}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, note })
  });
  if (!res.ok) throw new Error('Failed to review verification');
  return res.json();
}

export async function fetchAdminUsers(): Promise<Array<{
  id: string;
  displayName: string;
  email?: string;
  age: number;
  university: string;
  verifiedAdult: boolean;
  ageVerificationStatus?: string;
  accountType?: AccountType;
  isSuspended: boolean;
  suspensionReason?: string;
  createdAt: string;
}>> {
  const res = await fetch(`${API_BASE}/admin/users`);
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}

export async function toggleAdminUserSuspension(id: string, suspend: boolean, reason?: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/users/${id}/suspend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ suspend, reason })
  });
  if (!res.ok) throw new Error('Failed to update suspension');
  return res.json();
}

export async function moderateAdminPost(postId: string, action: 'approve' | 'flag' | 'remove', reason?: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/admin/posts/moderate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId, action, reason })
  });
  if (!res.ok) throw new Error('Failed to moderate post');
  return res.json();
}
