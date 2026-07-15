import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play } from "lucide-react";
import videoData from "../../data/videos.json";

const categories = videoData.categories;
const videos = videoData.videos;

export default function SectionVideo() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const filteredVideos =
    activeCategory === "Tất cả"
      ? videos
      : videos.filter((vid) => vid.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto">
      <div className="mb-8">
        {/* <h2 className="text-xl font-bold text-slate-900 mb-2">Thư Viện Video</h2>
 <p className="text-slate-500">Trải nghiệm dự án một cách sống động qua những thước phim</p> */}
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 font-medium transition-all duration-300 ${
              activeCategory === cat
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12"
      >
        <AnimatePresence>
          {filteredVideos.map((vid) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={vid.id}
              className="relative group overflow-hidden aspect-[16/9] cursor-pointer shadow-md hover:shadow-2xl transition-shadow bg-slate-900"
              onClick={() => setSelectedVideo(vid)}
            >
              <img
                src={vid.thumbnail}
                alt={vid.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <Play size={32} className="ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <span className="inline-block px-2 py-1 bg-primary/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                  {vid.category}
                </span>
                <h4 className="text-white font-bold text-lg leading-tight line-clamp-1">
                  {vid.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-slate-900/95 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <button
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-md z-50"
              onClick={() => setSelectedVideo(null)}
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl aspect-[16/9] bg-black overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
