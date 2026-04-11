import { useAuthStore } from "@/lib/store/authStore";

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
    try {
      const data = await api.getArtists();
      return data.find((a: any) => a.id === id) || null;
    } catch(err) {
      return null;
    }
  },

  // POST /api/talent/[id]/view
  trackProfileView: async (artistId: string) => {
    try {
      // Intentionally swallow the response so it's fully silent metadata
      fetch(`/api/talent/${artistId}/view`, {
        method: "POST",
        headers: getAuthHeaders(),
      }).catch(() => {});
      return true;
    } catch(err) {
      return false;
    }
  },

  // TODO: Replace with API call - GET /api/v1/schools
  getSchools: async () => {
    await delay(800);
    return [];
  },

  // TODO: Replace with API call - GET /api/v1/client
  getProductionHouses: async () => {
    await delay(800);
    return [];
  },

  // getFacultyRequirements: calls /api/casting-calls
  getFacultyRequirements: async () => {
    try {
      const res = await fetch("/api/casting-calls", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      return data.jobs || [];
    } catch(err) {
      console.error("Fetch faculty requirements failed:", err);
      return [];
    }
  },

  updateApplicationStatus: async (applicationId: string, status: string) => {
    try {
      const res = await fetch(`/api/casting-calls/apply/${applicationId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return await res.json();
    } catch (err) {
      console.error("Update application status failed:", err);
      return { success: false, error: "Network error" };
    }
  },


  // POST /api/casting-calls
  postRequirement: async (data: any) => {
    try {
      const res = await fetch("/api/casting-calls", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // TODO: Replace with API call - GET /api/v1/bookings
  getBookings: async () => {
    await delay(800);
    return [];
  },

  // TODO: Replace with API call - POST /api/v1/bookings
  createBooking: async (data: any) => {
    await delay(1000);
    return { success: true, message: "Your request has been sent. Artist will confirm within 24 hours." };
  },

  getConversations: async () => {
    try {
      const res = await fetch(`/api/conversations?_t=${Date.now()}`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (res.status === 401 && typeof window !== "undefined") {
         useAuthStore.getState().logout();
         window.location.href = "/login";
         return [];
      }

      const data = await res.json();
      return data.conversations || [];

    } catch (err) {
      console.error("Fetch conversations failed:", err);
      return [];
    }
  },

  startConversation: async (partnerId: string) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ partnerId }),
      });
      return await res.json();
    } catch (err) {
      console.error("Start conversation failed:", err);
      return { success: false, error: "Failed to start conversation" };
    }
  },

  getMessages: async (conversationId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}&_t=${Date.now()}`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (res.status === 401 && typeof window !== "undefined") {
         useAuthStore.getState().logout();
         window.location.href = "/login";
         return [];
      }

      const data = await res.json();
      return data.messages || [];

    } catch (err) {
      console.error("Fetch messages failed:", err);
      return [];
    }
  },

  sendMessage: async (conversationId: string, content: string) => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ conversationId, content }),
      });
      return await res.json();
    } catch (err) {
      console.error("Send message failed:", err);
      return { success: false, error: "Failed to send message" };
    }
  },

  markMessagesRead: async (conversationId: string) => {
    try {
      const res = await fetch("/api/messages", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ conversationId }),
      });
      return await res.json();
    } catch (err) {
      console.error("Mark read failed:", err);
      return { success: false };
    }
  },



  // TODO: Replace with API call - GET /api/v1/reviews/user/:userId
  getReviews: async (userId?: string) => {
    await delay(600);
    return [];
  },

  // TODO: Replace with API call - POST /api/v1/reviews
  submitReview: async (data: any) => {
    await delay(800);
    return { success: true, message: "Review submitted." };
  },

  // TODO: Replace with API call - GET /api/v1/admin/payments
  getPayments: async () => {
    await delay(1000);
    return [];
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
      // Clear any stale token before attempting login
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token");
      }
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


  // POST /api/auth/send-otp
  sendOtp: async (data: { email: string }) => {
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch(err) {
      return { success: false, error: "Network error" };
    }
  },

  // POST /api/auth/forgot-password/send-otp
  forgotPasswordSendOtp: async (data: { email: string }) => {
    try {
      const res = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch(err) {
      return { success: false, error: "Network error" };
    }
  },

  // POST /api/auth/forgot-password/reset
  forgotPasswordReset: async (data: any) => {
    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch(err) {
      return { success: false, error: "Network error" };
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

  // PATCH /api/casting-calls/[id]
  updateCastingCall: async (id: string, data: any) => {
    try {
      const res = await fetch(`/api/casting-calls/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // DELETE /api/casting-calls/[id]
  deleteCastingCall: async (id: string) => {
    try {
      const res = await fetch(`/api/casting-calls/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
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

  // POST /api/casting-calls/apply
  applyToJob: async (castingCallId: string, message?: string) => {
    try {
      const res = await fetch("/api/casting-calls/apply", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ castingCallId, message }),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // PUT /api/talent/profile
  updateProfile: async (userId: string, data: any) => {
    try {
      const res = await fetch("/api/talent/profile", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // PUT /api/client/profile
  updateClientProfile: async (data: any) => {
    try {
      const res = await fetch("/api/client/profile", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // GET /api/admin/users
  getAdminUsers: async () => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      return data.users || [];
    } catch(err) {
      console.error("Fetch admin users failed:", err);
      return [];
    }
  },

  // PATCH /api/admin/verify
  verifyUser: async (userId: string, isVerified: boolean) => {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId, isVerified }),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // GET /api/admin/announcements
  getAnnouncements: async () => {
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      return data.announcements || [];
    } catch(err) {
      console.error("Fetch announcements failed:", err);
      return [];
    }
  },

  // POST /api/admin/announcements
  postAnnouncement: async (target: string, message: string) => {
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ target, message }),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // GET /api/notifications
  getNotifications: async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      return data.notifications || [];
    } catch(err) {
      console.error("Fetch notifications failed:", err);
      return [];
    }
  },

  // PATCH /api/notifications
  markNotificationsRead: async (notificationId?: string, markAll: boolean = false) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ notificationId, markAll }),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // PATCH /api/admin/users/:id
  suspendUser: async (userId: string, isSuspended: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ isSuspended }),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // DELETE /api/admin/users/:id
  deleteUser: async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // PATCH /api/user/account
  disableAccount: async (isDisabled: boolean) => {
    try {
      const res = await fetch("/api/user/account", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ isDisabled }),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  },

  // POST /api/upload/delete
  deleteImage: async (publicId: string) => {
    try {
      const res = await fetch("/api/upload/delete", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ publicId }),
      });
      return await res.json();
    } catch(err) {
      return { success: false, message: "Network error" };
    }
  }
};
