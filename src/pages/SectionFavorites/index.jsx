import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  Building2,
  Image as ImageIcon,
  Video,
  FolderOpen,
  Tag,
  Ruler,
  Compass,
  Download,
  Play,
  ZoomIn,
  Trash2,
} from "lucide-react";
import favoritesData from "../../data/favorites.json";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function SectionFavorites() {
  const [activeTab, setActiveTab] = useState("units");
  const [favorites, setFavorites] = useLocalStorage(
    "fenica_favorites_v2",
    favoritesData,
  );

  const tabs = [
    {
      id: "units",
      label: "Căn hộ",
      icon: Building2,
      count: favorites.units.length,
    },
    {
      id: "images",
      label: "Hình ảnh",
      icon: ImageIcon,
      count: favorites.images.length,
    },
    {
      id: "documents",
      label: "Tài liệu",
      icon: FolderOpen,
      count: favorites.documents.length,
    },
    {
      id: "videos",
      label: "Video",
      icon: Video,
      count: favorites.videos.length,
    },
  ];

  const handleRemove = (type, id) => {
    setFavorites((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto">
      <div className="max-w-full mx-auto w-full mb-8 mt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 font-bold text-sm mb-4">
          <Heart size={16} className="fill-rose-500" /> Bộ sưu tập cá nhân
        </div>
        {/* <h2 className="text-xl lg:text-xl font-bold text-slate-900 mb-2">Đã Yêu Thích</h2>
 <p className="text-slate-500 text-lg">Quản lý những căn hộ và tài liệu bạn quan tâm nhất</p> */}
      </div>

      <div className="max-w-screen mx-auto w-full pb-20">
        {/* Sub Navigation */}
        {/* Sub Navigation */}
        <div className="flex flex-nowrap md:flex-wrap gap-4 mb-8 border-b border-slate-200 pb-4 overflow-x-auto hide-scrollbar snap-x">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-bold transition-all duration-300 relative shrink-0 snap-start ${
                  isActive
                    ? "text-slate-900 bg-white shadow-sm border border-slate-200"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={18} className={isActive ? "text-primary" : ""} />
                {tab.label}
                <span
                  className={`ml-2 px-2 py-0.5 text-xs ${isActive ? "bg-primary/10 text-primary" : "bg-slate-200 text-slate-600"}`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* UNITS */}
            {activeTab === "units" && (
              <motion.div
                key="units"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {favorites.units.map((unit) => (
                  <div
                    key={unit.id}
                    className="bg-white overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group relative"
                  >
                    <button
                      onClick={() => handleRemove("units", unit.id)}
                      className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur text-rose-500 flex items-center justify-center shadow-sm hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <Heart size={20} className="fill-rose-500" />
                    </button>
                    <div className="h-48 overflow-hidden">
                      <img
                        src={unit.image}
                        alt={unit.code}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-black text-slate-900 mb-4">
                        {unit.code}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Tag size={16} className="text-primary" />
                          <span className="font-bold">{unit.price} Tỷ</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Ruler size={16} className="text-primary" />
                          <span className="font-bold">{unit.area}m²</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Compass size={16} className="text-primary" />
                          <span className="font-bold">{unit.direction}</span>
                        </div>
                      </div>
                      <button className="w-full py-3 bg-slate-900 text-white font-bold hover:bg-primary transition-colors">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* IMAGES */}
            {activeTab === "images" && (
              <motion.div
                key="images"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {favorites.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative group overflow-hidden aspect-square bg-slate-200"
                  >
                    <img
                      src={img.src}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <button
                      onClick={() => handleRemove("images", img.id)}
                      className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 backdrop-blur text-rose-500 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart size={16} className="fill-rose-500" />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h4 className="text-white font-bold">{img.title}</h4>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* DOCUMENTS */}
            {activeTab === "documents" && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                {favorites.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-6 bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center">
                        <FolderOpen size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                          {doc.title}
                        </h4>
                        <span className="text-sm text-slate-500">
                          {doc.type} • {doc.size}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="w-10 h-10 bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleRemove("documents", doc.id)}
                        className="w-10 h-10 bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* VIDEOS */}
            {activeTab === "videos" && (
              <motion.div
                key="videos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {favorites.videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="relative group overflow-hidden aspect-[16/9] shadow-sm"
                  >
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    <button
                      onClick={() => handleRemove("videos", vid.id)}
                      className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur text-rose-500 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart size={20} className="fill-rose-500" />
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
                        <Play size={24} className="ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h4 className="text-white font-bold">{vid.title}</h4>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
