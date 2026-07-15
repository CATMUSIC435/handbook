import React from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        "bg-white border border-slate-100 shadow-sm overflow-hidden",
        hover &&
          "hover:shadow-2xl hover:-translate-y-1 transition-all duration-300",
        className,
      )}
      {...props}
    >
      {""}
      {children}
      {""}
    </div>
  );
}
export function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={cn("p-4 lg:p-6 border-b border-slate-100", className)}
      {...props}
    >
      {""}
      {children}
      {""}
    </div>
  );
}
export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={cn("text-lg lg:text-xl font-bold text-slate-900", className)}
      {...props}
    >
      {""}
      {children}
      {""}
    </h3>
  );
}
export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("p-4 lg:p-6", className)} {...props}>
      {""}
      {children}
      {""}
    </div>
  );
}
export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "p-4 lg:p-6 bg-slate-50 border-t border-slate-100 flex items-center",
        className,
      )}
      {...props}
    >
      {""}
      {children}
      {""}
    </div>
  );
}
