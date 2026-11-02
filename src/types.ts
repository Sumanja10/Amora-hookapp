export type ConnectionIntent =
  | 'Casual dating'
  | 'Casual meetups'
  | 'Flirting'
  | 'Friends with benefits'
  | 'Friendship'
  | 'Casual conversations';

export interface ProfilePhoto {
  id: string;
  url: string;
  visibility: 'public' | 'matched-only';
  caption?: string;
  position: number;
  isLocked?: boolean;
}

export interface VideoMedia {
  id: string;
  url: string;
  posterUrl?: string;
  caption?: string;
  durationSeconds?: number;
}

export type AccountType = 'creator' | 'member' | 'both' | 'buyer_only';
export type AgeVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface PrivacySettings {
  profileVisibility: 'public' | 'adults_only' | 'connections_only' | 'hidden';
  allowMeetupRequests: boolean;
  allowDirectMessaging: 'mutual_only' | 'nobody';
  showOnlineStatus: boolean;
}

export interface CreatorEarnings {
  totalEarnedKes: number;
  withdrawableKes: number;
  totalSales: number;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  age: number;
  dateOfBirth?: string;
  locationArea?: string; // e.g. "Westlands, Nairobi", "Kilimani", "CBD", "Kisumu", "Eldoret"
  distanceKm?: number; // Distance estimate in km (e.g. 1.8, 3.5, 7.0)
  occupation?: string; // e.g. "Graphic Designer", "Tech Consultant", "Student", "Marketing"
  university: string;
  studyArea?: string;
  genderIdentity: 'woman' | 'man' | 'nonbinary';
  lookingFor: string[];
  intent: string; // Legacy or primary
  intentions: ConnectionIntent[]; // Visible selected intentions
  bio: string;
  photos: ProfilePhoto[];
  videoIntro?: VideoMedia; // Short video introduction
  interests: string[];
  campusZone?: string;
  verifiedAdult: boolean;
  ageVerificationStatus?: AgeVerificationStatus;
  creatorVerificationStatus?: 'none' | 'pending' | 'verified' | 'rejected';
  accountType?: AccountType;
  discreetMode: boolean;
  showApproximateArea?: boolean; // Show distance estimate (never exact GPS)
  isAvailable?: boolean; // Available Now toggle
  availableUntil?: string; // Auto-expiry timestamp (ISO)
  availableNote?: string; // Activity note (e.g. "Free for coffee near Maseno Main")
  availableDurationMinutes?: number;
  circles?: string[]; // IDs of joined campus circles
  privacySettings?: PrivacySettings;
  creatorEarnings?: CreatorEarnings;
  isSuspended?: boolean;
  suspensionReason?: string;
  lastActive: string;
  createdAt: string;
  isCreator?: boolean;
  role?: 'creator' | 'student' | 'member';
  email?: string;
  subCampus?: string;
  faculty?: string;
  academicYear?: string;
  region?: 'Nairobi Metropol' | 'Western & Lake Region' | 'Rift Valley' | 'Coast';
  radarBearing?: number;
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  senderProfile: UserProfile;
  recipientId: string;
  recipientProfile?: UserProfile;
  status: 'pending' | 'accepted' | 'declined';
  intention?: string;
  message?: string;
  createdAt: string;
  respondedAt?: string;
}

export interface MeetupInterestRequest {
  id: string;
  planId: string;
  userId: string;
  userProfile: UserProfile;
  status: 'pending' | 'approved' | 'declined';
  note?: string;
  createdAt: string;
}

export type MeetupCategory =
  | 'coffee'
  | 'lunch'
  | 'movies'
  | 'outings'
  | 'conversations'
  | 'spontaneous';

export interface MeetupPlan {
  id: string;
  creatorId: string;
  creatorProfile: UserProfile;
  title: string;
  category: MeetupCategory;
  categoryLabel: string;
  locationArea: string; // safe public spot, e.g. "Java House Maseno", "Artcaffe Westlands"
  timeframe: string; // e.g. "Today 4:30 PM", "Tonight 8:00 PM", "Saturday Afternoon"
  intention: string;
  description: string;
  maxCompany: number;
  status: 'open' | 'filled' | 'completed' | 'cancelled';
  createdAt: string;
  requests: MeetupInterestRequest[];
  hasRequested?: boolean;
  requestsCount?: number;
  isMyPlan?: boolean;
  myRequestStatus?: 'pending' | 'approved' | 'declined';
}

export interface CirclePost {
  id: string;
  circleId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorCampus: string;
  content: string;
  likesCount: number;
  likedBy: string[];
  createdAt: string;
}

export interface CampusCircle {
  id: string;
  name: string;
  tagline: string;
  category: string;
  bannerUrl: string;
  icon: string;
  memberCount: number;
  members: string[];
  posts: CirclePost[];
  isJoined?: boolean;
}

export interface RadarFilterOptions {
  radiusKm: number;
  region: 'all' | 'nairobi' | 'western' | 'rift' | 'coast';
  locationArea?: string;
  campusBoundary?: 'all' | 'same_university' | 'cross_campus_only';
  intent: string;
  gender: string;
  availableOnly?: boolean;
}

export interface CampusNode {
  id: string;
  name: string;
  shortName: string;
  subCampuses: string[];
  region: 'Nairobi Metropol' | 'Western & Lake Region' | 'Rift Valley';
  distanceKm?: number;
  bearing?: number;
  lat?: number;
  lng?: number;
  activeCount: number;
}

export interface CreatorDashboardStats {
  totalRevenueKes: number;
  totalTransactions: number;
  mpesaRecipientNumber: string;
  totalProfiles: number;
  totalMatches: number;
  totalMessages: number;
  totalReports: number;
  recentPayments: MpesaPayment[];
  recentReports: Array<{
    id: string;
    reporterId: string;
    reporterName?: string;
    targetProfileId: string;
    targetName?: string;
    category: string;
    details: string;
    createdAt: string;
  }>;
  campusBreakdown: Record<string, number>;
}

export interface MpesaPayment {
  id: string;
  checkoutRequestId: string;
  merchantRequestId: string;
  matchId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  phoneNumber: string;
  amount: number;
  purpose: 'connection_pass' | 'coffee_treat' | 'drinks_date';
  purposeLabel: string;
  status: 'pending' | 'completed' | 'failed';
  mpesaReceiptNumber?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Match {
  id: string;
  users: [string, string];
  profile: UserProfile;
  matchedAt: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  hasConnectionPass?: boolean;
  isVipUnlocked?: boolean;
  chatUnlocked?: boolean;
  mpesaPayments?: MpesaPayment[];
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
  type?: 'text' | 'mpesa_payment';
  paymentDetails?: MpesaPayment;
}

export interface DashboardSummary {
  matchesCount: number;
  unreadMessagesCount: number;
  incomingRequestsCount: number;
  activeMeetupsCount: number;
  availableCount: number;
  discoveryCount: number;
  profileCompleteness: number;
  intent: string;
  discreetMode: boolean;
  isCreator?: boolean;
}

export interface SafetyPrinciple {
  title: string;
  description: string;
}

export interface CreatorPost {
  id: string;
  creatorId: string;
  creatorProfile: {
    id: string;
    displayName: string;
    avatar: string;
    university: string;
    locationArea?: string;
    verifiedAdult: boolean;
    creatorVerificationStatus?: 'none' | 'pending' | 'verified' | 'rejected';
  };
  title: string;
  description: string;
  type: 'photo' | 'video';
  mediaUrl: string; // Full unlocked URL
  previewUrl: string; // Watermarked/blurred preview URL
  isExclusive: boolean; // True = paid exclusive, False = free lifestyle
  priceKes: number; // e.g. 150, 300, 500
  tags: string[];
  viewsCount: number;
  salesCount: number;
  createdAt: string;
  moderationStatus: 'approved' | 'pending' | 'flagged' | 'rejected';
  consentConfirmed: boolean;
  isPurchased?: boolean;
}

export interface ContentPurchase {
  id: string;
  buyerId: string;
  creatorId: string;
  postId: string;
  amountKes: number;
  mpesaPaymentId: string;
  mpesaReceiptNumber: string;
  unlockedAt: string;
  postDetails?: CreatorPost;
}

export interface AgeVerificationRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  idType: 'national_id' | 'passport' | 'military_id' | 'driving_license';
  idNumberMasked: string; // e.g. "34****92"
  dob: string;
  calculatedAge: number;
  selfieUrl: string;
  documentFrontUrl?: string;
  status: AgeVerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerNote?: string;
}

export interface AdminPlatformStats {
  totalUsers: number;
  totalCreators: number;
  totalAdultsVerified: number;
  totalRevenueKes: number;
  totalPurchasesCount: number;
  totalReportsCount: number;
  pendingVerificationsCount: number;
  pendingPostsCount: number;
}
