"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FilterPanelProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function FilterPanel({ title, isOpen, onClose, children }: FilterPanelProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Filter Sidebar container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-full max-w-[300px] border-r border-white/10 bg-[#141414] shadow-xl transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:block lg:w-80 lg:shrink-0 lg:bg-transparent lg:shadow-none lg:border-r-0 lg:pr-8
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col lg:h-[calc(100vh-120px)] lg:sticky lg:top-[90px] lg:rounded-2xl lg:border lg:border-white/10 lg:bg-black/40 lg:backdrop-blur-xl lg:p-4 lg:shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-white/10 lg:hidden">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="hidden lg:block mb-4">
            <h2 className="text-lg font-bold text-white">{title}</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 lg:p-0">
            <div className="space-y-6">
              {children}
            </div>
          </div>
          
          <div className="p-4 border-t border-white/10 lg:pt-4 lg:pb-0 lg:px-0">
            <Button className="w-full bg-[#00A8E1] text-white hover:bg-[#0082B4] hover:shadow-[0_0_15px_rgba(0,168,225,0.3)] transition-all duration-300">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
