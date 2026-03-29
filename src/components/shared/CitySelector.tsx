"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { INDIAN_LOCATIONS } from "@/lib/constants/locations";
import { MapPin, Search, ChevronDown, Check } from "lucide-react";

interface CitySelectorProps {
  field: any; // from react-hook-form
  form: any;  // from react-hook-form
  placeholder: string;
}

export function CitySelector({ field, form, placeholder }: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(field.value || "");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredLocations = INDIAN_LOCATIONS.filter(loc => 
    loc.city.toLowerCase().includes(search.toLowerCase()) ||
    loc.state.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 10); // Limit results for performance

  const handleSelect = (city: string, state: string) => {
    const value = `${city}, ${state}`;
    setSearch(value);
    form.setValue("city", city);
    form.setValue("state", state);
    setIsOpen(false);
    setIsFocused(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasValue = search !== "";
  const showPlaceholder = !isFocused && !hasValue;

  return (
    <div className="relative w-full group" ref={containerRef}>
      <MapPin className={cn(
        "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 transition-colors duration-300 z-10",
        (isFocused || hasValue) && "text-[#00A8E1]"
      )} />
      
      <AnimatePresence>
        {showPlaceholder && (
          <motion.span
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="absolute top-1/2 -translate-y-1/2 left-11 pointer-events-none text-gray-400 text-sm z-10"
          >
            {placeholder}
          </motion.span>
        )}
      </AnimatePresence>

      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          setIsOpen(true);
          setIsFocused(true);
        }}
        autoComplete="off"
        className="bg-black/20 border-white/10 text-white h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#00A8E1]/50 focus-visible:border-[#00A8E1]/40 transition-all pl-11 pr-10" 
      />

      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform duration-300", isOpen && "rotate-180")} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc, i) => (
                  <button
                    key={`${loc.city}-${loc.state}-${i}`}
                    type="button"
                    onClick={() => handleSelect(loc.city, loc.state)}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between group/item transition-colors"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{loc.city}</p>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{loc.state}</p>
                    </div>
                    {search === `${loc.city}, ${loc.state}` && (
                      <Check className="h-4 w-4 text-[#00A8E1]" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center">
                  <p className="text-gray-500 text-sm">No cities found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
