import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Map,
  Building2,
  Search,
  Camera,
  Image as ImageIcon,
  Video,
  Coffee,
  Percent,
  FolderOpen,
  HelpCircle,
  Newspaper,
  Scale,
  Heart,
  ChevronLeft,
  ChevronRight,
  StickyNote,
  Calculator,
  Bot,
  Calendar,
  Bell,
  Settings,
  X,
} from "lucide-react";
import tabsData from "../../data/tabs.json";
const iconMap = {
  Home,
  Map,
  Building2,
  Search,
  Camera,
  ImageIcon,
  Video,
  Coffee,
  Percent,
  FolderOpen,
  HelpCircle,
  Newspaper,
  Scale,
  Heart,
  ChevronLeft,
  ChevronRight,
  StickyNote,
  Calculator,
  Bot,
  Calendar,
  Bell,
  Settings,
  X,
};
const tabs = tabsData.tabs.map((tab) => ({ ...tab, icon: iconMap[tab.icon] }));
export default function Navigation({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleTabClick = (path) => {
    navigate(path);
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
  };
  return (
    <>
      {""}
      {/* Mobile Overlay */}
      {""}
      <AnimatePresence>
        {""}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60]"
          />
        )}
        {""}
      </AnimatePresence>
      <motion.nav
        animate={{ width: isCollapsed && window.innerWidth >= 768 ? 80 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`bg-white/95 backdrop-blur-xl border-r border-slate-200/50 flex flex-col h-full z-[70] shrink-0 fixed md:relative top-0 left-0 transition-transform duration-300 shadow-2xl md:shadow-none ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {""}
        {/* Mobile Close Button */}
        {""}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute top-4 right-4 w-10 h-10 bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
        >
          <X size={20} />
        </button>
        {""}
        {/* Collapse Toggle Button (Desktop Only) */}
        {""}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-4 top-8 w-8 h-8 bg-white border border-slate-200 items-center justify-center text-slate-500 hover:text-primary hover:border-primary shadow-md z-50 transition-colors"
        >
          {""}
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {""}
        </button>
        {""}
        {/* Scrollable Tabs List */}
        {""}
        <div
          className="flex flex-col gap-2 w-full px-4 py-8 mt-12 md:mt-0 overflow-y-auto h-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          {""}
          {tabs.map((tab) => {
            if (tab.type === "divider") {
              return (
                <div
                  key={tab.id}
                  className="w-full h-px bg-slate-100 my-2"
                ></div>
              );
            }
            if (tab.type === "title") {
              const renderCollapsed = isCollapsed && window.innerWidth >= 768;
              return !renderCollapsed ? (
                <div
                  key={tab.id}
                  className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 mt-5 mb-1"
                >
                  {""}
                  {tab.label}
                  {""}
                </div>
              ) : (
                <div
                  key={tab.id}
                  className="w-full h-px bg-transparent my-1"
                ></div>
              );
            }
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            /* On mobile, never use collapsed view */ const renderCollapsed =
              isCollapsed && window.innerWidth >= 768;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.path)}
                title={renderCollapsed ? tab.label : ""}
                className={`relative flex items-center gap-3 py-2.5 transition-all duration-300 w-full text-left text-sm font-semibold ${renderCollapsed ? "justify-center px-0" : "px-4"} ${isActive ? "text-white" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
              >
                {""}
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-primary shadow-lg shadow-primary/30"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {""}
                <span
                  className={`relative z-10 flex items-center ${renderCollapsed ? "justify-center" : "gap-3"}`}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-white" : "text-slate-400"}
                  />
                  <AnimatePresence>
                    {""}
                    {!renderCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {""}
                        {tab.label}
                        {""}
                      </motion.span>
                    )}
                    {""}
                  </AnimatePresence>
                </span>
              </button>
            );
          })}
          {""}
        </div>
      </motion.nav>
    </>
  );
}
