import { Artist } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Star, ShieldCheck } from "lucide-react";
import SubscriptionBadge from "./SubscriptionBadge";
import Link from "next/link";

interface ArtistCardProps {
  artist: Artist;
  onShortlist?: (artistId: string) => void;
  basePath?: string;
  profileUrl?: string;
}

export default function ArtistCard({ artist, onShortlist, basePath = "/production", profileUrl }: ArtistCardProps) {
  return (
    <Card className="group overflow-hidden bg-[#1f1f1f] border-white/5 hover:border-white/20 transition-all duration-300 hover-blue-glow">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={artist.profilePhoto} 
          alt={artist.name} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/20 to-transparent opacity-80" />
        
        <div className="absolute top-3 left-3 flex gap-1 flex-wrap pr-12">
          {artist.roles.slice(0, 2).map(role => (
            <Badge key={role} variant="secondary" className="bg-black/50 backdrop-blur-md text-white border-white/10 hover:bg-black/70">
              {role}
            </Badge>
          ))}
        </div>

        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          {artist.isVerified && (
            <div className="bg-[#00A8E1] text-white p-1 rounded-full shadow-[0_0_10px_rgba(0,168,225,0.5)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex justify-between items-end mb-1">
            <h3 className="font-display text-2xl tracking-wide text-white leading-none">
              {artist.name}
            </h3>
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-[#00A8E1] text-[#00A8E1]" />
              <span className="text-sm font-medium text-white">{artist.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="flex items-center text-gray-400 text-sm mb-3">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {artist.city}, {artist.state}
          </div>

          <div className="flex items-center justify-between gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <Link href={profileUrl || `${basePath}/artist/${artist.id}`} className="w-full">
              <Button size="sm" className="w-full bg-white text-black hover:bg-gray-200">
                View Profile
              </Button>
            </Link>
            {onShortlist && (
              <Button 
                size="sm" 
                variant="outline" 
                className="px-3 border-white/20 hover:bg-white/10"
                onClick={(e) => {
                  e.preventDefault();
                  onShortlist(artist.id);
                }}
              >
                Save
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-[#1f1f1f]">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {artist.skills.slice(0, 3).map(skill => (
            <span key={skill} className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5">
              {skill}
            </span>
          ))}
          {artist.skills.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-500 border border-white/5">
              +{artist.skills.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 pt-1">
            <div className={`w-2 h-2 rounded-full ${artist.availability ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500 shadow-[0_0_8px_#ef4444]"}`} />
            <span className="text-gray-400">
              {artist.availability ? "Available Now" : "Currently Busy"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
