import { Payment } from "@/types";

export const payments: Payment[] = [
  {
    id: "pay1",
    userId: "a1",
    userName: "Aarav Sharma",
    plan: "MONTHLY",
    amount: 99,
    status: "SUCCESS",
    date: "2024-03-15T10:20:00Z",
    razorpayOrderId: "pay_xyz123abc456"
  },
  {
    id: "pay2",
    userId: "s2",
    userName: "FTII",
    plan: "ANNUAL",
    amount: 999,
    status: "SUCCESS",
    date: "2024-02-01T14:15:00Z",
    razorpayOrderId: "pay_abc987xyz654"
  },
  {
    id: "pay3",
    userId: "p1",
    userName: "Dharma Productions",
    plan: "ANNUAL",
    amount: 999,
    status: "SUCCESS",
    date: "2023-11-20T09:00:00Z",
    razorpayOrderId: "pay_def123ghi789"
  },
  {
    id: "pay4",
    userId: "a3",
    userName: "Vikram Singh",
    plan: "MONTHLY",
    amount: 99,
    status: "FAILED",
    date: "2024-03-10T16:30:00Z",
    razorpayOrderId: "pay_failed_txn1"
  },
  {
    id: "pay5",
    userId: "a4",
    userName: "Neha Gupta",
    plan: "MONTHLY",
    amount: 99,
    status: "REFUNDED",
    date: "2024-03-05T11:45:00Z",
    razorpayOrderId: "pay_refund_txn2"
  },
  // Generate 15 more dummy records...
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `pay${i + 6}`,
    userId: `u${i + 10}`,
    userName: `Mock User ${i + 10}`,
    plan: i % 3 === 0 ? "ANNUAL" as const : "MONTHLY" as const,
    amount: i % 3 === 0 ? 999 : 99,
    status: Math.random() > 0.1 ? "SUCCESS" as const : "FAILED" as const,
    date: new Date(Date.now() - (i * 2) * 86400000).toISOString(),
    razorpayOrderId: `pay_mock_${i}_${Date.now()}`
  }))
];
