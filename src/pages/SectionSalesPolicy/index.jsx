import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BadgeDollarSign,
  Percent,
  CalendarClock,
  Landmark,
  TrendingDown,
  Ticket,
  ChevronDown,
} from "lucide-react";
import policiesData from "../../data/policies.json";
import { Button } from "../../components/ui/Button";

const IconMap = {
  BadgeDollarSign,
  Percent,
  CalendarClock,
  Landmark,
  TrendingDown,
  Ticket,
};

export default function SectionSalesPolicy() {
  const [expandedId, setExpandedId] = useState(null);

  const togglePolicy = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto">
      <div className="mb-4 mt-4 max-w-4xl mx-auto px-6 lg:px-8 w-full">
        {/* Header has been removed as requested */}
      </div>

      <div className="w-full pb-20 flex flex-col gap-4">
        {policiesData.map((policy) => {
          const Icon = IconMap[policy.icon];
          const isExpanded = expandedId === policy.id;

          return (
            <motion.div
              layout
              key={policy.id}
              className={`bg-white border overflow-hidden transition-all duration-300 ${
                isExpanded
                  ? "border-primary/20 shadow-xl shadow-primary/5"
                  : "border-slate-100 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Header / Trigger */}
              <div
                className="p-6 sm:p-8 flex items-center justify-between cursor-pointer select-none"
                onClick={() => togglePolicy(policy.id)}
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 ${policy.bg} flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    <Icon size={28} className={policy.color} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                      {policy.title}
                    </h3>
                    <h4
                      className={`text-sm sm:text-base font-black ${policy.color}`}
                    >
                      {policy.badge}
                    </h4>
                  </div>
                </div>
                <div
                  className={`w-10 h-10 shrink-0 flex items-center justify-center transition-transform duration-300 ${isExpanded ? "bg-primary text-white rotate-180" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                >
                  <ChevronDown size={20} />
                </div>
              </div>

              {/* Expanded Content / Dropdown */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 sm:px-8 pb-8 pt-2">
                      <div className="border-t border-slate-100 pt-6">
                        <p className="text-slate-600 font-medium text-base sm:text-lg mb-8">
                          {policy.description}
                        </p>

                        {/* Standard Timeline */}
                        {policy.timeline && (
                          <div className="relative border-l-2 border-slate-200 ml-3 sm:ml-4 space-y-8">
                            {policy.timeline.map((item, idx) => (
                              <div key={idx} className="relative pl-6 sm:pl-8">
                                <div
                                  className={`absolute -left-[9px] top-1.5 w-4 h-4 border-4 border-white shadow-sm ${idx === policy.timeline.length - 1 ? "bg-primary" : "bg-slate-300"}`}
                                />
                                <div className="bg-slate-50 p-5 border border-slate-100">
                                  <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                                    {item.step}
                                  </h4>
                                  <div
                                    className={`text-lg sm:text-xl font-black mb-2 ${policy.color}`}
                                  >
                                    {item.amount}
                                  </div>
                                  {item.time && (
                                    <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                                      <CalendarClock size={16} /> {item.time}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Options Timeline (e.g. Bank Loans) */}
                        {policy.options && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {policy.options.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className="bg-slate-50 p-6 sm:p-8 border border-slate-100"
                              >
                                <h3
                                  className={`text-lg font-black mb-6 pb-4 border-b border-slate-200 ${policy.color}`}
                                >
                                  {opt.name}
                                </h3>
                                <div className="relative border-l-2 border-slate-200 ml-2 space-y-6">
                                  {opt.timeline.map((item, idx) => (
                                    <div key={idx} className="relative pl-6">
                                      <div
                                        className={`absolute -left-[9px] top-1.5 w-4 h-4 border-4 border-white shadow-sm ${idx === opt.timeline.length - 1 ? "bg-primary" : "bg-slate-300"}`}
                                      />
                                      <div>
                                        <h4 className="text-base font-bold text-slate-900 mb-1">
                                          {item.step}
                                        </h4>
                                        <div
                                          className={`text-base font-black mb-1 ${policy.color}`}
                                        >
                                          {item.amount}
                                        </div>
                                        {item.time && (
                                          <p className="text-slate-500 text-sm font-medium">
                                            {item.time}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
