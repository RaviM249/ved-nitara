export type Role = "TALENT" | "CLIENT" | "ADMIN";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export interface UserProfile {
  profilePicture?: string;
  phone?: string;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  bio?: string;
}

export interface TalentProfile {
  category: string;
  skills: string[];
  experienceYears: number;
  portfolio: {
    title: string;
    mediaUrl: string;
    type: "video" | "image" | "audio" | "document";
  }[];
  pricing?: {
    type: "per_project" | "per_hour" | "per_day";
    amount: number;
    currency: string;
  };
  availability: boolean;
}

export interface ClientProfile {
  companyName?: string;
}

export interface User {
  id: string; // Using frontend-friendly 'id' instead of '_id'
  name: string;
  email: string;
  password?: string;
  role: Role;
  isEmailVerified: boolean;
  isSubscribed: boolean;
  status: UserStatus;
  
  profile?: UserProfile;
  talentProfile?: TalentProfile;
  clientProfile?: ClientProfile;
  
  auth?: {
    lastLogin: string;
    loginProvider: "email" | "google";
  };
  
  timestamps?: {
    createdAt: string;
    updatedAt: string;
  };

  // Keep these for backward compatibility during refactoring
  avatar?: string;
  roles?: Role[]; // Some old code may still expect an array
}

export interface Subscription {
  status: "ACTIVE" | "EXPIRED" | "NONE";
}

// Artist types
export interface Artist {
  id: string;
  name: string;
  profilePhoto: string;
  coverPhoto: string;
  roles: string[]; // e.g. ["Actor", "Model"]
  city: string;
  state: string;
  languages: string[];
  bio: string;
  skills: string[];
  showreelUrl?: string; // YouTube link
  portfolioImages: string[];
  subscriptionStatus: "ACTIVE" | "EXPIRED";
  isVerified: boolean;
  profileViews: number;
  rating: number; // 1-5
  reviewCount: number;
  joinedDate: string;
  experience: string;
  availability: boolean;
  hourlyRate?: number;
}

// School types
export interface School {
  id: string;
  name: string;
  logo: string;
  city: string;
  type: string;
  coursesOffered: string[];
  facultyCount: number;
  studentsEnrolled: number;
  subscriptionStatus: "ACTIVE" | "EXPIRED";
  isVerified: boolean;
  contactEmail: string;
}

// Production House types
export interface ProductionHouse {
  id: string;
  name: string;
  logo: string;
  city: string;
  type: string;
  activeProjects: number;
  subscriptionStatus: "ACTIVE" | "EXPIRED";
  isVerified: boolean;
}

// Faculty Requirements
export interface FacultyRequirement {
  id: string;
  schoolId: string;
  schoolName: string;
  roleNeeded: string;
  subject: string;
  duration: "Short-term" | "Long-term" | "Project-based";
  budgetMin: number;
  budgetMax: number;
  city: string;
  description: string;
  postedDate: string;
  startDate?: string;
  requirements?: string[];
  isActive: boolean;
}

// Bookings
export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export interface Booking {
  id: string;
  artistId: string;
  clientId: string;
  eventType: string;
  eventDate: string;
  city: string;
  duration: number; // in hours
  amount: number;
  status: BookingStatus;
  clientName: string;
  clientRating?: number;
  artistRating?: number;
}

// Messages
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  conversationId: string;
}

// Notifications
export interface AppNotification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link: string;
}

// Reviews
export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  reviewerName: string;
  reviewerAvatar: string;
  reviewerRole?: string;
  rating: number;
  comment: string;
  date: string;
  bookingId: string;
}

// Payments
export type PaymentStatus = "SUCCESS" | "FAILED" | "REFUNDED";
export type PlanType = "MONTHLY" | "ANNUAL";
export interface Payment {
  id: string;
  userId: string;
  userName: string;
  plan: PlanType;
  amount: number;
  status: PaymentStatus;
  date: string;
  razorpayOrderId: string;
}
