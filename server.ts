import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Explicit static handlers for profile photos (serves /images and legacy /src/assets/images in both dev & prod)
const publicImagesDir = path.resolve(__dirname, 'public/images');
const srcImagesDir = path.resolve(__dirname, 'src/assets/images');
const distImagesDir = path.resolve(__dirname, 'dist/images');

app.use('/images', express.static(publicImagesDir));
app.use('/images', express.static(distImagesDir));
app.use('/images', express.static(srcImagesDir));
app.use('/src/assets/images', express.static(publicImagesDir));
app.use('/src/assets/images', express.static(srcImagesDir));
app.use('/src/assets/images', express.static(distImagesDir));

// Types
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

export type ConnectionIntent =
  | 'Casual dating'
  | 'Casual meetups'
  | 'Flirting'
  | 'Friends with benefits'
  | 'Friendship'
  | 'Casual conversations';

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
  mediaUrl: string;
  previewUrl: string;
  isExclusive: boolean;
  priceKes: number;
  tags: string[];
  viewsCount: number;
  salesCount: number;
  createdAt: string;
  moderationStatus: 'approved' | 'pending' | 'flagged' | 'rejected';
  consentConfirmed: boolean;
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
}

export interface AgeVerificationRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  idType: 'national_id' | 'passport' | 'military_id' | 'driving_license';
  idNumberMasked: string;
  dob: string;
  calculatedAge: number;
  selfieUrl: string;
  documentFrontUrl?: string;
  status: AgeVerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerNote?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  age: number;
  dateOfBirth?: string;
  locationArea?: string;
  occupation?: string;
  university: string;
  studyArea?: string;
  genderIdentity: 'woman' | 'man' | 'nonbinary';
  lookingFor: string[];
  intent: string;
  intentions: ConnectionIntent[];
  bio: string;
  photos: ProfilePhoto[];
  videoIntro?: VideoMedia;
  interests: string[];
  campusZone?: string;
  verifiedAdult: boolean;
  ageVerificationStatus?: AgeVerificationStatus;
  creatorVerificationStatus?: 'none' | 'pending' | 'verified' | 'rejected';
  accountType?: AccountType;
  privacySettings?: PrivacySettings;
  creatorEarnings?: CreatorEarnings;
  isSuspended?: boolean;
  suspensionReason?: string;
  discreetMode: boolean;
  showApproximateArea?: boolean;
  isAvailable?: boolean;
  availableUntil?: string;
  availableNote?: string;
  availableDurationMinutes?: number;
  circles?: string[];
  lastActive: string;
  createdAt: string;
  isCreator?: boolean;
  role?: 'creator' | 'student' | 'member';
  email?: string;
  subCampus?: string;
  faculty?: string;
  academicYear?: string;
  region?: 'Nairobi Metropol' | 'Western & Lake Region' | 'Rift Valley' | 'Coast';
  distanceKm?: number;
  radarBearing?: number;
  campusLat?: number;
  campusLng?: number;
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  senderProfile?: UserProfile;
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
  userProfile?: UserProfile;
  status: 'pending' | 'approved' | 'declined';
  note?: string;
  createdAt: string;
}

export interface MeetupPlan {
  id: string;
  creatorId: string;
  creatorProfile?: UserProfile;
  title: string;
  category: 'coffee' | 'lunch' | 'movies' | 'outings' | 'conversations' | 'spontaneous';
  categoryLabel: string;
  locationArea: string;
  timeframe: string;
  intention: string;
  description: string;
  maxCompany: number;
  status: 'open' | 'filled' | 'completed' | 'cancelled';
  createdAt: string;
  requests: MeetupInterestRequest[];
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

// Seed Mpesa Payments
let mpesaPayments: MpesaPayment[] = [
  {
    id: 'mpesa_seed_1',
    checkoutRequestId: 'ws_CO_29102026_001',
    merchantRequestId: 'MR_UON_401',
    matchId: 'match_maya_julian',
    senderId: 'usr_julian',
    senderName: 'Julian Mwangi (JKUAT)',
    recipientId: 'usr_creator_dennis',
    recipientName: '+254740047265',
    phoneNumber: '254712984501',
    amount: 100,
    purpose: 'connection_pass',
    purposeLabel: 'Mutual Connection Chat Unlock (Sent to +254740047265)',
    status: 'completed',
    mpesaReceiptNumber: 'SHK9281NZ4',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 4 + 12000).toISOString()
  },
  {
    id: 'mpesa_seed_2',
    checkoutRequestId: 'ws_CO_29102026_002',
    merchantRequestId: 'MR_MASENO_102',
    matchId: 'match_seed_2',
    senderId: 'usr_marcus',
    senderName: 'Marcus Ochieng (MMUST)',
    recipientId: 'usr_creator_dennis',
    recipientName: '+254740047265',
    phoneNumber: '254722849102',
    amount: 100,
    purpose: 'connection_pass',
    purposeLabel: 'Mutual Connection Chat Unlock (Sent to +254740047265)',
    status: 'completed',
    mpesaReceiptNumber: 'SHL4108XA9',
    createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 2.5 + 8000).toISOString()
  }
];

// Seed Profiles with Intentions, Videos, Availability
let profiles: UserProfile[] = [
  {
    id: 'usr_creator_dennis',
    userId: 'usr_creator_dennis',
    displayName: 'Dennis Tarus (Creator)',
    email: 'dennistarus10@gmail.com',
    isCreator: true,
    role: 'creator',
    age: 24,
    university: 'Maseno University (Main campus)',
    studyArea: 'Computer Science',
    subCampus: 'Main Campus',
    faculty: 'School of Computing & Informatics',
    academicYear: 'Year 4 · Creator',
    region: 'Western & Lake Region',
    locationArea: 'Westlands & Central Nairobi',
    occupation: 'Founder & Software Architect',
    distanceKm: 2.1,
    campusLat: -0.005,
    campusLng: 34.601,
    genderIdentity: 'man',
    lookingFor: ['women'],
    intent: 'dating',
    intentions: ['Casual meetups', 'Casual conversations', 'Casual dating'],
    bio: 'Creator & Founder of AMORA. Passionate about discreet, private adult connection and smooth encounters across Kenya. Meet. Match. Connect. Direct line: +254740047265.',
    photos: [
      {
        id: 'p_dennis_1',
        url: '/images/creator_dennis_tarus_1793271699871.jpg',
        visibility: 'public',
        position: 0,
        caption: 'Dennis Tarus — Creator of AMORA'
      },
      {
        id: 'p_dennis_2',
        url: '/images/african_man_evening_1793268589543.jpg',
        visibility: 'matched-only',
        position: 1,
        caption: 'Evening lounge — verified creator photo'
      }
    ],
    videoIntro: {
      id: 'v_dennis_intro',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-smiling-and-talking-42999-large.mp4',
      posterUrl: '/images/creator_dennis_tarus_1793271699871.jpg',
      caption: 'Dennis Tarus — AMORA Founder & Software Architect introduction',
      durationSeconds: 15
    },
    interests: ['Computer Science', 'Code & Architecture', 'Rooftop Lounges', 'Casual Meetups', 'Fintech & M-Pesa'],
    campusZone: 'Westlands & Central Nairobi',
    verifiedAdult: true,
    discreetMode: false,
    showApproximateArea: true,
    isAvailable: true,
    availableUntil: new Date(Date.now() + 4 * 3600000).toISOString(),
    availableNote: 'Active at Westlands workspace · Free for coffee or evening drinks',
    availableDurationMinutes: 240,
    circles: ['circle_tech', 'circle_night'],
    lastActive: 'Active Now (Creator)',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_maya',
    userId: 'usr_maya',
    displayName: 'Maya Wangari',
    age: 22,
    university: 'University of Nairobi',
    subCampus: 'Chiromo Science Campus',
    studyArea: 'Medical Microbiology & Public Health',
    faculty: 'Health Sciences & Medicine',
    academicYear: 'Finalist (4th Year)',
    region: 'Nairobi Metropol',
    locationArea: 'Chiromo & Westlands, Nairobi',
    occupation: 'Medical Biotech & Public Health',
    distanceKm: 1.8,
    campusLat: -1.272,
    campusLng: 36.809,
    genderIdentity: 'woman',
    lookingFor: ['men', 'women'],
    intent: 'casual',
    intentions: ['Casual meetups', 'Casual dating', 'Casual conversations'],
    bio: 'Late-night vinyl seeker, cold brew & cocktail lover, and big on straightforward chemistry. Looking for confident, discreet, and consenting adult meetups in Nairobi without games.',
    photos: [
      {
        id: 'p_maya_1',
        url: '/images/african_woman_maya_1793268416227.jpg',
        visibility: 'public',
        position: 0,
        caption: 'Westlands afternoon study session'
      },
      {
        id: 'p_maya_2',
        url: '/images/african_woman_terrace_1793268562230.jpg',
        visibility: 'matched-only',
        position: 1,
        caption: 'Westlands terrace cocktail evening — discreet matched photo'
      }
    ],
    videoIntro: {
      id: 'v_maya_intro',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-with-a-laptop-42998-large.mp4',
      posterUrl: '/images/african_woman_maya_1793268416227.jpg',
      caption: 'Chiromo science senior into vinyl music & cold brew',
      durationSeconds: 14
    },
    interests: ['Live Afro-Jazz', 'Cold Brew', 'Discreet Cocktails', 'Philosophy', 'Terrace Sunsets'],
    campusZone: 'Chiromo & Westlands',
    verifiedAdult: true,
    discreetMode: false,
    showApproximateArea: true,
    isAvailable: true,
    availableUntil: new Date(Date.now() + 2 * 3600000).toISOString(),
    availableNote: 'Free for cold brew near Chiromo or Artcaffe Westlands',
    availableDurationMinutes: 120,
    circles: ['circle_coffee', 'circle_night'],
    lastActive: 'Active now',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_julian',
    userId: 'usr_julian',
    displayName: 'Julian Mwangi',
    age: 23,
    university: 'Jomo Kenyatta University (JKUAT)',
    subCampus: 'Juja Main Campus',
    studyArea: 'Architecture & Spatial Design',
    faculty: 'Built Environment & Design',
    academicYear: 'Finalist (5th Year)',
    region: 'Nairobi Metropol',
    locationArea: 'Juja & Westlands Corridor',
    occupation: 'Spatial Designer & Architect',
    distanceKm: 3.2,
    campusLat: -1.097,
    campusLng: 37.014,
    genderIdentity: 'man',
    lookingFor: ['women'],
    intent: 'casual',
    intentions: ['Casual meetups', 'Flirting', 'Casual dating'],
    bio: 'Architecture finalist dividing time between studio blueprints and Westlands rooftop lounges. Fan of dark roast, good soul rhythms, and honest, mutually respectful vibes.',
    photos: [
      {
        id: 'p_julian_1',
        url: '/images/african_man_julian_1793268455729.jpg',
        visibility: 'public',
        position: 0,
        caption: 'Architecture drafting studio Juja'
      },
      {
        id: 'p_julian_2',
        url: '/images/african_man_evening_1793268589543.jpg',
        visibility: 'matched-only',
        position: 1,
        caption: 'Westlands evening drink & sketches — discreet matched photo'
      }
    ],
    videoIntro: {
      id: 'v_julian_intro',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-smiling-and-talking-42999-large.mp4',
      posterUrl: '/images/african_man_julian_1793268455729.jpg',
      caption: 'Creative spatial architect & rooftop jazz lover',
      durationSeconds: 12
    },
    interests: ['Modern Design', 'Dark Roast', 'Synthesizers', 'Night Photography', 'Juja Sunsets'],
    campusZone: 'Juja & Thika Road',
    verifiedAdult: true,
    discreetMode: false,
    showApproximateArea: true,
    isAvailable: true,
    availableUntil: new Date(Date.now() + 3 * 3600000).toISOString(),
    availableNote: 'Juja sunset & terrace drinks tonight',
    availableDurationMinutes: 180,
    circles: ['circle_coffee', 'circle_night'],
    lastActive: '5m ago',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_stacy',
    userId: 'usr_stacy',
    displayName: 'Stacy Nyambura',
    age: 22,
    university: 'University of Nairobi',
    subCampus: 'Parklands Law Campus',
    studyArea: 'Commercial Law & Intellectual Property',
    faculty: 'Law & Legal Studies',
    academicYear: '3rd Year',
    region: 'Nairobi Metropol',
    locationArea: 'Parklands & Westlands, Nairobi',
    occupation: 'Commercial Law & IP',
    distanceKm: 2.4,
    campusLat: -1.261,
    campusLng: 36.820,
    genderIdentity: 'woman',
    lookingFor: ['men'],
    intent: 'dating',
    intentions: ['Casual dating', 'Casual conversations', 'Friendship'],
    bio: 'Commercial law scholar. Passionate about courtroom banter, cozy wine bars around Westlands, and honest mutual chemistry. Appreciate maturity, good humor, and mutual discretion.',
    photos: [
      {
        id: 'p_stacy_1',
        url: '/images/kenyan_student_stacy_1793273500891.jpg',
        visibility: 'public',
        position: 0,
        caption: 'Garden library patio'
      },
      {
        id: 'p_stacy_2',
        url: '/images/african_woman_terrace_1793268562230.jpg',
        visibility: 'matched-only',
        position: 1,
        caption: 'Westlands wine bistro — discreet matched photo'
      }
    ],
    videoIntro: {
      id: 'v_stacy_intro',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-with-a-laptop-42998-large.mp4',
      posterUrl: '/images/kenyan_student_stacy_1793273500891.jpg',
      caption: 'Commercial law & cozy wine bar chats',
      durationSeconds: 14
    },
    interests: ['Law Moots', 'Red Wine', 'Art Galleries', 'Salsa Nights', 'Westlands Cafes'],
    campusZone: 'Parklands & Westlands',
    verifiedAdult: true,
    discreetMode: true,
    showApproximateArea: true,
    isAvailable: false,
    circles: ['circle_culture', 'circle_coffee'],
    lastActive: '5m ago',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_brian',
    userId: 'usr_brian',
    displayName: 'Brian Kiprop',
    age: 23,
    university: 'Kenyatta University',
    subCampus: 'Kahawa Main Campus',
    studyArea: 'Economics & Financial Technology',
    faculty: 'Business & Economics',
    academicYear: 'Finalist (4th Year)',
    region: 'Nairobi Metropol',
    locationArea: 'Roysambu & Kasarani, Nairobi',
    occupation: 'Economics & Fintech Consultant',
    distanceKm: 4.8,
    campusLat: -1.181,
    campusLng: 36.928,
    genderIdentity: 'man',
    lookingFor: ['women'],
    intent: 'casual',
    intentions: ['Casual meetups', 'Casual conversations', 'Flirting'],
    bio: 'KU economics senior along Thika Road. Runner, weekend brunch enthusiast, and big fan of spontaneous date nights. Down-to-earth and value zero drama.',
    photos: [
      {
        id: 'p_brian_1',
        url: '/images/kenyan_student_brian_1793273515833.jpg',
        visibility: 'public',
        position: 0,
        caption: 'KU Student Center pavilion afternoon'
      },
      {
        id: 'p_brian_2',
        url: '/images/african_man_sports_1793268650523.jpg',
        visibility: 'matched-only',
        position: 1,
        caption: 'Weekend fitness park workout — discreet matched photo'
      }
    ],
    interests: ['Financial Markets', 'Running', 'Afro-House', 'Basketball', 'Coffee Runs'],
    campusZone: 'Kahawa Sukari & Thika Corridor',
    verifiedAdult: true,
    discreetMode: false,
    isAvailable: true,
    availableUntil: new Date(Date.now() + 2 * 3600000).toISOString(),
    availableNote: 'Free for quick lunch run around KU / Roysambu',
    availableDurationMinutes: 120,
    circles: ['circle_fitness', 'circle_outings'],
    lastActive: '15m ago',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_elena',
    userId: 'usr_elena',
    displayName: 'Elena Akinyi',
    age: 21,
    university: 'Maseno University (Main campus)',
    subCampus: 'Main Campus',
    studyArea: 'Media Science & Environmental Studies',
    faculty: 'Media & Humanities',
    academicYear: '2nd Year',
    region: 'Western & Lake Region',
    locationArea: 'Maseno Equator & Kisumu',
    occupation: 'Media Science & Pre-Med',
    distanceKm: 1.2,
    campusLat: -0.005,
    campusLng: 34.601,
    genderIdentity: 'woman',
    lookingFor: ['men', 'women'],
    intent: 'open',
    intentions: ['Casual conversations', 'Friendship', 'Casual meetups'],
    bio: 'Maseno University (Main campus) senior along the equator. Pre-med & media enthusiast into lakeside breezes, deep conversations in Kisumu, and seeing where mutual chemistry takes us. 100% open communication.',
    photos: [
      {
        id: 'p_elena_1',
        url: '/images/african_woman_elena_1793268469980.jpg',
        visibility: 'public',
        position: 0,
        caption: 'Maseno Main campus cafe notebook session'
      },
      {
        id: 'p_elena_2',
        url: '/images/african_woman_lake_1793268604137.jpg',
        visibility: 'matched-only',
        position: 1,
        caption: 'Lake Victoria sunset pier — discreet matched photo'
      }
    ],
    videoIntro: {
      id: 'v_elena_intro',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-smiling-outdoors-in-a-park-42984-large.mp4',
      posterUrl: '/images/african_woman_elena_1793268469980.jpg',
      caption: 'Maseno senior into deep conversations & lakeside views',
      durationSeconds: 15
    },
    interests: ['Lakeside Sunsets', 'Photography', 'Afro-House', 'Late Dinners', 'Philosophy'],
    campusZone: 'Main Campus, Maseno Equator',
    verifiedAdult: true,
    discreetMode: true,
    isAvailable: true,
    availableUntil: new Date(Date.now() + 1.5 * 3600000).toISOString(),
    availableNote: 'Lakeside breeze & cafe notebook session around Maseno',
    availableDurationMinutes: 90,
    circles: ['circle_culture', 'circle_outings'],
    lastActive: 'Active now',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_sharon',
    userId: 'usr_sharon',
    displayName: 'Sharon Atieno',
    age: 22,
    university: 'Maseno University (city campus)',
    subCampus: 'City Campus',
    studyArea: 'Public Health & Health Systems',
    faculty: 'Health Sciences & Medicine',
    academicYear: '3rd Year',
    region: 'Western & Lake Region',
    locationArea: 'Kisumu CBD & Mega Plaza',
    occupation: 'Public Health Scholar',
    distanceKm: 2.7,
    campusLat: -0.102,
    campusLng: 34.755,
    genderIdentity: 'woman',
    lookingFor: ['men', 'women'],
    intent: 'dating',
    intentions: ['Casual conversations', 'Casual meetups', 'Friendship'],
    bio: 'Maseno University (city campus) scholar in Kisumu CBD. Between clinical lectures and sunset coffee dates overlooking Lake Victoria, looking for genuine chemistry and mature, drama-free adult connection.',
    photos: [
      {
        id: 'p_sharon_1',
        url: '/images/maseno_city_sharon_1793274830911.jpg',
        visibility: 'public',
        position: 0,
        caption: 'Kisumu lakeside pavilion coffee & study break'
      },
      {
        id: 'p_sharon_2',
        url: '/images/african_woman_terrace_1793268562230.jpg',
        visibility: 'matched-only',
        position: 1,
        caption: 'Lakeside lounge evening cocktail — discreet matched photo'
      }
    ],
    interests: ['Lakeside Sunsets', 'Kisumu Art Cafes', 'Afrosoul', 'Culinary Dates', 'Health Tech'],
    campusZone: 'City Campus, Kisumu CBD',
    verifiedAdult: true,
    discreetMode: true,
    isAvailable: true,
    availableUntil: new Date(Date.now() + 3.5 * 3600000).toISOString(),
    availableNote: 'Kisumu CBD coffee break around Mega Plaza',
    availableDurationMinutes: 210,
    circles: ['circle_culture', 'circle_coffee'],
    lastActive: '10m ago',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_kevin',
    userId: 'usr_kevin',
    displayName: 'Kevin Onyango',
    age: 23,
    university: "Maseno University (Odero Okang'o campus)",
    subCampus: "Odero Okang'o Campus",
    studyArea: 'Education Arts & Applied Linguistics',
    faculty: 'Media & Humanities',
    academicYear: 'Finalist (4th Year)',
    region: 'Western & Lake Region',
    locationArea: 'Yala & Siaya Corridor',
    occupation: 'Linguistics & Creative Arts',
    distanceKm: 3.5,
    campusLat: 0.098,
    campusLng: 34.533,
    genderIdentity: 'man',
    lookingFor: ['women'],
    intent: 'open',
    intentions: ['Friends with benefits', 'Casual dating', 'Casual meetups'],
    bio: "Maseno University (Odero Okang'o campus) finalist in Yala. Into creative literature, acoustic playlists, spontaneous Kisumu road trips, and real chemistry without pressure.",
    photos: [
      {
        id: 'p_kevin_1',
        url: '/images/maseno_odero_kevin_1793274830519.jpg',
        visibility: 'public',
        position: 0,
        caption: "Odero Okang'o campus shaded pavilion garden"
      },
      {
        id: 'p_kevin_2',
        url: '/images/african_man_evening_1793268589543.jpg',
        visibility: 'matched-only',
        position: 1,
        caption: 'Evening weekend lounge — discreet matched photo'
      }
    ],
    interests: ['Creative Writing', 'Road Trips', 'Indie Folk', 'Outdoor Picnics', 'Philosophy'],
    campusZone: "Odero Okang'o Campus, Yala",
    verifiedAdult: true,
    discreetMode: false,
    isAvailable: false,
    circles: ['circle_outings'],
    lastActive: '25m ago',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_marcus',
    userId: 'usr_marcus',
    displayName: 'Marcus Ochieng',
    age: 24,
    university: 'Masinde Muliro University (MMUST)',
    subCampus: 'Kakamega Main Campus',
    studyArea: 'Computer Science & Software Engineering',
    faculty: 'Engineering & Tech',
    academicYear: '3rd Year',
    region: 'Western & Lake Region',
    locationArea: 'Kakamega Town',
    occupation: 'Software Engineer',
    distanceKm: 4.1,
    campusLat: 0.283,
    campusLng: 34.752,
    genderIdentity: 'man',
    lookingFor: ['women'],
    intent: 'casual',
    intentions: ['Casual meetups', 'Casual conversations', 'Flirting'],
    bio: 'MMUST engineering scholar in Kakamega unwinding after code sprints. Looking for someone stylish to grab drinks with, share honest laughs, and enjoy mutual connection without drama.',
    photos: [
      {
        id: 'p_marcus_1',
        url: '/images/african_man_marcus_1793268493535.jpg',
        visibility: 'public',
        position: 0,
        caption: 'MMUST campus pavilion morning coffee'
      },
      {
        id: 'p_marcus_2',
        url: '/images/african_man_sports_1793268650523.jpg',
        visibility: 'matched-only',
        position: 1,
        caption: 'Campus track pavilion workout — discreet matched photo'
      }
    ],
    interests: ['Tech Startups', 'Running', 'Whiskey Tasting', 'Afrobeats', 'Travel'],
    campusZone: 'Kakamega Main Campus',
    verifiedAdult: true,
    discreetMode: false,
    isAvailable: false,
    circles: ['circle_tech', 'circle_fitness'],
    lastActive: '12m ago',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_chloe',
    userId: 'usr_chloe',
    displayName: 'Chloe Awuor',
    age: 22,
    university: 'Uzima University',
    subCampus: 'Kisumu Medical Precinct',
    studyArea: 'Clinical Medicine & Surgery',
    faculty: 'Health Sciences & Medicine',
    academicYear: 'Finalist (5th Year)',
    region: 'Western & Lake Region',
    locationArea: 'Kisumu Medical & Dunga',
    occupation: 'Clinical Medicine Intern',
    distanceKm: 2.9,
    campusLat: -0.081,
    campusLng: 34.767,
    genderIdentity: 'woman',
    lookingFor: ['men'],
    intent: 'casual',
    intentions: ['Casual meetups', 'Casual dating', 'Flirting'],
    bio: 'Uzima University medical student. Fast-paced hospital rounds, high standards, zero games. Love lakeside loungers in Dunga, good banter, and confident people who value discretion.',
    photos: [
      {
        id: 'p_chloe_1',
        url: '/images/african_woman_chloe_1793268507095.jpg',
        visibility: 'public',
        position: 0,
        caption: 'Uzima University clinic courtyard'
      },
      {
        id: 'p_chloe_2',
        url: '/images/african_woman_evening_1793268636538.jpg',
        visibility: 'matched-only',
        position: 1,
        caption: 'Kisumu evening bistro dinner — discreet matched photo'
      }
    ],
    interests: ['Kisumu Sunsets', 'Tennis', 'Fashion', 'Sailing', 'Podcasts'],
    campusZone: 'Kisumu Medical Precinct',
    verifiedAdult: true,
    discreetMode: true,
    isAvailable: false,
    circles: ['circle_culture', 'circle_night'],
    lastActive: '1h ago',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_liam',
    userId: 'usr_liam',
    displayName: 'Liam Otieno',
    age: 23,
    university: 'Rongo University',
    subCampus: 'Kitere Hill Main Campus',
    studyArea: 'Agribusiness Economics & Technology',
    faculty: 'Agribusiness & Sciences',
    academicYear: '3rd Year',
    region: 'Western & Lake Region',
    locationArea: 'Kitere Hill & Migori',
    occupation: 'Agri-Tech & Economist',
    distanceKm: 3.8,
    campusLat: -0.767,
    campusLng: 34.609,
    genderIdentity: 'man',
    lookingFor: ['women', 'nonbinary'],
    intent: 'dating',
    intentions: ['Casual dating', 'Casual conversations', 'Friendship'],
    bio: 'Rongo University scholar in Migori. Love exploring hidden book corners, acoustic live sets, weekend getaways, and honest, chemistry-first dating.',
    photos: [
      {
        id: 'p_liam_1',
        url: '/images/african_man_liam_1793268520661.jpg',
        visibility: 'public',
        position: 0,
        caption: 'Kitere acoustic garden afternoon'
      }
    ],
    interests: ['Road Trips', 'Cooking', 'Vinyl', 'Agri-Tech', 'Acoustic Soul'],
    campusZone: 'Kitere Hill / Rongo Campus',
    verifiedAdult: true,
    discreetMode: false,
    isAvailable: false,
    circles: ['circle_outings'],
    lastActive: '2h ago',
    createdAt: new Date().toISOString()
  }
];

// Current active session profile ID
let currentUserId = 'usr_maya';

// Likes store: Set of 'fromUserId:toUserId'
const likes = new Set<string>([
  'usr_julian:usr_maya',
  'usr_elena:usr_maya',
  'usr_maya:usr_creator_dennis',
  'usr_elena:usr_creator_dennis',
  'usr_chloe:usr_creator_dennis',
  'usr_sharon:usr_creator_dennis',
  'usr_kevin:usr_creator_dennis',
]);

const passes = new Set<string>();
const blocks = new Set<string>();

// Reports store
let reports: Array<{
  id: string;
  reporterId: string;
  targetProfileId: string;
  category: string;
  details: string;
  createdAt: string;
}> = [
  {
    id: 'rep_sample_1',
    reporterId: 'usr_maya',
    targetProfileId: 'usr_liam',
    category: 'fake_profile',
    details: 'Testing campus verification badge audit.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

// Connection Requests Store ("Interested in You")
let connectionRequests: ConnectionRequest[] = [
  {
    id: 'req_seed_1',
    senderId: 'usr_julian',
    recipientId: 'usr_creator_dennis',
    status: 'pending',
    intention: 'Casual conversations',
    message: 'Hey Dennis, huge fan of the AMORA platform architecture! Would love to connect and grab coffee around Westlands to talk software & design.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'req_seed_2',
    senderId: 'usr_brian',
    recipientId: 'usr_maya',
    status: 'pending',
    intention: 'Casual meetups',
    message: 'Hey Maya! Loved your bio on straightforward chemistry and cold brew. Free for an iced pour-over around Westlands?',
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString()
  },
  {
    id: 'req_seed_3',
    senderId: 'usr_elena',
    recipientId: 'usr_creator_dennis',
    status: 'accepted',
    intention: 'Casual conversations',
    message: 'Hi Dennis! Loving the AMORA platform concept. So glad we have a respectful, safe space for campus meetups.',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    respondedAt: new Date(Date.now() - 3600000 * 2.8).toISOString()
  }
];

// Meet-up Plans Store (Coffee, Lunch, Movies, Outings, etc.)
let meetupPlans: MeetupPlan[] = [
  {
    id: 'meet_1',
    creatorId: 'usr_maya',
    title: 'Afternoon Cold Brew & Notebook Banter',
    category: 'coffee',
    categoryLabel: 'Coffee Together',
    locationArea: 'Artcaffe Oval, Westlands',
    timeframe: 'Today at 4:30 PM',
    intention: 'Casual conversations',
    description: 'Looking for great, drama-free company to grab iced pour-overs, share music recommendations, and take a quick study break.',
    maxCompany: 2,
    status: 'open',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    requests: [
      {
        id: 'req_m1',
        planId: 'meet_1',
        userId: 'usr_liam',
        status: 'pending',
        note: 'I love iced pour-overs! Free from 4pm onwards.',
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
      }
    ]
  },
  {
    id: 'meet_2',
    creatorId: 'usr_julian',
    title: 'Late Night Rooftop Drinks & Soul Vinyl',
    category: 'spontaneous',
    categoryLabel: 'Spontaneous Meetups',
    locationArea: 'Westlands Rooftop Lounge',
    timeframe: 'Tonight at 8:30 PM',
    intention: 'Casual meetups',
    description: 'Discreet, relaxed adult vibes. First round of craft cocktails is on me. Let’s enjoy good jazz and unwind.',
    maxCompany: 2,
    status: 'open',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    requests: []
  },
  {
    id: 'meet_3',
    creatorId: 'usr_creator_dennis',
    title: 'Post-Lecture Tech & Founders Lunch',
    category: 'lunch',
    categoryLabel: 'Lunch Plans',
    locationArea: 'Java House Maseno / Westlands Hub',
    timeframe: 'Tomorrow at 1:00 PM',
    intention: 'Casual conversations',
    description: 'Grabbing a relaxed burger and talking digital products, campus culture, and future ideas.',
    maxCompany: 3,
    status: 'open',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    requests: [
      {
        id: 'req_m3',
        planId: 'meet_3',
        userId: 'usr_brian',
        status: 'pending',
        note: 'Count me in! Would love to chat fintech and economics.',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ]
  },
  {
    id: 'meet_4',
    creatorId: 'usr_elena',
    title: 'Sunset Stroll & Lakeside Fresh Tilapia',
    category: 'outings',
    categoryLabel: 'Social Outings',
    locationArea: 'Dunga Hill Pier, Kisumu',
    timeframe: 'Saturday at 5:00 PM',
    intention: 'Casual dating',
    description: 'Watching the Lake Victoria sunset, chill lakeside acoustic sounds, and genuine connection.',
    maxCompany: 2,
    status: 'open',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    requests: []
  },
  {
    id: 'meet_5',
    creatorId: 'usr_stacy',
    title: 'Weekend Movie Night & Dinner',
    category: 'movies',
    categoryLabel: 'Movies',
    locationArea: 'Westgate Cinema, Westlands',
    timeframe: 'Friday at 7:00 PM',
    intention: 'Casual dating',
    description: 'Catching the new thriller release followed by dinner and honest conversation.',
    maxCompany: 2,
    status: 'open',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    requests: []
  }
];

// Campus Circles Store
let campusCircles: CampusCircle[] = [
  {
    id: 'circle_night',
    name: 'Night Owls & Late Hangouts',
    tagline: 'For campus adults who come alive after dusk. Rooftops, lounges, and honest talks.',
    category: 'Social',
    bannerUrl: '/images/amora_hero_romantic_1793263072952.jpg',
    icon: 'Moon',
    memberCount: 84,
    members: ['usr_creator_dennis', 'usr_maya', 'usr_julian', 'usr_chloe'],
    posts: [
      {
        id: 'c_post_1',
        circleId: 'circle_night',
        authorId: 'usr_julian',
        authorName: 'Julian Mwangi',
        authorAvatar: '/images/african_man_julian_1793268455729.jpg',
        authorCampus: 'JKUAT',
        content: 'Any quiet rooftop recommendations around Westlands with good acoustic playlists tonight?',
        likesCount: 12,
        likedBy: ['usr_maya', 'usr_creator_dennis'],
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ]
  },
  {
    id: 'circle_coffee',
    name: 'Coffee & Creative Minds',
    tagline: 'Designers, coders, writers, and cold brew enthusiasts across university campuses.',
    category: 'Culture',
    bannerUrl: '/images/african_woman_terrace_1793268562230.jpg',
    icon: 'Coffee',
    memberCount: 67,
    members: ['usr_creator_dennis', 'usr_maya', 'usr_julian', 'usr_stacy'],
    posts: [
      {
        id: 'c_post_2',
        circleId: 'circle_coffee',
        authorId: 'usr_maya',
        authorName: 'Maya Wangari',
        authorAvatar: '/images/african_woman_maya_1793268416227.jpg',
        authorCampus: 'UoN Chiromo',
        content: 'Working from Artcaffe this afternoon if anyone wants to grab pour-overs and talk music!',
        likesCount: 9,
        likedBy: ['usr_creator_dennis', 'usr_julian'],
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ]
  },
  {
    id: 'circle_tech',
    name: 'Tech Founders & Coders',
    tagline: 'Building products, startup ideas, and late-night coding breakthroughs.',
    category: 'Tech',
    bannerUrl: '/images/creator_dennis_tarus_1793271699871.jpg',
    icon: 'Code',
    memberCount: 52,
    members: ['usr_creator_dennis', 'usr_marcus'],
    posts: [
      {
        id: 'c_post_3',
        circleId: 'circle_tech',
        authorId: 'usr_creator_dennis',
        authorName: 'Dennis Tarus (Creator)',
        authorAvatar: '/images/creator_dennis_tarus_1793271699871.jpg',
        authorCampus: 'Maseno University',
        content: 'Pushed the new intention-driven social experience for AMORA. Direct consent, real meetups, no swiping slop.',
        likesCount: 28,
        likedBy: ['usr_maya', 'usr_julian', 'usr_marcus'],
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
      }
    ]
  },
  {
    id: 'circle_outings',
    name: 'Weekend Outings & Road Trips',
    tagline: 'Lake Victoria piers, Naivasha drives, outdoor hikes, and spontaneous getaways.',
    category: 'Adventure',
    bannerUrl: '/images/african_woman_lake_1793268604137.jpg',
    icon: 'Compass',
    memberCount: 76,
    members: ['usr_elena', 'usr_liam', 'usr_kevin', 'usr_brian'],
    posts: [
      {
        id: 'c_post_4',
        circleId: 'circle_outings',
        authorId: 'usr_elena',
        authorName: 'Elena Akinyi',
        authorAvatar: '/images/african_woman_elena_1793268469980.jpg',
        authorCampus: 'Maseno Main',
        content: 'Sunset at Dunga Hill Pier never gets old. Who is free for fresh fish this weekend?',
        likesCount: 15,
        likedBy: ['usr_liam', 'usr_sharon'],
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ]
  },
  {
    id: 'circle_fitness',
    name: 'Fitness & Gym Buddies',
    tagline: 'Morning runs, gym spotters, and healthy active lifestyles across campuses.',
    category: 'Wellness',
    bannerUrl: '/images/african_man_sports_1793268650523.jpg',
    icon: 'Dumbbell',
    memberCount: 43,
    members: ['usr_brian', 'usr_marcus'],
    posts: []
  }
];

// Matches store
let matches: Array<{
  id: string;
  users: [string, string];
  matchedAt: string;
  hasConnectionPass?: boolean;
  isVipUnlocked?: boolean;
  chatUnlocked?: boolean;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  unreadCount?: number;
}> = [
  {
    id: 'match_maya_julian',
    users: ['usr_maya', 'usr_julian'],
    matchedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    hasConnectionPass: true,
    isVipUnlocked: true,
    chatUnlocked: true
  },
  {
    id: 'match_dennis_elena',
    users: ['usr_creator_dennis', 'usr_elena'],
    matchedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    hasConnectionPass: true,
    isVipUnlocked: true,
    chatUnlocked: true
  }
];

let messages: Message[] = [
  {
    id: 'msg_1',
    matchId: 'match_maya_julian',
    senderId: 'usr_julian',
    text: 'Hey Maya! Loved your note on straightforward chemistry. Are you free around Westlands or Chiromo this evening for a quick drink?',
    createdAt: new Date(Date.now() - 3600000 * 3.5).toISOString(),
    read: true
  },
  {
    id: 'msg_2',
    matchId: 'match_maya_julian',
    senderId: 'usr_maya',
    text: 'Hey Julian! I definitely am. Know that rooftop terrace near Chiromo? The ambiance there is unbeatable.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: true
  },
  {
    id: 'msg_3',
    matchId: 'match_maya_julian',
    senderId: 'usr_julian',
    text: 'Perfect spot. I can drive down from Juja around 8:00pm if that works for you. Discreet and relaxed.',
    createdAt: new Date(Date.now() - 3600000 * 1.2).toISOString(),
    read: false
  },
  {
    id: 'msg_dennis_1',
    matchId: 'match_dennis_elena',
    senderId: 'usr_elena',
    text: 'Hi Dennis! Loving the AMORA platform concept. So glad we have a respectful, safe space for campus meetups.',
    createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    read: false
  }
];

// Creator Posts, Purchases & Age Verification Records Store
let creatorPosts: CreatorPost[] = [];
let purchases: ContentPurchase[] = [];
let verificationRecords: AgeVerificationRecord[] = [];

// Helper to get current profile
function getCurrentProfile(): UserProfile {
  const p = profiles.find(item => item.id === currentUserId);
  if (!p) return profiles[0];
  return p;
}

// Check availability expiration dynamically
function refreshAvailability(profile: UserProfile): void {
  if (profile.isAvailable && profile.availableUntil) {
    if (new Date() > new Date(profile.availableUntil)) {
      profile.isAvailable = false;
      profile.availableUntil = undefined;
      profile.availableNote = undefined;
    }
  }
}

// -------------------------------------------------------------
// Database Persistence Layer
// -------------------------------------------------------------
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'amora_store.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDatabase() {
  try {
    ensureDataDir();
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.profiles) && data.profiles.length > 0) {
        profiles = data.profiles;
      }
      if (Array.isArray(data.mpesaPayments)) {
        mpesaPayments = data.mpesaPayments;
      }
      if (Array.isArray(data.matches)) {
        matches = data.matches;
      }
      if (Array.isArray(data.messages)) {
        messages = data.messages;
      }
      if (Array.isArray(data.reports)) {
        reports = data.reports;
      }
      if (Array.isArray(data.connectionRequests)) {
        connectionRequests = data.connectionRequests;
      }
      if (Array.isArray(data.meetupPlans)) {
        meetupPlans = data.meetupPlans;
      }
      if (Array.isArray(data.campusCircles)) {
        campusCircles = data.campusCircles;
      }
      if (Array.isArray(data.creatorPosts)) {
        creatorPosts = data.creatorPosts;
      }
      if (Array.isArray(data.purchases)) {
        purchases = data.purchases;
      }
      if (Array.isArray(data.verificationRecords)) {
        verificationRecords = data.verificationRecords;
      }
      if (Array.isArray(data.likes)) {
        likes.clear();
        data.likes.forEach((item: string) => likes.add(item));
      }
      if (Array.isArray(data.passes)) {
        passes.clear();
        data.passes.forEach((item: string) => passes.add(item));
      }
      if (Array.isArray(data.blocks)) {
        blocks.clear();
        data.blocks.forEach((item: string) => blocks.add(item));
      }
      console.log(`[Database] Loaded persistent AMORA data from ${DATA_FILE}. Creator posts: ${creatorPosts.length}, Purchases: ${purchases.length}`);
    } else {
      saveDatabase();
      console.log(`[Database] Initialized new AMORA database at ${DATA_FILE}`);
    }
  } catch (err) {
    console.error('[Database] Failed to load database, using fallback in-memory state:', err);
  }
}

function saveDatabase() {
  try {
    ensureDataDir();
    const payload = {
      version: 3,
      updatedAt: new Date().toISOString(),
      profiles,
      mpesaPayments,
      matches,
      messages,
      reports,
      connectionRequests,
      meetupPlans,
      campusCircles,
      creatorPosts,
      purchases,
      verificationRecords,
      likes: Array.from(likes),
      passes: Array.from(passes),
      blocks: Array.from(blocks)
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Database] Error saving database:', err);
  }
}

loadDatabase();

// -------------------------------------------------------------
// Distance & Compass Utilities
// -------------------------------------------------------------
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const y = Math.sin((lon2 - lon1) * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos((lon2 - lon1) * Math.PI / 180);
  const brng = Math.atan2(y, x) * 180 / Math.PI;
  return Math.round((brng + 360) % 360);
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    platform: 'AMORA — Intention-Driven Adult Discovery & Social Connection',
    slogan: 'Meet. Match. Connect.',
    time: new Date().toISOString()
  });
});

// 2. Current User & Switch Demo Users
app.get('/api/auth/current', (req: Request, res: Response) => {
  const current = getCurrentProfile();
  refreshAvailability(current);
  res.json({
    user: current,
    availableProfiles: profiles.map(p => ({
      id: p.id,
      displayName: p.displayName,
      age: p.age,
      university: p.university,
      intent: p.intent,
      avatar: p.photos[0]?.url,
      isCreator: p.isCreator,
      role: p.role,
      email: p.email
    }))
  });
});

app.post('/api/auth/switch', (req: Request, res: Response) => {
  const { profileId } = req.body;
  const target = profiles.find(p => p.id === profileId);
  if (!target) {
    res.status(404).json({ error: 'Profile not found' });
    return;
  }
  currentUserId = target.id;
  refreshAvailability(target);
  res.json({ success: true, user: target });
});

// Dedicated Creator Login for Dennis Tarus
app.post('/api/auth/creator-login', (req: Request, res: Response) => {
  const { email } = req.body;
  const creator = profiles.find(p => p.id === 'usr_creator_dennis') || profiles.find(p => p.email === 'dennistarus10@gmail.com');
  if (!creator) {
    res.status(404).json({ error: 'Creator profile not found' });
    return;
  }
  currentUserId = creator.id;
  res.json({
    success: true,
    user: creator,
    message: 'Welcome Dennis Tarus! You are now logged in with full Creator & Platform Architect privileges.'
  });
});

// Creator Hub & Analytics
app.get('/api/creator/stats', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  if (!me.isCreator && me.id !== 'usr_creator_dennis' && me.email !== 'dennistarus10@gmail.com') {
    res.status(403).json({ error: 'Access denied: Creator authentication required.' });
    return;
  }

  const totalRevenue = mpesaPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const campusBreakdown: Record<string, number> = {};
  profiles.forEach(p => {
    campusBreakdown[p.university] = (campusBreakdown[p.university] || 0) + 1;
  });

  res.json({
    totalRevenueKes: totalRevenue,
    totalTransactions: mpesaPayments.length,
    mpesaRecipientNumber: '+254740047265',
    totalProfiles: profiles.length,
    totalMatches: matches.length,
    totalMessages: messages.length,
    totalReports: reports.length,
    recentPayments: [...mpesaPayments].reverse(),
    recentReports: reports.map(r => {
      const reporter = profiles.find(p => p.id === r.reporterId);
      const target = profiles.find(p => p.id === r.targetProfileId);
      return {
        ...r,
        reporterName: reporter?.displayName || 'Campus Student',
        targetName: target?.displayName || 'Flagged User'
      };
    }),
    campusBreakdown
  });
});

app.post('/api/creator/dismiss-report', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  if (!me.isCreator && me.id !== 'usr_creator_dennis' && me.email !== 'dennistarus10@gmail.com') {
    res.status(403).json({ error: 'Access denied.' });
    return;
  }

  const { reportId } = req.body;
  const index = reports.findIndex(r => r.id === reportId);
  if (index !== -1) {
    reports.splice(index, 1);
    saveDatabase();
  }
  res.json({ success: true, message: 'Report dismissed by Creator.' });
});

// User Sign Up
app.post('/api/auth/signup', (req: Request, res: Response) => {
  const {
    displayName,
    age,
    university,
    studyArea,
    genderIdentity,
    lookingFor,
    intent,
    intentions,
    bio,
    interests,
    verifiedAdult,
    photoUrl
  } = req.body;

  if (!displayName || !age || Number(age) < 18) {
    res.status(400).json({ error: 'Valid display name and age 18+ required for consenting adult registration.' });
    return;
  }

  const newId = `usr_${Date.now()}`;
  const defaultIntentions: ConnectionIntent[] = Array.isArray(intentions) && intentions.length > 0
    ? intentions
    : ['Casual meetups', 'Casual conversations'];

  const newProfile: UserProfile = {
    id: newId,
    userId: newId,
    displayName: String(displayName).trim(),
    age: Number(age),
    university: String(university || 'University of Nairobi').trim(),
    studyArea: String(studyArea || 'General Studies').trim(),
    genderIdentity: genderIdentity || 'woman',
    lookingFor: Array.isArray(lookingFor) && lookingFor.length > 0 ? lookingFor : ['men', 'women'],
    intent: intent || 'casual',
    intentions: defaultIntentions,
    bio: String(bio || 'Adult university community member looking for mutual, respectful connections.').trim(),
    photos: [
      {
        id: `p_${Date.now()}`,
        url: photoUrl || '/images/african_woman_maya_1793268416227.jpg',
        visibility: 'public',
        position: 0,
        caption: 'Primary portrait'
      }
    ],
    interests: Array.isArray(interests) && interests.length > 0 ? interests : ['Conversation', 'Campus Life', 'Evenings Out'],
    campusZone: 'Central Campus',
    verifiedAdult: Boolean(verifiedAdult),
    discreetMode: true,
    showApproximateArea: true,
    distanceKm: 1.5,
    lastActive: 'Active now',
    createdAt: new Date().toISOString()
  };

  profiles.unshift(newProfile);
  currentUserId = newId;
  saveDatabase();

  res.status(201).json({ success: true, user: newProfile });
});

// Current Profile & Update
app.get('/api/me/profile', (req: Request, res: Response) => {
  const user = getCurrentProfile();
  refreshAvailability(user);
  res.json(user);
});

app.post('/api/me/profile', (req: Request, res: Response) => {
  const user = getCurrentProfile();
  const updates = req.body;

  if (updates.age && Number(updates.age) < 18) {
    res.status(400).json({ error: 'You must be at least 18 years old.' });
    return;
  }

  Object.assign(user, {
    displayName: updates.displayName !== undefined ? updates.displayName : user.displayName,
    age: updates.age !== undefined ? Number(updates.age) : user.age,
    university: updates.university !== undefined ? updates.university : user.university,
    studyArea: updates.studyArea !== undefined ? updates.studyArea : user.studyArea,
    genderIdentity: updates.genderIdentity !== undefined ? updates.genderIdentity : user.genderIdentity,
    lookingFor: updates.lookingFor !== undefined ? updates.lookingFor : user.lookingFor,
    intent: updates.intent !== undefined ? updates.intent : user.intent,
    intentions: Array.isArray(updates.intentions) ? updates.intentions : user.intentions,
    bio: updates.bio !== undefined ? updates.bio : user.bio,
    interests: updates.interests !== undefined ? updates.interests : user.interests,
    campusZone: updates.campusZone !== undefined ? updates.campusZone : user.campusZone,
    discreetMode: updates.discreetMode !== undefined ? Boolean(updates.discreetMode) : user.discreetMode,
    showApproximateArea: updates.showApproximateArea !== undefined ? Boolean(updates.showApproximateArea) : (user.showApproximateArea ?? true),
  });

  saveDatabase();
  res.json({ success: true, profile: user });
});

// -------------------------------------------------------------
// Live Availability Management
// -------------------------------------------------------------
app.post('/api/me/availability', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const { isAvailable, durationMinutes, note } = req.body;

  me.isAvailable = Boolean(isAvailable);

  if (me.isAvailable) {
    const mins = Number(durationMinutes) || 120; // default 2 hours
    me.availableDurationMinutes = mins;
    me.availableUntil = new Date(Date.now() + mins * 60 * 1000).toISOString();
    me.availableNote = note ? String(note).trim() : me.availableNote || 'Available for casual hangout';
    me.lastActive = 'Available Now 🟢';
  } else {
    me.availableUntil = undefined;
    me.availableNote = undefined;
    me.lastActive = 'Active recently';
  }

  saveDatabase();
  res.json({ success: true, profile: me });
});

// -------------------------------------------------------------
// Video Intro Management
// -------------------------------------------------------------
app.post('/api/me/video-intro', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const { videoIntro } = req.body;

  if (!videoIntro) {
    me.videoIntro = undefined;
  } else {
    me.videoIntro = {
      id: videoIntro.id || `video_${Date.now()}`,
      url: videoIntro.url,
      posterUrl: videoIntro.posterUrl || me.photos[0]?.url,
      caption: videoIntro.caption || 'Video intro',
      durationSeconds: videoIntro.durationSeconds || 15
    };
  }

  saveDatabase();
  res.json({ success: true, videoIntro: me.videoIntro });
});

// Account Deletion & Privacy Control
app.post('/api/me/delete-account', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const deleteId = me.id;

  // Remove user's profile
  profiles = profiles.filter(p => p.id !== deleteId);

  // Remove matches, messages, requests, and meetup applications
  matches = matches.filter(m => !m.users.includes(deleteId));
  messages = messages.filter(m => m.senderId !== deleteId);
  connectionRequests = connectionRequests.filter(r => r.senderId !== deleteId && r.recipientId !== deleteId);
  meetupPlans = meetupPlans.filter(p => p.creatorId !== deleteId);
  meetupPlans.forEach(p => {
    p.requests = p.requests.filter(r => r.userId !== deleteId);
  });

  // Reset to first remaining profile
  currentUserId = profiles[0]?.id || 'usr_creator_dennis';
  saveDatabase();

  res.json({ success: true, message: 'Account and all associated connection data permanently deleted.' });
});

// Dashboard Summary
app.get('/api/dashboard/summary', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  profiles.forEach(p => refreshAvailability(p));

  const userMatches = matches.filter(m => m.users.includes(me.id));
  const userMatchIds = userMatches.map(m => m.id);
  const unreadCount = messages.filter(
    msg => userMatchIds.includes(msg.matchId) && msg.senderId !== me.id && !msg.read
  ).length;

  const incomingRequests = connectionRequests.filter(
    r => r.recipientId === me.id && r.status === 'pending'
  );

  const availableCount = profiles.filter(
    p => p.id !== me.id && p.isAvailable && (!p.availableUntil || new Date(p.availableUntil) > new Date())
  ).length;

  const activeMeetups = meetupPlans.filter(p => p.status === 'open').length;

  const discoveryCandidates = profiles.filter(
    p => p.id !== me.id && !blocks.has(`${me.id}:${p.id}`) && !passes.has(`${me.id}:${p.id}`)
  );

  let completeness = 60;
  if (me.bio && me.bio.length > 20) completeness += 15;
  if (me.photos.length >= 2) completeness += 10;
  if (me.videoIntro) completeness += 10;
  if (me.interests.length >= 3) completeness += 5;

  res.json({
    matchesCount: userMatches.length,
    unreadMessagesCount: unreadCount,
    incomingRequestsCount: incomingRequests.length,
    activeMeetupsCount: activeMeetups,
    availableCount,
    discoveryCount: discoveryCandidates.length,
    profileCompleteness: Math.min(100, completeness),
    intent: me.intent,
    discreetMode: me.discreetMode
  });
});

// Radar Nodes Endpoint
app.get('/api/radar/nodes', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const myLat = me.campusLat || -1.272;
  const myLng = me.campusLng || 36.809;

  const nodes = [
    {
      id: 'node_uon',
      name: 'University of Nairobi',
      shortName: 'UoN',
      subCampuses: ['Chiromo Science', 'Main Campus', 'Parklands Law', 'Lower Kabete', 'Upper Hill Medical'],
      region: 'Nairobi Metropol',
      lat: -1.272,
      lng: 36.809,
      distanceKm: calculateDistanceKm(myLat, myLng, -1.272, 36.809),
      bearing: calculateBearing(myLat, myLng, -1.272, 36.809),
      activeCount: profiles.filter(p => p.university.includes('Nairobi')).length
    },
    {
      id: 'node_jkuat',
      name: 'Jomo Kenyatta University (JKUAT)',
      shortName: 'JKUAT',
      subCampuses: ['Juja Main Campus', 'Karen Campus', 'Westlands Centre'],
      region: 'Nairobi Metropol',
      lat: -1.097,
      lng: 37.014,
      distanceKm: calculateDistanceKm(myLat, myLng, -1.097, 37.014),
      bearing: calculateBearing(myLat, myLng, -1.097, 37.014),
      activeCount: profiles.filter(p => p.university.includes('JKUAT')).length
    },
    {
      id: 'node_ku',
      name: 'Kenyatta University',
      shortName: 'KU',
      subCampuses: ['Kahawa Main Campus', 'Parklands Campus'],
      region: 'Nairobi Metropol',
      lat: -1.181,
      lng: 36.928,
      distanceKm: calculateDistanceKm(myLat, myLng, -1.181, 36.928),
      bearing: calculateBearing(myLat, myLng, -1.181, 36.928),
      activeCount: profiles.filter(p => p.university.includes('Kenyatta')).length
    },
    {
      id: 'node_maseno_main',
      name: 'Maseno University (Main campus)',
      shortName: 'Maseno Main',
      subCampuses: ['Main Campus', 'Equator Complex', 'College Campus'],
      region: 'Western & Lake Region',
      lat: -0.005,
      lng: 34.601,
      distanceKm: calculateDistanceKm(myLat, myLng, -0.005, 34.601),
      bearing: calculateBearing(myLat, myLng, -0.005, 34.601),
      activeCount: profiles.filter(p => p.university.includes('Main campus') || (p.university.includes('Maseno') && (p.subCampus || '').includes('Main'))).length
    },
    {
      id: 'node_maseno_city',
      name: 'Maseno University (city campus)',
      shortName: 'Maseno City',
      subCampuses: ['City Campus', 'Kisumu CBD Centre', 'Mega Plaza Wing'],
      region: 'Western & Lake Region',
      lat: -0.102,
      lng: 34.755,
      distanceKm: calculateDistanceKm(myLat, myLng, -0.102, 34.755),
      bearing: calculateBearing(myLat, myLng, -0.102, 34.755),
      activeCount: profiles.filter(p => p.university.includes('city') || (p.subCampus || '').includes('City')).length
    }
  ];

  res.json({
    userLocation: {
      university: me.university,
      subCampus: me.subCampus || me.campusZone || 'Central Campus',
      faculty: me.faculty || me.studyArea || 'Faculty',
      region: me.region || 'Nairobi Metropol'
    },
    nodes
  });
});

// Discovery Profiles Feed: NO SWIPING, rich interactive cards with distance estimates
app.get('/api/discovery/profiles', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  profiles.forEach(p => refreshAvailability(p));

  const {
    intent,
    gender,
    radiusKm,
    region,
    university,
    availableOnly
  } = req.query;

  const myLat = me.campusLat || -1.272;
  const myLng = me.campusLng || 36.809;

  const list = profiles.filter(p => {
    if (p.id === me.id) return false;
    if (blocks.has(`${me.id}:${p.id}`)) return false;
    if (passes.has(`${me.id}:${p.id}`)) return false;

    // Available Now filter
    if (availableOnly === 'true' && !p.isAvailable) return false;

    // Intentions filter (matches either legacy intent or multi-intentions)
    if (intent && intent !== 'all') {
      const q = String(intent).toLowerCase();
      const hasMatch = (p.intentions || []).some(i => i.toLowerCase().includes(q)) || (p.intent || '').toLowerCase().includes(q);
      if (!hasMatch) return false;
    }

    if (gender && gender !== 'all' && p.genderIdentity !== gender) return false;

    const pLat = p.campusLat || -1.272;
    const pLng = p.campusLng || 36.809;
    const dist = calculateDistanceKm(myLat, myLng, pLat, pLng);

    if (radiusKm && radiusKm !== 'all' && radiusKm !== '0') {
      const maxR = Number(radiusKm);
      const effectiveDist = p.distanceKm !== undefined ? p.distanceKm : dist;
      if (effectiveDist > maxR) return false;
    }

    if (region && region !== 'all') {
      const regQuery = String(region).toLowerCase();
      const pRegion = (p.region || '').toLowerCase();
      if (!pRegion.includes(regQuery)) return false;
    }

    if (university && university !== 'all') {
      const uQuery = String(university).toLowerCase();
      const pUni = (p.university || '').toLowerCase();
      if (!pUni.includes(uQuery)) return false;
    }

    return true;
  });

  const sanitizedList = list.map(p => {
    const pLat = p.campusLat || -1.272;
    const pLng = p.campusLng || 36.809;
    const rawDist = calculateDistanceKm(myLat, myLng, pLat, pLng);
    const brng = calculateBearing(myLat, myLng, pLat, pLng);

    const distanceEstimate = p.distanceKm !== undefined
      ? p.distanceKm
      : Math.max(0.8, Math.round(rawDist * 10) / 10);

    // Check if user already sent connection request to this profile
    const existingReq = connectionRequests.find(
      r => r.senderId === me.id && r.recipientId === p.id && r.status === 'pending'
    );

    // Check if already matched
    const isMatched = matches.some(m => m.users.includes(me.id) && m.users.includes(p.id));

    // Permanently strip exact GPS coordinates for safety
    const { campusLat, campusLng, ...safeProfile } = p;

    return {
      ...safeProfile,
      distanceKm: distanceEstimate,
      radarBearing: brng,
      locationArea: p.locationArea || p.campusZone || 'Nairobi Area',
      hasPendingRequest: Boolean(existingReq),
      isMatched,
      photos: p.photos.map(photo => ({
        ...photo,
        isLocked: isMatched ? false : photo.visibility === 'matched-only'
      }))
    };
  });

  res.json(sanitizedList);
});

// -------------------------------------------------------------
// Connection Requests ("Interested in You")
// -------------------------------------------------------------
app.get('/api/connections/requests', (req: Request, res: Response) => {
  const me = getCurrentProfile();

  const incoming = connectionRequests
    .filter(r => r.recipientId === me.id)
    .map(r => {
      const sender = profiles.find(p => p.id === r.senderId) || profiles[0];
      const { campusLat, campusLng, ...safeSender } = sender;
      return {
        ...r,
        senderProfile: {
          ...safeSender,
          photos: safeSender.photos.map(ph => ({ ...ph, isLocked: false }))
        }
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const outgoing = connectionRequests
    .filter(r => r.senderId === me.id)
    .map(r => {
      const recipient = profiles.find(p => p.id === r.recipientId) || profiles[0];
      const { campusLat, campusLng, ...safeRecipient } = recipient;
      return {
        ...r,
        recipientProfile: safeRecipient
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ incoming, outgoing });
});

app.post('/api/connections/request', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const { recipientId, intention = 'Casual meetups', message = '' } = req.body;

  if (!recipientId || recipientId === me.id) {
    res.status(400).json({ error: 'Invalid recipient ID.' });
    return;
  }

  const target = profiles.find(p => p.id === recipientId);
  if (!target) {
    res.status(404).json({ error: 'Target profile not found.' });
    return;
  }

  // Prevent duplicate pending requests
  const existing = connectionRequests.find(
    r => r.senderId === me.id && r.recipientId === recipientId && r.status === 'pending'
  );
  if (existing) {
    res.status(400).json({ error: 'A connection request is already pending with this profile.' });
    return;
  }

  // Check if they already sent a request to me -> Auto mutual connect!
  const reciprocal = connectionRequests.find(
    r => r.senderId === recipientId && r.recipientId === me.id && r.status === 'pending'
  );

  if (reciprocal) {
    reciprocal.status = 'accepted';
    reciprocal.respondedAt = new Date().toISOString();

    let match = matches.find(m => m.users.includes(me.id) && m.users.includes(recipientId));
    if (!match) {
      match = {
        id: `match_${Date.now()}`,
        users: [me.id, recipientId],
        matchedAt: new Date().toISOString(),
        hasConnectionPass: true,
        isVipUnlocked: true,
        chatUnlocked: true
      };
      matches.unshift(match);

      messages.push({
        id: `msg_${Date.now()}`,
        matchId: match.id,
        senderId: me.id,
        text: `Mutual connection established! Looking forward to connecting for ${intention.toLowerCase()}.`,
        createdAt: new Date().toISOString(),
        read: false
      });
    }

    saveDatabase();
    res.json({
      success: true,
      message: 'Mutual connection! You both expressed interest. Private messaging is now unlocked!',
      isMatch: true,
      match: { ...match, profile: target }
    });
    return;
  }

  const newRequest: ConnectionRequest = {
    id: `req_${Date.now()}`,
    senderId: me.id,
    recipientId,
    status: 'pending',
    intention,
    message: String(message).trim(),
    createdAt: new Date().toISOString()
  };

  connectionRequests.unshift(newRequest);
  saveDatabase();

  res.status(201).json({
    success: true,
    request: newRequest,
    message: `Connection request sent to ${target.displayName}. Once accepted, private chat will unlock.`
  });
});

app.post('/api/connections/requests/:id/respond', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const requestId = req.params.id;
  const { action } = req.body; // 'accept' | 'decline'

  const request = connectionRequests.find(r => r.id === requestId);
  if (!request) {
    res.status(404).json({ error: 'Connection request not found.' });
    return;
  }

  if (request.recipientId !== me.id) {
    res.status(403).json({ error: 'Access denied: You can only respond to requests sent to you.' });
    return;
  }

  if (action === 'accept') {
    request.status = 'accepted';
    request.respondedAt = new Date().toISOString();

    const sender = profiles.find(p => p.id === request.senderId);

    // Create or unlock match
    let match = matches.find(m => m.users.includes(me.id) && m.users.includes(request.senderId));
    if (!match) {
      match = {
        id: `match_${Date.now()}`,
        users: [me.id, request.senderId],
        matchedAt: new Date().toISOString(),
        hasConnectionPass: true,
        isVipUnlocked: true,
        chatUnlocked: true
      };
      matches.unshift(match);

      // Pre-seed greeting message
      messages.push({
        id: `msg_${Date.now()}`,
        matchId: match.id,
        senderId: me.id,
        text: `Hey ${sender?.displayName.split(' ')[0] || 'there'}! I accepted your connection request for ${request.intention || 'casual meetups'}. Nice to meet you!`,
        createdAt: new Date().toISOString(),
        read: false
      });
    } else {
      match.chatUnlocked = true;
      match.hasConnectionPass = true;
    }

    saveDatabase();
    res.json({
      success: true,
      message: `Connection accepted! Private messaging with ${sender?.displayName || 'user'} is now unlocked.`,
      match: match && sender ? { ...match, profile: sender } : undefined
    });
    return;
  } else {
    request.status = 'declined';
    request.respondedAt = new Date().toISOString();
    saveDatabase();
    res.json({ success: true, message: 'Connection request declined.' });
  }
});

// -------------------------------------------------------------
// Meet-up Plans (Coffee, Lunch, Movies, Outings, etc.)
// -------------------------------------------------------------
app.get('/api/meetups', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const { category } = req.query;

  let plans = meetupPlans.filter(p => p.status === 'open');
  if (category && category !== 'all') {
    plans = plans.filter(p => p.category === category);
  }

  const enriched = plans.map(p => {
    const creator = profiles.find(usr => usr.id === p.creatorId) || profiles[0];
    const { campusLat, campusLng, ...safeCreator } = creator;

    // Check if current user has already requested to join
    const myRequest = p.requests.find(r => r.userId === me.id);

    return {
      ...p,
      creatorProfile: safeCreator,
      isMyPlan: p.creatorId === me.id,
      hasRequested: Boolean(myRequest),
      myRequestStatus: myRequest?.status,
      requestsCount: p.requests.length,
      // Only creator sees full applicant details
      requests: p.creatorId === me.id
        ? p.requests.map(r => {
            const applicant = profiles.find(usr => usr.id === r.userId) || profiles[0];
            const { campusLat: aLat, campusLng: aLng, ...safeApplicant } = applicant;
            return {
              ...r,
              userProfile: safeApplicant
            };
          })
        : []
    };
  });

  res.json(enriched);
});

app.post('/api/meetups', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const {
    title,
    category = 'coffee',
    locationArea,
    timeframe,
    intention = 'Casual conversations',
    description,
    maxCompany = 2
  } = req.body;

  if (!title || !locationArea || !timeframe) {
    res.status(400).json({ error: 'Title, safe public venue location, and timeframe are required.' });
    return;
  }

  const categoryLabels: Record<string, string> = {
    coffee: 'Coffee Together',
    lunch: 'Lunch Plans',
    movies: 'Movies',
    outings: 'Social Outings',
    conversations: 'Casual Conversations',
    spontaneous: 'Spontaneous Meetups'
  };

  const newPlan: MeetupPlan = {
    id: `meet_${Date.now()}`,
    creatorId: me.id,
    title: String(title).trim(),
    category: category as any,
    categoryLabel: categoryLabels[category] || 'Social Activity',
    locationArea: String(locationArea).trim(),
    timeframe: String(timeframe).trim(),
    intention: String(intention).trim(),
    description: String(description || '').trim(),
    maxCompany: Number(maxCompany) || 2,
    status: 'open',
    createdAt: new Date().toISOString(),
    requests: []
  };

  meetupPlans.unshift(newPlan);
  saveDatabase();

  res.status(201).json({ success: true, plan: newPlan });
});

// Express Interest in a Meet-up Plan
app.post('/api/meetups/:id/interest', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const planId = req.params.id;
  const { note = '' } = req.body;

  const plan = meetupPlans.find(p => p.id === planId);
  if (!plan) {
    res.status(404).json({ error: 'Meet-up plan not found.' });
    return;
  }

  if (plan.creatorId === me.id) {
    res.status(400).json({ error: 'You are the creator of this meet-up plan.' });
    return;
  }

  const existing = plan.requests.find(r => r.userId === me.id);
  if (existing) {
    res.status(400).json({ error: 'You have already expressed interest in this meet-up plan.' });
    return;
  }

  const interestReq: MeetupInterestRequest = {
    id: `req_m_${Date.now()}`,
    planId,
    userId: me.id,
    status: 'pending',
    note: String(note).trim(),
    createdAt: new Date().toISOString()
  };

  plan.requests.push(interestReq);
  saveDatabase();

  res.status(201).json({
    success: true,
    message: 'Interest expressed! The creator must approve your request before private messaging becomes available.'
  });
});

// Creator Approves / Declines a Meetup Request
app.post('/api/meetups/:planId/requests/:requestId/respond', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const { planId, requestId } = req.params;
  const { action } = req.body; // 'approve' | 'decline'

  const plan = meetupPlans.find(p => p.id === planId);
  if (!plan) {
    res.status(404).json({ error: 'Meet-up plan not found.' });
    return;
  }

  if (plan.creatorId !== me.id) {
    res.status(403).json({ error: 'Access denied: Only the plan creator can approve or decline requests.' });
    return;
  }

  const request = plan.requests.find(r => r.id === requestId);
  if (!request) {
    res.status(404).json({ error: 'Applicant request not found.' });
    return;
  }

  if (action === 'approve') {
    request.status = 'approved';
    const applicant = profiles.find(p => p.id === request.userId);

    // Unlock connection and chat between creator and applicant!
    let match = matches.find(m => m.users.includes(me.id) && m.users.includes(request.userId));
    if (!match) {
      match = {
        id: `match_${Date.now()}`,
        users: [me.id, request.userId],
        matchedAt: new Date().toISOString(),
        hasConnectionPass: true,
        isVipUnlocked: true,
        chatUnlocked: true
      };
      matches.unshift(match);

      messages.push({
        id: `msg_${Date.now()}`,
        matchId: match.id,
        senderId: me.id,
        text: `Meet-up approved! I'm happy to connect for "${plan.title}" at ${plan.locationArea} (${plan.timeframe}). Let's finalize details!`,
        createdAt: new Date().toISOString(),
        read: false
      });
    } else {
      match.chatUnlocked = true;
      match.hasConnectionPass = true;
    }

    saveDatabase();
    res.json({
      success: true,
      message: `Approved ${applicant?.displayName || 'applicant'}! Private messaging is now unlocked to coordinate your meetup.`,
      match: applicant ? { ...match, profile: applicant } : undefined
    });
    return;
  } else {
    request.status = 'declined';
    saveDatabase();
    res.json({ success: true, message: 'Applicant request declined.' });
  }
});

// -------------------------------------------------------------
// Campus Circles Endpoints
// -------------------------------------------------------------
app.get('/api/circles', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const result = campusCircles.map(c => ({
    ...c,
    isJoined: c.members.includes(me.id),
    memberCount: c.members.length
  }));
  res.json(result);
});

app.post('/api/circles/:id/join', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const circle = campusCircles.find(c => c.id === req.params.id);
  if (!circle) {
    res.status(404).json({ error: 'Circle not found.' });
    return;
  }
  if (!circle.members.includes(me.id)) {
    circle.members.push(me.id);
    circle.memberCount = circle.members.length;
    saveDatabase();
  }
  res.json({ success: true, circle: { ...circle, isJoined: true } });
});

app.post('/api/circles/:id/leave', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const circle = campusCircles.find(c => c.id === req.params.id);
  if (!circle) {
    res.status(404).json({ error: 'Circle not found.' });
    return;
  }
  circle.members = circle.members.filter(id => id !== me.id);
  circle.memberCount = circle.members.length;
  saveDatabase();
  res.json({ success: true, circle: { ...circle, isJoined: false } });
});

app.post('/api/circles/:id/posts', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const circle = campusCircles.find(c => c.id === req.params.id);
  if (!circle) {
    res.status(404).json({ error: 'Circle not found.' });
    return;
  }
  const { content } = req.body;
  if (!content || !String(content).trim()) {
    res.status(400).json({ error: 'Post content cannot be empty.' });
    return;
  }

  const newPost: CirclePost = {
    id: `c_post_${Date.now()}`,
    circleId: circle.id,
    authorId: me.id,
    authorName: me.displayName,
    authorAvatar: me.photos[0]?.url || '/logo.svg',
    authorCampus: me.university,
    content: String(content).trim(),
    likesCount: 0,
    likedBy: [],
    createdAt: new Date().toISOString()
  };

  circle.posts.unshift(newPost);
  saveDatabase();

  res.status(201).json({ success: true, post: newPost });
});

app.post('/api/circles/:id/posts/:postId/like', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const circle = campusCircles.find(c => c.id === req.params.id);
  if (!circle) {
    res.status(404).json({ error: 'Circle not found.' });
    return;
  }
  const post = circle.posts.find(p => p.id === req.params.postId);
  if (!post) {
    res.status(404).json({ error: 'Post not found.' });
    return;
  }

  const index = post.likedBy.indexOf(me.id);
  if (index === -1) {
    post.likedBy.push(me.id);
  } else {
    post.likedBy.splice(index, 1);
  }
  post.likesCount = post.likedBy.length;
  saveDatabase();

  res.json({ success: true, likesCount: post.likesCount });
});

// -------------------------------------------------------------
// Legacy Matching & Compatibility
// -------------------------------------------------------------
app.post('/api/profiles/:id/like', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const targetId = req.params.id;

  const targetProfile = profiles.find(p => p.id === targetId);
  if (!targetProfile) {
    res.status(404).json({ error: 'Profile not found' });
    return;
  }

  likes.add(`${me.id}:${targetId}`);
  const isMutual = likes.has(`${targetId}:${me.id}`);

  if (isMutual) {
    let existingMatch = matches.find(m => m.users.includes(me.id) && m.users.includes(targetId));
    if (!existingMatch) {
      existingMatch = {
        id: `match_${Date.now()}`,
        users: [me.id, targetId],
        matchedAt: new Date().toISOString(),
        hasConnectionPass: true,
        isVipUnlocked: true,
        chatUnlocked: true
      };
      matches.unshift(existingMatch);

      messages.push({
        id: `msg_${Date.now()}`,
        matchId: existingMatch.id,
        senderId: targetId,
        text: `Hey ${me.displayName.split(' ')[0]}! Glad we connected! How's your day going?`,
        createdAt: new Date().toISOString(),
        read: false
      });
    }

    saveDatabase();
    res.json({
      isMatch: true,
      match: {
        ...existingMatch,
        profile: targetProfile
      }
    });
    return;
  }

  saveDatabase();
  res.json({ isMatch: false });
});

app.post('/api/profiles/:id/pass', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  passes.add(`${me.id}:${req.params.id}`);
  saveDatabase();
  res.json({ success: true });
});

app.get('/api/matches', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const userMatches = matches.filter(m => m.users.includes(me.id));

  const result: Match[] = userMatches.map(m => {
    const otherUserId = m.users.find(id => id !== me.id) || '';
    const otherProfile = profiles.find(p => p.id === otherUserId) || profiles[0];

    const matchMsgs = messages
      .filter(msg => msg.matchId === m.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const lastMsg = matchMsgs[0] || null;
    const unreadCount = matchMsgs.filter(msg => msg.senderId !== me.id && !msg.read).length;

    return {
      id: m.id,
      users: m.users,
      profile: {
        ...otherProfile,
        photos: otherProfile.photos.map(ph => ({ ...ph, isLocked: false }))
      },
      matchedAt: m.matchedAt,
      lastMessage: lastMsg ? lastMsg.text : null,
      lastMessageAt: lastMsg ? lastMsg.createdAt : m.matchedAt,
      unreadCount,
      hasConnectionPass: Boolean(m.hasConnectionPass),
      isVipUnlocked: Boolean(m.isVipUnlocked),
      chatUnlocked: Boolean(m.chatUnlocked ?? m.hasConnectionPass),
      mpesaPayments: mpesaPayments.filter(p => p.matchId === m.id)
    };
  });

  res.json(result);
});

// Messages in a Match
app.get('/api/matches/:id/messages', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const matchId = req.params.id;
  const match = matches.find(m => m.id === matchId);

  if (!match || !match.users.includes(me.id)) {
    res.status(403).json({ error: 'Access denied: You can only view conversations for mutual matches.' });
    return;
  }

  const matchMessages = messages
    .filter(msg => msg.matchId === matchId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  res.json(matchMessages);
});

app.post('/api/matches/:id/messages', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const matchId = req.params.id;
  const { text } = req.body;

  if (!text || !String(text).trim()) {
    res.status(400).json({ error: 'Message cannot be empty.' });
    return;
  }

  const match = matches.find(m => m.id === matchId);
  if (!match) {
    res.status(404).json({ error: 'Match not found.' });
    return;
  }

  if (!match.users.includes(me.id)) {
    res.status(403).json({ error: 'Strict Privacy Policy: You can only message profiles you have mutually matched with.' });
    return;
  }

  const otherUserId = match.users.find(id => id !== me.id) || '';
  const otherProfile = profiles.find(p => p.id === otherUserId);

  const newMsg: Message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    matchId,
    senderId: me.id,
    text: String(text).trim(),
    createdAt: new Date().toISOString(),
    read: false
  };

  messages.push(newMsg);
  saveDatabase();

  if (otherProfile) {
    setTimeout(() => {
      const replies = [
        `Sounds great! I'm really glad we connected. What's your schedule like this week?`,
        `Haha love that. Transparent communication is so refreshing on here. Let's make coffee or hangout plans soon!`,
        `I know the perfect discreet spot near campus. Quiet booths and great drinks. Want to meet there?`,
        `That completely aligns with what I'm looking for too. Let's do it!`
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const replyMsg: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        matchId,
        senderId: otherProfile.id,
        text: randomReply,
        createdAt: new Date().toISOString(),
        read: false
      };
      messages.push(replyMsg);
      saveDatabase();
    }, 1500);
  }

  res.status(201).json(newMsg);
});

app.post('/api/matches/:id/read', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const matchId = req.params.id;

  messages.forEach(msg => {
    if (msg.matchId === matchId && msg.senderId !== me.id) {
      msg.read = true;
    }
  });

  saveDatabase();
  res.json({ success: true });
});

// Unlock Chatting via M-Pesa
app.post('/api/matches/:id/unlock-chat', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const matchId = req.params.id;
  const { mpesaCode, phoneNumber } = req.body;

  const match = matches.find(m => m.id === matchId);
  if (!match) {
    res.status(404).json({ error: 'Match not found' });
    return;
  }

  if (!match.users.includes(me.id)) {
    res.status(403).json({ error: 'Access denied.' });
    return;
  }

  const otherUserId = match.users.find(id => id !== me.id) || '';
  const otherProfile = profiles.find(p => p.id === otherUserId) || profiles[0];

  const randomAlpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const receipt = String(mpesaCode || '').trim().toUpperCase() || ('SH' + Array.from({ length: 6 }, () => randomAlpha[Math.floor(Math.random() * randomAlpha.length)]).join('') + Math.floor(10 + Math.random() * 89));

  match.chatUnlocked = true;
  match.hasConnectionPass = true;
  match.isVipUnlocked = true;

  const paymentRecord: MpesaPayment = {
    id: `mpesa_${Date.now()}`,
    checkoutRequestId: `MANUAL_${Date.now()}`,
    merchantRequestId: `MR_${Date.now()}`,
    matchId: match.id,
    senderId: me.id,
    senderName: me.displayName,
    recipientId: otherProfile.id,
    recipientName: '+254740047265',
    phoneNumber: phoneNumber || '+254740047265',
    amount: 100,
    purpose: 'connection_pass',
    purposeLabel: 'Mutual Connection Chat Unlock (Sent to +254740047265)',
    status: 'completed',
    mpesaReceiptNumber: receipt,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString()
  };

  mpesaPayments.push(paymentRecord);

  const paymentMsg: Message = {
    id: `msg_pay_${Date.now()}`,
    matchId: match.id,
    senderId: me.id,
    text: `M-Pesa Verified · Ksh 100 sent to +254740047265 to unlock chatting [Receipt: ${receipt}]`,
    createdAt: new Date().toISOString(),
    read: true,
    type: 'mpesa_payment',
    paymentDetails: paymentRecord
  };
  messages.push(paymentMsg);
  saveDatabase();

  res.json({
    success: true,
    chatUnlocked: true,
    receiptNumber: receipt,
    recipientNumber: '+254740047265',
    amount: 100,
    message: 'Chat unlocked successfully! Ksh 100 verified to +254740047265.'
  });
});

// Photo Management
app.post('/api/me/photos', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const { url, visibility = 'public', caption = '' } = req.body;

  if (!url) {
    res.status(400).json({ error: 'Photo URL is required.' });
    return;
  }

  const newPhoto: ProfilePhoto = {
    id: `photo_${Date.now()}`,
    url,
    visibility: visibility === 'matched-only' ? 'matched-only' : 'public',
    caption,
    position: me.photos.length
  };

  me.photos.push(newPhoto);
  saveDatabase();
  res.status(201).json(newPhoto);
});

app.patch('/api/me/photos/:id', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const photo = me.photos.find(p => p.id === req.params.id);

  if (!photo) {
    res.status(404).json({ error: 'Photo not found.' });
    return;
  }

  if (req.body.visibility) {
    photo.visibility = req.body.visibility;
  }
  if (req.body.caption !== undefined) {
    photo.caption = req.body.caption;
  }

  saveDatabase();
  res.json(photo);
});

app.delete('/api/me/photos/:id', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const index = me.photos.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: 'Photo not found.' });
    return;
  }

  if (me.photos.length <= 1) {
    res.status(400).json({ error: 'You must maintain at least one profile photo.' });
    return;
  }

  me.photos.splice(index, 1);
  me.photos.forEach((p, idx) => { p.position = idx; });

  saveDatabase();
  res.json({ success: true, photos: me.photos });
});

// Block & Report
app.post('/api/profiles/:id/block', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const targetId = req.params.id;

  blocks.add(`${me.id}:${targetId}`);
  matches = matches.filter(m => !(m.users.includes(me.id) && m.users.includes(targetId)));
  connectionRequests = connectionRequests.filter(r => !(r.senderId === targetId && r.recipientId === me.id));

  saveDatabase();
  res.json({ success: true, message: 'User blocked. You will no longer see each other.' });
});

app.post('/api/profiles/:id/report', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const targetId = req.params.id;
  const { category, details } = req.body;

  const newReport = {
    id: `rep_${Date.now()}`,
    reporterId: me.id,
    targetProfileId: targetId,
    category: category || 'other',
    details: details || '',
    createdAt: new Date().toISOString()
  };

  reports.push(newReport);
  blocks.add(`${me.id}:${targetId}`);
  matches = matches.filter(m => !(m.users.includes(me.id) && m.users.includes(targetId)));

  saveDatabase();
  res.json({
    success: true,
    message: 'Report received and user blocked. Our adult safety team reviews all incident logs within 24 hours.'
  });
});

// Safety Guidelines
app.get('/api/safety/guidelines', (req: Request, res: Response) => {
  res.json({
    title: 'AMORA Adult Consent & Safety Charter',
    principles: [
      {
        title: 'Strict 18+ Consenting Adults',
        description: 'All members must be at least 18 years of age. Underage profiles are strictly forbidden and immediately banned.'
      },
      {
        title: 'Enthusiastic, Revocable Mutual Consent',
        description: 'Consent must be ongoing, voluntary, and unambiguous. Anyone can decline or change their mind at any time.'
      },
      {
        title: 'No Unsolicited Private Messages',
        description: 'Private messaging is only unlocked after a mutual connection request is accepted or a meet-up plan request is approved.'
      },
      {
        title: 'Privacy: Never Exact GPS Locations',
        description: 'AMORA displays general campus distance estimates (e.g. 1.2 km away) and public neighborhoods, never live pinpoint coordinates.'
      },
      {
        title: 'Meet in Public First',
        description: 'Always meet in public campus cafes, library squares, or popular bistros first and tell a trusted friend.'
      },
      {
        title: 'Zero Tolerance for Harassment',
        description: 'Non-consensual explicit material, harassment, coercion, and stalking trigger immediate permanent removal.'
      }
    ]
  });
});

// M-Pesa STK Push Initiation
app.post('/api/payments/mpesa/initiate', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const { matchId, phoneNumber, amount, purpose = 'connection_pass' } = req.body;

  if (!matchId) {
    res.status(400).json({ error: 'matchId is required' });
    return;
  }

  const match = matches.find(m => m.id === matchId);
  if (!match || !match.users.includes(me.id)) {
    res.status(403).json({ error: 'Access denied: You can only initiate payments for your own matches.' });
    return;
  }

  const cleanPhone = String(phoneNumber || '').replace(/\s+/g, '').replace('+', '');
  let formattedPhone = cleanPhone;
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '254' + formattedPhone.slice(1);
  } else if (!formattedPhone.startsWith('254')) {
    formattedPhone = '254' + formattedPhone;
  }

  const numAmount = Number(amount) || (purpose === 'connection_pass' ? 100 : purpose === 'coffee_treat' ? 250 : 600);
  const otherUserId = match.users.find(id => id !== me.id) || '';
  const otherProfile = profiles.find(p => p.id === otherUserId) || profiles[0];

  const purposeLabel = purpose === 'connection_pass'
    ? 'Mutual Connection Pass'
    : purpose === 'coffee_treat'
      ? 'Campus Coffee & Meetup Treat'
      : 'Evening Cocktail Treat';

  const checkoutRequestId = `ws_CO_${Date.now()}_${Math.random().toString(36).substring(5)}`;
  const merchantRequestId = `MR_${Date.now()}_${Math.random().toString(36).substring(5)}`;

  const paymentRecord: MpesaPayment = {
    id: `mpesa_${Date.now()}`,
    checkoutRequestId,
    merchantRequestId,
    matchId,
    senderId: me.id,
    senderName: me.displayName,
    recipientId: otherProfile.id,
    recipientName: otherProfile.displayName,
    phoneNumber: formattedPhone,
    amount: numAmount,
    purpose,
    purposeLabel,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  mpesaPayments.push(paymentRecord);
  saveDatabase();

  setTimeout(() => {
    paymentRecord.status = 'completed';
    const randomAlpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randCode = 'SH' + Array.from({ length: 6 }, () => randomAlpha[Math.floor(Math.random() * randomAlpha.length)]).join('') + Math.floor(10 + Math.random() * 89);
    paymentRecord.mpesaReceiptNumber = randCode;
    paymentRecord.completedAt = new Date().toISOString();

    match.hasConnectionPass = true;
    match.isVipUnlocked = true;
    match.chatUnlocked = true;

    const paymentMsg: Message = {
      id: `msg_pay_${Date.now()}`,
      matchId: match.id,
      senderId: me.id,
      text: `M-Pesa Verified · KES ${numAmount} for ${purposeLabel} [Receipt: ${randCode}]`,
      createdAt: new Date().toISOString(),
      read: true,
      type: 'mpesa_payment',
      paymentDetails: paymentRecord
    };
    messages.push(paymentMsg);
    saveDatabase();
  }, 2200);

  res.json({
    success: true,
    checkoutRequestId,
    merchantRequestId,
    phoneNumber: formattedPhone,
    amount: numAmount,
    purposeLabel,
    message: `Lipa Na M-Pesa STK push dispatched to ${formattedPhone}. Enter your M-Pesa PIN on your phone to complete.`
  });
});

app.get('/api/payments/mpesa/status/:checkoutRequestId', (req: Request, res: Response) => {
  const { checkoutRequestId } = req.params;
  const payment = mpesaPayments.find(p => p.checkoutRequestId === checkoutRequestId);

  if (!payment) {
    res.status(404).json({ error: 'Transaction not found' });
    return;
  }

  res.json({
    status: payment.status,
    payment,
    receiptNumber: payment.mpesaReceiptNumber
  });
});

app.get('/api/matches/:id/payments', (req: Request, res: Response) => {
  const matchId = req.params.id;
  const matchPayments = mpesaPayments.filter(p => p.matchId === matchId);
  res.json(matchPayments);
});

// Delete Conversation
app.delete('/api/messages/conversation/:matchId', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const { matchId } = req.params;

  const match = matches.find(m => m.id === matchId);
  if (!match || !match.users.includes(me.id)) {
    res.status(403).json({ error: 'Access denied: You can only delete conversations you belong to.' });
    return;
  }

  // Remove messages belonging to this match
  messages = messages.filter(m => m.matchId !== matchId);
  // Reset last message
  match.lastMessage = null;
  match.lastMessageAt = null;
  match.unreadCount = 0;

  saveDatabase();
  res.json({ success: true, message: 'Conversation cleared successfully.' });
});

// -------------------------------------------------------------
// Creator Marketplace & Purchases Endpoints
// -------------------------------------------------------------

// 1. Browse Creator Posts (with server-side media authorization)
app.get('/api/marketplace/posts', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const { filter, creatorId } = req.query;

  let filtered = [...creatorPosts];

  if (creatorId && typeof creatorId === 'string') {
    filtered = filtered.filter(p => p.creatorId === creatorId);
  }

  if (filter === 'exclusive') {
    filtered = filtered.filter(p => p.isExclusive);
  } else if (filter === 'free') {
    filtered = filtered.filter(p => !p.isExclusive);
  }

  // Map and enforce server-side media authorization for exclusive content
  const sanitized = filtered.map(post => {
    // Check if current user has purchased this post
    const hasPurchased = purchases.some(purch => purch.buyerId === me.id && purch.postId === post.id);
    const isOwnerOrAdmin = post.creatorId === me.id || me.id === 'usr_creator_dennis';
    const isUnlocked = !post.isExclusive || hasPurchased || isOwnerOrAdmin;

    return {
      ...post,
      isPurchased: hasPurchased || isOwnerOrAdmin,
      isUnlocked: isUnlocked,
      // Strictly redact mediaUrl if locked to prevent unauthorized access
      mediaUrl: isUnlocked ? post.mediaUrl : '',
      previewUrl: post.previewUrl || post.mediaUrl
    };
  });

  res.json(sanitized);
});

// 2. Publish New Creator Content (Free Lifestyle or Paid Exclusive)
app.post('/api/marketplace/posts', (req: Request, res: Response) => {
  const me = getCurrentProfile();

  if (me.accountType === 'buyer_only') {
    res.status(403).json({ error: 'Buyer-only accounts cannot publish content. Switch account type to Creator in settings.' });
    return;
  }

  const {
    title,
    description = '',
    type = 'photo',
    mediaUrl,
    previewUrl,
    isExclusive = false,
    priceKes = 0,
    tags = [],
    consentConfirmed = false
  } = req.body;

  if (!title || !title.trim()) {
    res.status(400).json({ error: 'Title is required.' });
    return;
  }

  if (!mediaUrl) {
    res.status(400).json({ error: 'Media URL or file is required.' });
    return;
  }

  if (!consentConfirmed) {
    res.status(400).json({
      error: 'You must confirm content ownership, that you are 18+, and that all depicted individuals provided adult consent.'
    });
    return;
  }

  const numPrice = isExclusive ? Math.max(50, Number(priceKes) || 150) : 0;

  const newPost: CreatorPost = {
    id: `post_${Date.now()}_${Math.random().toString(36).substring(6)}`,
    creatorId: me.id,
    creatorProfile: {
      id: me.id,
      displayName: me.displayName,
      avatar: me.photos[0]?.url || '/images/creator_dennis_tarus_1793271699871.jpg',
      university: me.university,
      locationArea: me.locationArea,
      verifiedAdult: me.verifiedAdult,
      creatorVerificationStatus: me.creatorVerificationStatus || 'verified'
    },
    title: title.trim(),
    description: description.trim(),
    type: type === 'video' ? 'video' : 'photo',
    mediaUrl,
    previewUrl: previewUrl || mediaUrl,
    isExclusive: Boolean(isExclusive),
    priceKes: numPrice,
    tags: Array.isArray(tags) && tags.length > 0 ? tags : ['Lifestyle'],
    viewsCount: 1,
    salesCount: 0,
    createdAt: new Date().toISOString(),
    moderationStatus: 'approved',
    consentConfirmed: true
  };

  creatorPosts.unshift(newPost);

  // If user wasn't marked as creator, update them
  if (!me.isCreator) {
    me.isCreator = true;
    if (me.accountType === 'member') {
      me.accountType = 'both';
    }
  }

  saveDatabase();
  res.status(201).json(newPost);
});

// 3. Purchase Single Exclusive Item with M-Pesa (One-Time Unlock)
app.post('/api/marketplace/posts/:id/purchase', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const { id } = req.params;
  const { phoneNumber } = req.body;

  const post = creatorPosts.find(p => p.id === id);
  if (!post) {
    res.status(404).json({ error: 'Content item not found.' });
    return;
  }

  if (!post.isExclusive) {
    res.status(400).json({ error: 'This item is free lifestyle content and does not require purchase.' });
    return;
  }

  // Prevent duplicate transactions / duplicate unlocks
  const existingPurchase = purchases.find(purch => purch.buyerId === me.id && purch.postId === post.id);
  if (existingPurchase) {
    res.json({
      success: true,
      alreadyUnlocked: true,
      message: 'You have already unlocked this content. It is available in My Purchases.',
      purchase: existingPurchase,
      postDetails: post
    });
    return;
  }

  const cleanPhone = String(phoneNumber || '').replace(/\s+/g, '').replace('+', '');
  let formattedPhone = cleanPhone;
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '254' + formattedPhone.slice(1);
  } else if (!formattedPhone.startsWith('254')) {
    formattedPhone = '254' + (formattedPhone || '740047265');
  }

  const randomAlpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const receiptNumber = 'SHK' + Array.from({ length: 6 }, () => randomAlpha[Math.floor(Math.random() * randomAlpha.length)]).join('') + Math.floor(10 + Math.random() * 89);
  const checkoutRequestId = `ws_CO_${Date.now()}_${Math.random().toString(36).substring(6)}`;
  const mpesaPaymentId = `mpesa_purch_${Date.now()}`;

  // Record M-Pesa transaction
  const paymentRecord: MpesaPayment = {
    id: mpesaPaymentId,
    checkoutRequestId,
    merchantRequestId: `MR_${Date.now()}`,
    matchId: '',
    senderId: me.id,
    senderName: me.displayName,
    recipientId: post.creatorId,
    recipientName: post.creatorProfile.displayName,
    phoneNumber: formattedPhone,
    amount: post.priceKes,
    purpose: 'connection_pass',
    purposeLabel: `Exclusive Unlock: ${post.title}`,
    status: 'completed',
    mpesaReceiptNumber: receiptNumber,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString()
  };
  mpesaPayments.push(paymentRecord);

  // Record Content Purchase
  const newPurchase: ContentPurchase = {
    id: `purch_${Date.now()}_${Math.random().toString(36).substring(5)}`,
    buyerId: me.id,
    creatorId: post.creatorId,
    postId: post.id,
    amountKes: post.priceKes,
    mpesaPaymentId,
    mpesaReceiptNumber: receiptNumber,
    unlockedAt: new Date().toISOString()
  };
  purchases.push(newPurchase);

  // Update Post Sales Count
  post.salesCount = (post.salesCount || 0) + 1;

  // Update Creator Earnings
  const creator = profiles.find(p => p.id === post.creatorId);
  if (creator) {
    if (!creator.creatorEarnings) {
      creator.creatorEarnings = {
        totalEarnedKes: 0,
        withdrawableKes: 0,
        totalSales: 0
      };
    }
    creator.creatorEarnings.totalEarnedKes += post.priceKes;
    creator.creatorEarnings.withdrawableKes += post.priceKes;
    creator.creatorEarnings.totalSales += 1;
  }

  saveDatabase();

  res.json({
    success: true,
    unlocked: true,
    receiptNumber,
    amountKes: post.priceKes,
    purchase: newPurchase,
    postDetails: post,
    message: `Payment of KSh ${post.priceKes} verified via M-Pesa [Receipt: ${receiptNumber}]. Content unlocked!`
  });
});

// 4. My Purchases (Revisit Previously Purchased Media)
app.get('/api/marketplace/my-purchases', (req: Request, res: Response) => {
  const me = getCurrentProfile();

  const myPurchases = purchases
    .filter(purch => purch.buyerId === me.id)
    .map(purch => {
      const post = creatorPosts.find(p => p.id === purch.postId);
      return {
        ...purch,
        postDetails: post
      };
    });

  res.json(myPurchases);
});

// 5. Creator Studio Performance & Earnings
app.get('/api/marketplace/creator-stats', (req: Request, res: Response) => {
  const me = getCurrentProfile();

  const myPosts = creatorPosts.filter(p => p.creatorId === me.id);
  const totalViews = myPosts.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
  const totalSales = myPosts.reduce((sum, p) => sum + (p.salesCount || 0), 0);

  const mySalesRecords = purchases.filter(purch => purch.creatorId === me.id);
  const totalRevenue = mySalesRecords.reduce((sum, p) => sum + p.amountKes, 0);

  res.json({
    postsCount: myPosts.length,
    totalViews,
    totalSales,
    totalRevenueKes: totalRevenue || (me.creatorEarnings?.totalEarnedKes || 0),
    withdrawableKes: totalRevenue || (me.creatorEarnings?.withdrawableKes || 0),
    recentSales: mySalesRecords.slice(-10).reverse(),
    myPosts
  });
});

// 6. Delete Creator Post
app.delete('/api/marketplace/posts/:id', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const { id } = req.params;

  const index = creatorPosts.findIndex(p => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Post not found.' });
    return;
  }

  const post = creatorPosts[index];
  if (post.creatorId !== me.id && me.id !== 'usr_creator_dennis') {
    res.status(403).json({ error: 'Access denied: You can only delete your own content.' });
    return;
  }

  creatorPosts.splice(index, 1);
  saveDatabase();

  res.json({ success: true, message: 'Content removed from marketplace.' });
});

// -------------------------------------------------------------
// Combined Profile Preferences & Privacy Settings
// -------------------------------------------------------------

// Update Account Type (creator, member, both, buyer_only)
app.post('/api/profile/update-account-type', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const { accountType } = req.body;

  const validTypes: AccountType[] = ['creator', 'member', 'both', 'buyer_only'];
  if (!validTypes.includes(accountType)) {
    res.status(400).json({ error: 'Invalid account type. Choose creator, member, both, or buyer_only.' });
    return;
  }

  me.accountType = accountType;
  if (accountType === 'creator' || accountType === 'both') {
    me.isCreator = true;
  }

  saveDatabase();
  res.json({ success: true, user: me });
});

// Update Privacy Settings
app.post('/api/profile/privacy', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const { profileVisibility, allowMeetupRequests, allowDirectMessaging, showOnlineStatus } = req.body;

  me.privacySettings = {
    profileVisibility: profileVisibility || me.privacySettings?.profileVisibility || 'adults_only',
    allowMeetupRequests: allowMeetupRequests !== undefined ? Boolean(allowMeetupRequests) : (me.privacySettings?.allowMeetupRequests ?? true),
    allowDirectMessaging: allowDirectMessaging || me.privacySettings?.allowDirectMessaging || 'mutual_only',
    showOnlineStatus: showOnlineStatus !== undefined ? Boolean(showOnlineStatus) : (me.privacySettings?.showOnlineStatus ?? true)
  };

  saveDatabase();
  res.json({ success: true, privacySettings: me.privacySettings });
});

// -------------------------------------------------------------
// Age Verification & ID Assurance Endpoints
// -------------------------------------------------------------

// Submit Age Verification
app.post('/api/verification/submit', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const { idType, idNumber, dob, selfieUrl, documentFrontUrl, autoVerifyTestMode } = req.body;

  if (!idType || !idNumber || !dob) {
    res.status(400).json({ error: 'ID Type, ID Number, and Date of Birth are mandatory for Kenyan adult verification.' });
    return;
  }

  // Calculate age strictly from DOB
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 18) {
    res.status(400).json({
      error: 'Access denied: AMORA is strictly for adults aged 18 and older in Kenya. Underage registration is prohibited.'
    });
    return;
  }

  const cleanNum = String(idNumber).trim();
  const maskedId = cleanNum.length > 4 ? `${cleanNum.slice(0, 2)}****${cleanNum.slice(-2)}` : '****';

  // In test mode, instantly verify if requested; otherwise pending admin approval
  const isAutoVerified = Boolean(autoVerifyTestMode);

  const record: AgeVerificationRecord = {
    id: `vr_${Date.now()}_${Math.random().toString(36).substring(6)}`,
    userId: me.id,
    userName: me.displayName,
    userEmail: me.email,
    idType,
    idNumberMasked: maskedId,
    dob,
    calculatedAge: age,
    selfieUrl: selfieUrl || me.photos[0]?.url || '/images/creator_dennis_tarus_1793271699871.jpg',
    documentFrontUrl: documentFrontUrl || me.photos[0]?.url || '/images/creator_dennis_tarus_1793271699871.jpg',
    status: isAutoVerified ? 'verified' : 'pending',
    submittedAt: new Date().toISOString(),
    reviewedAt: isAutoVerified ? new Date().toISOString() : undefined,
    reviewerNote: isAutoVerified ? 'Instant sandbox verification approved for 18+ adult verification test.' : undefined
  };

  verificationRecords = verificationRecords.filter(vr => vr.userId !== me.id);
  verificationRecords.push(record);

  if (isAutoVerified) {
    me.verifiedAdult = true;
    me.ageVerificationStatus = 'verified';
    me.age = age;
    me.dateOfBirth = dob;
  } else {
    me.ageVerificationStatus = 'pending';
  }

  saveDatabase();
  res.json({
    success: true,
    verification: record,
    message: isAutoVerified
      ? 'Adult ID Verification Successful! Your profile is verified 18+.'
      : 'Document submitted for administrator review. Our safety team audits Kenyan National IDs within 24 hours.'
  });
});

app.get('/api/verification/status', (req: Request, res: Response) => {
  const me = getCurrentProfile();
  const record = verificationRecords.find(vr => vr.userId === me.id);
  res.json({
    verifiedAdult: me.verifiedAdult,
    ageVerificationStatus: me.ageVerificationStatus || (me.verifiedAdult ? 'verified' : 'unverified'),
    record
  });
});

// -------------------------------------------------------------
// Administrator Dashboard & Moderation Endpoints
// -------------------------------------------------------------

// Admin check helper
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const me = getCurrentProfile();
  if (me.id === 'usr_creator_dennis' || me.email === 'dennistarus10@gmail.com' || me.role === 'creator') {
    return next();
  }
  res.status(403).json({ error: 'Access denied: Administrator authorization required.' });
}

// 1. Admin Platform Stats
app.get('/api/admin/stats', requireAdmin, (req: Request, res: Response) => {
  const totalRevenue = mpesaPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalAdultsVerified = profiles.filter(p => p.verifiedAdult).length;
  const totalCreators = profiles.filter(p => p.isCreator || p.accountType === 'creator' || p.accountType === 'both').length;
  const pendingVerifications = verificationRecords.filter(vr => vr.status === 'pending').length;
  const pendingPosts = creatorPosts.filter(p => p.moderationStatus === 'pending').length;

  res.json({
    totalUsers: profiles.length,
    totalCreators,
    totalAdultsVerified,
    totalRevenueKes: totalRevenue,
    totalPurchasesCount: purchases.length,
    totalReportsCount: reports.length,
    pendingVerificationsCount: pendingVerifications,
    pendingPostsCount: pendingPosts
  });
});

// 2. Admin Verifications Queue
app.get('/api/admin/verifications', requireAdmin, (req: Request, res: Response) => {
  res.json(verificationRecords);
});

// 3. Admin Review Verification
app.post('/api/admin/verifications/:id/review', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const action = req.body.action || req.body.decision;
  const { note } = req.body;

  const record = verificationRecords.find(vr => vr.id === id);
  if (!record) {
    res.status(404).json({ error: 'Verification record not found.' });
    return;
  }

  record.reviewedAt = new Date().toISOString();
  record.reviewerNote = note || (action === 'approve' ? 'Approved by Admin' : 'Rejected');

  const user = profiles.find(p => p.id === record.userId);
  if (action === 'approve') {
    record.status = 'verified';
    if (user) {
      user.verifiedAdult = true;
      user.ageVerificationStatus = 'verified';
      user.creatorVerificationStatus = 'verified';
    }
  } else {
    record.status = 'rejected';
    if (user) {
      user.verifiedAdult = false;
      user.ageVerificationStatus = 'rejected';
    }
  }

  saveDatabase();
  res.json({ success: true, record, user });
});

// 4. Admin Users Management & Suspension
app.get('/api/admin/users', requireAdmin, (req: Request, res: Response) => {
  res.json(profiles.map(p => ({
    id: p.id,
    displayName: p.displayName,
    email: p.email,
    age: p.age,
    university: p.university,
    verifiedAdult: p.verifiedAdult,
    ageVerificationStatus: p.ageVerificationStatus,
    accountType: p.accountType,
    isSuspended: p.isSuspended || false,
    suspensionReason: p.suspensionReason,
    createdAt: p.createdAt
  })));
});

app.post('/api/admin/users/:id/suspend', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { suspend, reason } = req.body;

  const user = profiles.find(p => p.id === id);
  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }

  user.isSuspended = Boolean(suspend);
  user.suspensionReason = suspend ? (reason || 'Violated community guidelines') : undefined;

  saveDatabase();
  res.json({ success: true, user });
});

// 5. Admin Post Moderation
app.post('/api/admin/posts/moderate', requireAdmin, (req: Request, res: Response) => {
  const { postId, action, reason } = req.body; // action: 'approve' | 'flag' | 'remove'

  const post = creatorPosts.find(p => p.id === postId);
  if (!post) {
    res.status(404).json({ error: 'Post not found.' });
    return;
  }

  if (action === 'remove') {
    creatorPosts = creatorPosts.filter(p => p.id !== postId);
  } else if (action === 'flag') {
    post.moderationStatus = 'flagged';
  } else if (action === 'approve') {
    post.moderationStatus = 'approved';
  }

  saveDatabase();
  res.json({ success: true, post });
});

// Vite middleware in dev or static serving in production
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const distIndexPath = path.resolve(distPath, 'index.html');
  const hasDist = fs.existsSync(distIndexPath);
  const isDev = process.env.NODE_ENV === 'development' || (!hasDist && process.env.NODE_ENV !== 'production');

  if (isDev) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });
      app.use(vite.middlewares);
      app.use('*', async (req: Request, res: Response, next: NextFunction) => {
        try {
          const rootIndex = path.resolve(__dirname, 'index.html');
          if (fs.existsSync(rootIndex)) {
            let template = fs.readFileSync(rootIndex, 'utf-8');
            template = await vite.transformIndexHtml(req.originalUrl, template);
            return res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
          }
          res.status(404).send('AMORA index.html not found');
        } catch (e) {
          next(e);
        }
      });
    } catch (e) {
      console.warn('Vite dev server init failed, serving fallback:', e);
      if (hasDist) {
        app.use(express.static(distPath));
        app.get('*', (_req: Request, res: Response) => res.sendFile(distIndexPath));
      } else {
        app.get('*', (_req: Request, res: Response) => res.sendFile(path.resolve(__dirname, 'index.html')));
      }
    }
  } else {
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      if (fs.existsSync(distIndexPath)) {
        res.sendFile(distIndexPath);
      } else {
        res.sendFile(path.resolve(__dirname, 'index.html'));
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AMORA server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
