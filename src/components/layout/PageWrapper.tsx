import { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function PageWrapper({ 
  children, 
  className = "", 
  noPadding = false 
}: PageWrapperProps) {
  return (
    <div className={`mx-auto w-full max-w-7xl ${noPadding ? "" : "px-4 pt-24 pb-20 md:pb-8"} ${className}`}>
      {children}
    </div>
  );
}
