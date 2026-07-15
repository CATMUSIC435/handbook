import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Percent,
  DollarSign,
  Hammer,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
} from "lucide-react";
import mockNotifications from "../../data/notifications.json";
import { Button } from "../../components/ui/Button";

const categories = [
  { id: "all", label: "Tất cả", icon: Bell },
  { id: "policy", label: "Chính sách", icon: Percent },
  { id: "price", label: "Giá mới", icon: DollarSign },
  { id: "progress", label: "Tiến độ", icon: Hammer },
  { id: "event", label: "Sự kiện", icon: Calendar },
];

export default function SectionNotifications() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [notifications, setNotifications] = useState(mockNotifications);

  const filteredNotifications = notifications.filter(
    (n) => activeCategory === "all" || n.type === activeCategory,
  );

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const getIconForType = (type) => {
    switch (type) {
      case "policy":
        return <Percent size={20} className="text-amber-500" />;
      case "price":
        return <DollarSign size={20} className="text-emerald-500" />;
      case "progress":
        return <Hammer size={20} className="text-blue-500" />;
      case "event":
        return <Calendar size={20} className="text-purple-500" />;
      default:
        return <Bell size={20} className="text-slate-500" />;
    }
  };

  const getBgForType = (type) => {
    switch (type) {
      case "policy":
        return "bg-amber-100 border-amber-200";
      case "price":
        return "bg-emerald-100 border-emerald-200";
      case "progress":
        return "bg-blue-100 border-blue-200";
      case "event":
        return "bg-purple-100 border-purple-200";
      default:
        return "bg-slate-100 border-slate-200";
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full mb-10 mt-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-600 font-bold text-sm mb-4 w-fit relative">
            <Bell size={16} /> Thông Báo & Cập Nhật
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 bg-rose-500"></span>
              </span>
            )}
          </div>
          {/* <h2 className="text-xl lg:text-xl font-bold text-slate-900 mb-2">Bảng Tin Mới Nhất</h2>
 <p className="text-slate-500 text-lg">Cập nhật liên tục các thông tin quan trọng từ Chủ đầu tư.</p> */}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-600 border border-slate-200 font-bold hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
          >
            <CheckCircle2 size={18} /> Đánh dấu đã đọc tất cả
          </button>
        )}
      </div>

      <div className="max-w-screen mx-auto px-6 lg:px-8 w-full pb-20">
        {/* Filter Categories */}
        <div
          className="flex overflow-x-auto gap-3 pb-4 mb-6"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((note) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={note.id}
                className={`relative group bg-white p-6 border transition-all ${
                  note.unread
                    ? "border-slate-300 shadow-md shadow-slate-200/50 hover:border-slate-400"
                    : "border-slate-100 shadow-sm opacity-80 hover:opacity-100"
                }`}
              >
                {/* Unread indicator */}
                {note.unread && (
                  <div className="absolute top-8 right-6 w-3 h-3 bg-rose-500 shadow-md shadow-rose-500/50"></div>
                )}

                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 shrink-0 flex items-center justify-center border ${getBgForType(note.type)}`}
                  >
                    {getIconForType(note.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pr-6">
                    <h3
                      className={`text-xl font-bold mb-2 ${note.unread ? "text-slate-900" : "text-slate-700"}`}
                    >
                      {note.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      {note.desc}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} /> {note.time}
                      </span>
                      {note.type === "event" && (
                        <span className="text-purple-500 bg-purple-50 px-2 py-0.5">
                          Sự kiện đặc biệt
                        </span>
                      )}
                      {note.type === "policy" && (
                        <span className="text-amber-500 bg-amber-50 px-2 py-0.5">
                          Ưu đãi
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center sm:border-l sm:border-slate-100 sm:pl-6">
                    <Button
                      variant="ghost"
                      className="w-full sm:w-12 sm:h-12 flex justify-center items-center group-hover:bg-primary group-hover:text-white transition-colors py-3 sm:py-0 font-bold sm:font-normal text-sm sm:text-base gap-2"
                      icon={ChevronRight}
                    >
                      <span className="sm:hidden">Xem chi tiết</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredNotifications.length === 0 && (
            <div className="py-20 text-center text-slate-400">
              <Bell size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">
                Không có thông báo nào trong danh mục này.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
