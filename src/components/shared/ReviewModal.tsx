"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  artistName: string;
}

export default function ReviewModal({ isOpen, onClose, onSubmit, artistName }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, comment);
    // Reset state for next time
    setRating(0);
    setHoverRating(0);
    setComment("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#1f1f1f] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Rate your experience</DialogTitle>
          <DialogDescription className="text-gray-400">
            How was working with {artistName}? Your feedback helps the community.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 py-4">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110 focus:outline-none"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  className={`w-10 h-10 ${
                    (hoverRating || rating) >= star 
                      ? "fill-[#00A8E1] text-[#00A8E1] drop-shadow-[0_0_8px_rgba(0,168,225,0.5)]" 
                      : "text-gray-600"
                  }`} 
                />
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">Leave a comment <span className="text-gray-500">(Optional)</span></label>
            <Textarea 
              id="comment"
              placeholder="Write about what you liked or how they could improve..."
              className="bg-[#141414] border-white/10 text-white resize-none h-24 focus-visible:ring-[#00A8E1]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-white/5 text-gray-300">
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            disabled={rating === 0}
            className="bg-[#00A8E1] text-white hover:bg-[#0082B4] disabled:opacity-50"
          >
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
