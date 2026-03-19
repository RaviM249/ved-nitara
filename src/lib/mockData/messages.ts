import { Message } from "@/types";

export const messages: Message[] = [
  {
    id: "m1",
    conversationId: "conv1",
    senderId: "c1", // Client
    receiverId: "a1", // Aarav
    senderName: "Rahul Sharma",
    senderAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "Hi Aarav, looking to cast you for an upcoming digital ad. Are you available next week?",
    timestamp: "2024-03-18T10:00:00Z",
    isRead: true
  },
  {
    id: "m2",
    conversationId: "conv1",
    senderId: "a1",
    receiverId: "c1",
    senderName: "Aarav Sharma",
    senderAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
    content: "Hi Rahul! Yes, my calendar is open next week on Thursday and Friday. Can we discuss the script?",
    timestamp: "2024-03-18T10:15:00Z",
    isRead: true
  },
  {
    id: "m3",
    conversationId: "conv1",
    senderId: "c1",
    receiverId: "a1",
    senderName: "Rahul Sharma",
    senderAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "Perfect, I'll send over the details to your email. Let's lock Thursday.",
    timestamp: "2024-03-18T10:30:00Z",
    isRead: false
  },
  {
    id: "m4",
    conversationId: "conv2",
    senderId: "s1", // NSD
    receiverId: "a16", // Ravi Shankar
    senderName: "NSD Admin",
    senderAvatar: "https://picsum.photos/seed/nsd/200/200",
    content: "Dear Ravi, your profile looks great. Are you interested in our guest lecturer position?",
    timestamp: "2024-03-17T14:00:00Z",
    isRead: true
  },
  {
    id: "m5",
    conversationId: "conv2",
    senderId: "a16",
    receiverId: "s1",
    senderName: "Ravi Shankar",
    senderAvatar: "https://randomuser.me/api/portraits/men/16.jpg",
    content: "Thank you. Yes, I would love to contribute. I have attached my teaching resume in the previous application.",
    timestamp: "2024-03-17T15:20:00Z",
    isRead: false
  },
  {
    id: "m6",
    conversationId: "conv3",
    senderId: "p1", // Dharma
    receiverId: "a23", // Alia Bhatt
    senderName: "Dharma Casting",
    senderAvatar: "https://picsum.photos/seed/dharma/200/200",
    content: "Alia, block your dates for November. We have a narration next Monday.",
    timestamp: "2024-03-15T09:00:00Z",
    isRead: true
  },
  // Add 24 more dummy messages...
  ...Array.from({ length: 24 }).map((_, i) => ({
    id: `m${i + 7}`,
    conversationId: `conv${Math.floor(i / 3) + 4}`,
    senderId: `u${i}`,
    receiverId: `u${i + 1}`,
    senderName: `Mock User ${i}`,
    senderAvatar: `https://randomuser.me/api/portraits/men/${i+10}.jpg`,
    content: `This is a mock message content for message number ${i + 7}. Just checking availability and details.`,
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    isRead: Math.random() > 0.5
  }))
];
