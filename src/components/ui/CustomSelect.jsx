import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check } from "lucide-react";
export default function CustomSelect({
  value,
  onChange,
  options,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value) || options[0];
  return (
    <div className="relative w-full">
      <div
        className={`w-full p-3 border border-slate-200 bg-slate-50 hover:bg-white cursor-pointer flex justify-between items-center transition-colors font-medium text-slate-700 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption?.label || ""}</span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto bg-white shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`p-3 cursor-pointer hover:bg-slate-50 transition-colors flex justify-between items-center ${value === option.value ? "bg-primary/5" : ""}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span
                  className={`text-sm ${value === option.value ? "font-bold text-primary" : "font-medium text-slate-700"}`}
                >
                  {option.label}
                </span>
                {value === option.value && (
                  <Check size={16} className="text-primary" />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
