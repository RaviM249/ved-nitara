"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AnimatedPlaceholderInputProps extends React.ComponentProps<typeof Input> {
  placeholder: string;
  icon?: React.ElementType;
  iconClassName?: string;
  field?: any; // from react-hook-form
}

export function AnimatedPlaceholderInput({
  placeholder,
  icon: Icon,
  iconClassName,
  field,
  className,
  ...props
}: AnimatedPlaceholderInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  // Use either the field value (from react-hook-form) or a local value if not using RHF
  const hasValue = field?.value !== undefined ? field.value !== "" : props.value !== undefined ? props.value !== "" : false;
  const showPlaceholder = !isFocused && !hasValue;

  return (
    <div className="relative w-full group">
      {Icon && (
        <Icon className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 transition-colors duration-300",
          (isFocused || hasValue) && "text-[#00A8E1]",
          iconClassName
        )} />
      )}
      
      <AnimatePresence>
        {showPlaceholder && (
          <motion.span
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8, transition: { duration: 0.2, ease: "easeOut" } }}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-sm transition-all duration-300",
              Icon ? "left-11" : "left-4"
            )}
          >
            {placeholder}
          </motion.span>
        )}
      </AnimatePresence>

      <Input
        {...props}
        {...field}
        placeholder="" // We use our own animated placeholder
        className={cn(
          Icon && "pl-11",
          className
        )}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
          field?.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
          field?.onBlur?.(e);
        }}
      />
    </div>
  );
}
