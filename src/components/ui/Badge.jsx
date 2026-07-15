import React from "react";
import { cn } from "../../lib/utils";
export function Badge({ children, variant = "default", className, ...props }) {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    outline: "border border-slate-200 text-slate-600 bg-transparent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    >
      {""}
      {children}
      {""}
    </span>
  );
}
