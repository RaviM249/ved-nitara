import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard() {
  return (
    <Card className="overflow-hidden bg-[#1f1f1f] border-white/5">
      <Skeleton className="w-full aspect-[4/5] rounded-none bg-white/5" />
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16 bg-white/10" />
          <Skeleton className="h-6 w-20 bg-white/10" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full bg-white/10" />
            <Skeleton className="h-4 w-24 bg-white/10" />
          </div>
        </div>
      </div>
    </Card>
  );
}
