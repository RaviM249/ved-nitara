import { ShieldCheck } from "lucide-react";

interface SubscriptionBadgeProps {
  className?: string;
}

export default function SubscriptionBadge({ className = "" }: SubscriptionBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#00A8E1] to-[#0082B4] px-2.5 py-0.5 text-xs font-medium text-white shadow-[0_0_10px_rgba(0,168,225,0.3)] ${className}`}>
      <ShieldCheck className="h-3.5 w-3.5 stroke-[2.5px]" />
      <span>Verified</span>
    </div>
  );
}
