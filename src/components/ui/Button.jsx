import React from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  fullWidth = false,
  icon: Icon,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary:
      "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover hover:shadow-xl hover:-translate-y-0.5",
    secondary:
      "bg-secondary text-white shadow-lg shadow-secondary/30 hover:bg-secondary/90 hover:shadow-xl hover:-translate-y-0.5",
    outline:
      "border-2 border-slate-200 bg-transparent text-slate-700 hover:border-primary hover:text-primary hover:bg-slate-50",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger:
      "bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600 hover:shadow-xl hover:-translate-y-0.5",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base min-h-[44px]",
    lg: "px-8 py-4 text-lg min-h-[56px]",
    icon: "p-3",
  };
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className,
      )}
      {...props}
    >
      {""}
      {Icon && <Icon className={cn(size === "sm" ? "w-4 h-4" : "w-5 h-5")} />}
      {""}
      {children}
      {""}
    </button>
  );
}
