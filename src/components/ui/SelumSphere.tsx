"use client";
import { cn } from "@/lib/utils";

interface Props {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "w-8 h-8 text-sm border-[1.5px]",
  md: "w-10 h-10 text-base border-2",
  lg: "w-16 h-16 text-2xl border-2",
  xl: "w-24 h-24 text-5xl border-[3px]",
};

const glows = {
  sm: "",
  md: "",
  lg: "shadow-[0_0_24px_rgba(33,150,243,0.35)]",
  xl: "shadow-[0_0_50px_rgba(33,150,243,0.45),0_0_100px_rgba(33,150,243,0.15)] animate-sphere-glow",
};

export default function SelumSphere({ size = "md", className }: Props) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full flex-shrink-0",
        "border-[rgba(144,202,249,0.45)]",
        sizes[size],
        glows[size],
        className
      )}
      style={{
        background:
          "radial-gradient(circle at 32% 28%, #B3D9F7, #1976D2 38%, #0D3A6E 70%, #040D1A)",
      }}
    >
      {/* Ring accent */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.15) 0%, transparent 60%)",
        }}
      />
      <span
        className="font-display font-black italic text-[#E3F2FD] leading-none select-none"
        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
      >
        S
      </span>
    </div>
  );
}
