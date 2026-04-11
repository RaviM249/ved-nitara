"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Check, ChevronDown, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { INDIAN_LOCATIONS } from "@/lib/constants/locations";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationSelectorProps {
  form?: any;
  stateFieldName?: string;
  cityFieldName?: string;
  className?: string;
  // Manual props for non-hook-form usage
  manualValue?: { state: string; city: string };
  onManualChange?: (values: { state: string; city: string }) => void;
}

const STATES = Array.from(new Set(INDIAN_LOCATIONS.map((loc) => loc.state))).sort();

export function LocationSelector({ 
  form, 
  stateFieldName = "state", 
  cityFieldName = "city",
  className,
  manualValue,
  onManualChange
}: LocationSelectorProps) {
  const selectedState = form ? form.watch(stateFieldName) : manualValue?.state;
  const selectedCity = form ? form.watch(cityFieldName) : manualValue?.city;

  const setValue = (field: string, value: string) => {
    if (form) {
      form.setValue(field, value);
    } else if (onManualChange) {
      const newState = field === stateFieldName ? value : (selectedState || "");
      const newCity = field === cityFieldName ? value : (selectedCity || "");
      onManualChange({ state: newState, city: newCity });
    }
  };

  const availableCities = useMemo(() => {
    if (!selectedState) return [];
    return INDIAN_LOCATIONS
      .filter((loc) => loc.state === selectedState)
      .map((loc) => loc.city)
      .sort();
  }, [selectedState]);

  const [isCityPopoverOpen, setIsCityPopoverOpen] = useState(false);
  const [citySearch, setCitySearch] = useState(selectedCity || "");

  // Sync citySearch with selectedCity when it changes from outside
  useEffect(() => {
    setCitySearch(selectedCity || "");
  }, [selectedCity]);

  // Filter cities for display based on search (citySearch)
  const filteredCities = useMemo(() => {
    const search = citySearch || "";
    if (!search) return availableCities;
    return availableCities.filter(city => 
      city.toLowerCase().includes(search.toLowerCase())
    );
  }, [availableCities, citySearch]);

  const StateLabel = <Label className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1 mb-2">State / UT</Label>;
  const CityLabel = <Label className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1 mb-2">City Name</Label>;

  const StateSelect = (
    <Select
      onValueChange={(value) => {
        setValue(stateFieldName, value);
        // Clear city if it doesn't belong to the new state
        const cityInNewState = INDIAN_LOCATIONS.find(l => l.city === selectedCity && l.state === value);
        if (!cityInNewState && selectedCity) {
          setValue(cityFieldName, "");
        }
      }}
      value={selectedState}
    >
      {form ? (
        <FormControl>
          <SelectTrigger className="w-full bg-black/20 border-white/10 text-white h-11 rounded-xl focus:ring-[#00A8E1]/50 focus:border-[#00A8E1]/40 transition-all">
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
        </FormControl>
      ) : (
        <SelectTrigger className="w-full bg-black/20 border-white/10 text-white h-11 rounded-xl focus:ring-[#00A8E1]/50 focus:border-[#00A8E1]/40 transition-all">
          <SelectValue placeholder="Select State" />
        </SelectTrigger>
      )}
      <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-60">
        {STATES.map((state) => (
          <SelectItem key={state} value={state} className="focus:bg-[#00A8E1]/20 focus:text-white cursor-pointer">
            {state}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const CityInputUI = (
    <Popover open={isCityPopoverOpen} onOpenChange={setIsCityPopoverOpen} modal={false}>
      <PopoverTrigger asChild nativeButton={false}>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <MapPin className={cn("h-4 w-4", selectedCity ? "text-[#00A8E1]" : "text-gray-500")} />
          </div>
          {form ? (
            <FormControl>
              <Input
                placeholder={selectedState ? "Type or select city..." : "Select state first"}
                disabled={!selectedState}
                value={selectedCity || ""}
                onFocus={() => {
                  if (selectedState) setIsCityPopoverOpen(true);
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent PopoverTrigger from toggling it closed
                  if (selectedState) setIsCityPopoverOpen(true);
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setCitySearch(val);
                  setValue(cityFieldName, val);
                  if (selectedState && !isCityPopoverOpen) setIsCityPopoverOpen(true);
                }}
                className={cn(
                  "bg-black/20 border-white/10 text-white h-11 pl-10 rounded-xl focus:ring-[#00A8E1]/50 focus:border-[#00A8E1]/40 transition-all",
                  !selectedState && "opacity-50 cursor-not-allowed"
                )}
              />
            </FormControl>
          ) : (
            <Input
              placeholder={selectedState ? "Type or select city..." : "Select state first"}
              disabled={!selectedState}
              value={selectedCity || ""}
              onFocus={() => {
                if (selectedState) setIsCityPopoverOpen(true);
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent PopoverTrigger from toggling it closed
                if (selectedState) setIsCityPopoverOpen(true);
              }}
              onChange={(e) => {
                const val = e.target.value;
                setCitySearch(val);
                setValue(cityFieldName, val);
                if (selectedState && !isCityPopoverOpen) setIsCityPopoverOpen(true);
              }}
              className={cn(
                "bg-black/20 border-white/10 text-white h-11 pl-10 rounded-xl focus:ring-[#00A8E1]/50 focus:border-[#00A8E1]/40 transition-all",
                !selectedState && "opacity-50 cursor-not-allowed"
              )}
            />
          )}
        </div>
      </PopoverTrigger>
      {selectedState && (
        <PopoverContent 
          className="w-(--anchor-width) p-0 bg-[#1a1a1a] border-white/10 text-white shadow-2xl z-50" 
          align="start"
          side="bottom"
          sideOffset={8}
        >
          <div className="flex flex-col">
            <div className="max-h-[250px] overflow-y-auto p-1 custom-scrollbar">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <div
                    key={city}
                    onClick={() => {
                      setValue(cityFieldName, city);
                      setCitySearch(city);
                      setIsCityPopoverOpen(false);
                    }}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2.5 text-sm outline-none hover:bg-[#00A8E1]/20 hover:text-white transition-colors",
                      selectedCity === city && "bg-[#00A8E1]/10 text-[#00A8E1]"
                    )}
                  >
                    <Check className={cn("mr-2 h-4 w-4", selectedCity === city ? "opacity-100" : "opacity-0")} />
                    {city}
                  </div>
                ))
              ) : (
                <div className="py-4 px-3 text-sm text-gray-500 italic flex items-center gap-2">
                  <Search className="h-3 w-3" />
                  No matching cities. Keep typing to add manually.
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-5", className)}>
      {/* State Selection */}
      {form ? (
        <FormItem className="flex flex-col">
          {StateLabel}
          {StateSelect}
          <FormMessage className="text-red-400 text-[10px] font-bold mt-1 ml-1" />
        </FormItem>
      ) : (
        <div className="flex flex-col">
          {StateLabel}
          {StateSelect}
        </div>
      )}

      {/* City Selection */}
      {form ? (
        <FormItem className="flex flex-col">
          {CityLabel}
          {CityInputUI}
          <FormMessage className="text-red-400 text-[10px] font-bold mt-1 ml-1" />
        </FormItem>
      ) : (
        <div className="flex flex-col">
          {CityLabel}
          {CityInputUI}
        </div>
      )}
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
}
