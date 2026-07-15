import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
export const Input = forwardRef(
  ({ className, type = "text", icon: Icon, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {""}
        {label && (
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            {""}
            {label}
            {""}
          </label>
        )}
        {""}
        <div className="relative">
          {""}
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon size={20} />
            </div>
          )}
          {""}
          <input
            type={type}
            className={cn(
              "w-full flex border border-slate-200 bg-white px-4 py-3 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm",
              Icon && "pl-11",
              error && "border-red-500 focus-visible:ring-red-500",
              className,
            )}
            ref={ref}
            {...props}
          />
        </div>
        {""}
        {error && (
          <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
        )}
        {""}
      </div>
    );
  },
);
Input.displayName = "Input";
