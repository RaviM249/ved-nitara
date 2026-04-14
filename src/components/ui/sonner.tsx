"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group flex items-center gap-3 w-full border border-white/10 bg-[#0a0a0a] rounded-xl shadow-2xl p-4 font-sans font-medium",
          title: "!text-white text-md",
          description: "!text-gray-300 text-sm",
          error: "group-[.toaster]:bg-red-950/40 group-[.toaster]:border-red-500/30 !text-white group-[.toaster]:[text-shadow:0_0_12px_rgba(239,68,68,1)]",
          success: "group-[.toaster]:bg-green-950/40 group-[.toaster]:border-green-500/30 !text-white group-[.toaster]:[text-shadow:0_0_12px_rgba(74,222,128,1)]",
          warning: "group-[.toaster]:bg-amber-950/40 group-[.toaster]:border-amber-500/30 !text-white group-[.toaster]:[text-shadow:0_0_12px_rgba(251,191,36,1)]",
          info: "group-[.toaster]:bg-[#00A8E1]/20 group-[.toaster]:border-[#00A8E1]/30 !text-white group-[.toaster]:[text-shadow:0_0_12px_rgba(0,168,225,1)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
