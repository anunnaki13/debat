import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { uiSkeletonSurfaceClasses } from "./styles";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function Skeleton({ label = "Memuat", className, ...props }: SkeletonProps) {
  return (
    <div
      aria-label={label}
      role="status"
      className={cn(uiSkeletonSurfaceClasses, className)}
      {...props}
    >
      <span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--ra-border-strong)] to-transparent"
        style={{ animation: "ra-skeleton-sweep 1.4s ease-in-out infinite" }}
        aria-hidden="true"
      />
    </div>
  );
}
