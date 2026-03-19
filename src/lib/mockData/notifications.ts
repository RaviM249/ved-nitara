import { AppNotification } from "@/types";

export const notifications: AppNotification[] = [
  {
    id: "n1",
    type: "BOOKING_REQUEST",
    message: "You have a new booking request from Tata Motors for an Ad Shoot.",
    timestamp: "2024-03-18T09:30:00Z",
    isRead: false,
    link: "/artist/bookings"
  },
  {
    id: "n2",
    type: "MESSAGE",
    message: "Rahul Sharma sent you a message.",
    timestamp: "2024-03-18T10:00:00Z",
    isRead: false,
    link: "/artist/inbox"
  },
  {
    id: "n3",
    type: "FACULTY_MATCH",
    message: "New faculty opportunity matches your profile: Acting Coach at NSD.",
    timestamp: "2024-03-17T11:00:00Z",
    isRead: true,
    link: "/artist/faculty"
  },
  {
    id: "n4",
    type: "SUBSCRIPTION_EXPIRING",
    message: "Your Monthly subscription expires in 3 days. Renew now to avoid interruption.",
    timestamp: "2024-03-15T08:00:00Z",
    isRead: true,
    link: "/artist/subscription"
  },
  {
    id: "n5",
    type: "PROFILE_VIEW",
    message: "Dharma Productions viewed your profile.",
    timestamp: "2024-03-14T14:20:00Z",
    isRead: true,
    link: "/artist/dashboard"
  },
  {
    id: "n6",
    type: "REVIEW_RECEIVED",
    message: "You received a 5-star review from Sharma Family Sangeet.",
    timestamp: "2024-03-10T16:45:00Z",
    isRead: true,
    link: "/artist/reviews"
  },
  {
    id: "n7",
    type: "APPLICATION_UPDATE",
    message: "Your faculty application at FTII has been shortlisted.",
    timestamp: "2024-03-08T10:15:00Z",
    isRead: true,
    link: "/artist/faculty"
  },
  {
    id: "n8",
    type: "SYSTEM_ANNOUNCEMENT",
    message: "New feature: You can now add up to 10 showreel videos to your profile.",
    timestamp: "2024-03-05T09:00:00Z",
    isRead: true,
    link: "/artist/profile"
  },
  {
    id: "n9",
    type: "BOOKING_CONFIRMED",
    message: "YRF New Project has confirmed your booking for June 1st.",
    timestamp: "2024-03-01T12:30:00Z",
    isRead: true,
    link: "/artist/bookings"
  },
  {
    id: "n10",
    type: "VERIFICATION_APPROVED",
    message: "Congratulations! Your profile has been verified by the Admin.",
    timestamp: "2024-02-28T15:00:00Z",
    isRead: true,
    link: "/artist/profile"
  },
  // Add 5 more dummy notifications...
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `n${i + 11}`,
    type: "GENERAL",
    message: `This is an older notification regarding activity ${i + 1}.`,
    timestamp: new Date(Date.now() - (i + 10) * 86400000).toISOString(),
    isRead: true,
    link: "/dashboard"
  }))
];
