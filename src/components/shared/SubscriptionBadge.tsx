import { ShieldCheck } from "lucide-react";

interface SubscriptionBadgeProps {
  className?: string;
}

export default function SubscriptionBadge({ className = "" }: SubscriptionBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#E50914] to-[#b80710] px-2.5 py-0.5 text-xs font-medium text-white shadow-[0_0_10px_rgba(229,9,20,0.3)] ${className}`}>
      <ShieldCheck className="h-3.5 w-3.5 stroke-[2.5px]" />
      <span>Verified</span>
    </div>
  );
}
