import { Review } from "@/types";

export const reviews: Review[] = [
  {
    id: "r1",
    reviewerId: "c3",
    revieweeId: "a2",
    reviewerName: "Sharma Family Sangeet",
    reviewerAvatar: "https://i.pravatar.cc/800?img=41",
    rating: 5,
    comment: "Priya's performance was absolutely magical. She kept the entire crowd engaged and the traditional pieces were flawlessly executed.",
    date: "2024-05-06T10:00:00Z",
    bookingId: "b3"
  },
  {
    id: "r2",
    reviewerId: "c4",
    revieweeId: "a9",
    reviewerName: "Laugh Club Jaipur",
    reviewerAvatar: "https://i.pravatar.cc/800?img=42",
    rating: 4,
    comment: "Rohan had everyone in splits! Good crowd work. Started a bit late but made up for it with extra time.",
    date: "2024-03-26T14:30:00Z",
    bookingId: "b4"
  },
  {
    id: "r3",
    reviewerId: "c5",
    revieweeId: "a1",
    reviewerName: "Independent Filmmakers Co.",
    reviewerAvatar: "https://picsum.photos/seed/ifc/200/200",
    rating: 5,
    comment: "Aarav is a director's actor. Very cooperative and brought layers to the character that weren't even on the page.",
    date: "2024-03-12T09:15:00Z",
    bookingId: "b6"
  },
  {
    id: "r4",
    reviewerId: "c9",
    revieweeId: "a10",
    reviewerName: "Netflix India Localization",
    reviewerAvatar: "https://picsum.photos/seed/netflix/200/200",
    rating: 4,
    comment: "Isha nailed the emotional beats for the lead character. Will surely work with her again.",
    date: "2024-03-23T11:00:00Z",
    bookingId: "b10"
  },
  {
    id: "r5",
    reviewerId: "c13",
    revieweeId: "a4",
    reviewerName: "Oakridge School",
    reviewerAvatar: "https://picsum.photos/seed/oakridge/200/200",
    rating: 5,
    comment: "Neha was fantastic with the kids. They learned a complex routine in just three days!",
    date: "2024-03-14T16:20:00Z",
    bookingId: "b14"
  },
  {
    id: "r6",
    reviewerId: "c16",
    revieweeId: "a9",
    reviewerName: "BITS Pilani",
    reviewerAvatar: "https://picsum.photos/seed/bits/200/200",
    rating: 4,
    comment: "Great set suitable for young crowds.",
    date: "2024-02-15T12:00:00Z",
    bookingId: "b17"
  },
  // Pad the rest of the reviews to hit 20
  ...Array.from({ length: 14 }).map((_, i) => ({
    id: `r${i + 7}`,
    reviewerId: `c${i + 20}`,
    revieweeId: `a${(i % 5) + 1}`,
    reviewerName: `Client ${i + 20}`,
    reviewerAvatar: `https://randomuser.me/api/portraits/lego/${(i % 9) + 1}.jpg`,
    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
    comment: `Very professional and delivered as promised. Highly recommended for any event.`,
    date: new Date(Date.now() - (i + 30) * 86400000).toISOString(),
    bookingId: `b${i + 20}`
  }))
];
