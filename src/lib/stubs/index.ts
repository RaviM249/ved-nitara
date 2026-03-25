import { artists } from "../mockData/artists";
import { schools } from "../mockData/schools";
import { productionHouses } from "../mockData/productionHouses";
import { facultyRequirements } from "../mockData/facultyRequirements";
import { bookings } from "../mockData/bookings";
import { messages } from "../mockData/messages";
import { notifications } from "../mockData/notifications";
import { reviews } from "../mockData/reviews";
import { payments } from "../mockData/payments";

// Utility to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAuthHeaders = () => {
  if (typeof window === "undefined") return { "Content-Type": "application/json" };
  const token = localStorage.getItem("auth-token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
};

export const api = {
  // GET /api/talent
  getArtists: async (filters?: any) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/talent${query ? `?${query}` : ""}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      return data.talents || [];
    } catch(err) {
      console.error("Fetch artists failed:", err);
      return [];
    }
  },

  // TODO: Replace with API call - GET /api/v1/artists/:id
  getArtistById: async (id: string) => {
    await delay(500);
    return artists.find(a => a.id === id);
  },

  // TODO: Replace with API call - GET /api/v1/schools
  getSchools: async () => {
    await delay(800);
    return schools;
  },

  // TODO: Replace with API call - GET /api/v1/client
  getProductionHouses: async () => {
    await delay(800);
    return productionHouses;
  },

  // TODO: Replace with API call - GET /api/v1/schools/requirements
  getFacultyRequirements: async () => {
    await delay(800);
    return facultyRequirements;
  },

  // TODO: Replace with API call - POST /api/v1/schools/requirements
  postRequirement: async (data: any) => {
    await delay(1000);
    return { success: true, message: "Requirement posted successfully." };
  },

  // TODO: Replace with API call - GET /api/v1/bookings
  getBookings: async () => {
    await delay(800);
    return bookings;
  },

  // TODO: Replace with API call - POST /api/v1/bookings
  createBooking: async (data: any) => {
    await delay(1000);
    return { success: true, message: "Your request has been sent. Artist will confirm within 24 hours." };
  },

  // TODO: Replace with API call - GET /api/v1/messages/conversations
  getConversations: async () => {
    await delay(600);
    return messages; // Simplified for mock
  },

  // TODO: Replace with API call - POST /api/v1/messages/:receiverId
  sendMessage: async (data: any) => {
    await delay(500);
    return { success: true, message: "Message sent." };
  },

  // TODO: Replace with API call - GET /api/v1/notifications
  getNotifications: async () => {
    await delay(500);
    return notifications;
  },

  // TODO: Replace with API call - GET /api/v1/reviews/user/:userId
  getReviews: async (userId?: string) => {
    await delay(600);
    if(userId) return reviews.filter(r => r.revieweeId === userId);
    return reviews;
  },

  // TODO: Replace with API call - POST /api/v1/reviews
  submitReview: async (data: any) => {
    await delay(800);
    return { success: true, message: "Review submitted." };
  },

  // TODO: Replace with API call - GET /api/v1/admin/payments
  getPayments: async () => {
    await delay(1000);
    return payments;
  },

  // POST /api/auth/register
  register: async (data: any) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // POST /api/auth/login
  login: async (data: any) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // GET /api/auth/me
  getMe: async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // GET /api/talent/profile
  getTalentProfile: async () => {
    try {
      const res = await fetch("/api/talent/profile", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // GET /api/client/profile
  getClientProfile: async () => {
    try {
      const res = await fetch("/api/client/profile", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // GET /api/casting-calls
  getCastingCalls: async () => {
    try {
      const res = await fetch("/api/casting-calls", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      return data.jobs || [];
    } catch(err) {
      console.error("Fetch casting calls failed:", err);
      return [];
    }
  },

  // TODO: Replace with API call - POST /api/v1/payment/create-subscription
  createSubscription: async (data: any) => {
    await delay(1500);
    return { success: true, subscription_id: "razorpay_sub_mock", message: "Subscription activated." };
  },

  // TODO: Replace with API call - POST /api/v1/client/shortlist
  addToShortlist: async (artistId: string, projectName?: string) => {
    await delay(600);
    return { success: true, message: "Added to shortlist." };
  },
  
  // TODO: Replace with API call - POST /api/v1/artists/faculty-opportunities/:id/apply
  applyForFaculty: async (reqId: string) => {
    await delay(800);
    return { success: true, message: "Application submitted successfully." };
  },

  // TODO: Replace with API call - POST /api/v1/bookings/artists/:artistId
  bookArtist: async (artistId: string, data: any) => {
    await delay(1200);
    return { success: true, bookingId: `booking_${Date.now()}`, message: "Booking request sent successfully." };
  },

  // TODO: Replace with API call - PUT /api/v1/artists/profile
  updateProfile: async (userId: string, data: any) => {
    await delay(800);
    return { success: true, message: "Profile updated successfully." };
  }
};
