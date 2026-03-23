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

export const api = {
  // TODO: Replace with API call - GET /api/v1/artists
  getArtists: async (filters?: any) => {
    await delay(800);
    // In a real app we would apply filters here
    return artists;
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

  // TODO: Replace with API call - POST /api/v1/auth/register
  register: async (data: any) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // TODO: Replace with API call - POST /api/v1/auth/login
  login: async (data: any) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
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
