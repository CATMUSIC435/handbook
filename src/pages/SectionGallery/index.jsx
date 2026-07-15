import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import galleryData from "../../data/gallery.json";

const categories = galleryData.categories;
const galleryImages = galleryData.galleryImages;

export default function SectionGallery() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages =
    activeCategory === "Tất cả"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const handlePrev = (e) => {
    e.stopPropagation();
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id,
    );
    if (currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    } else {
      setSelectedImage(filteredImages[filteredImages.length - 1]); // Vòng lại ảnh cuối
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id,
    );
    if (currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1]);
    } else {
      setSelectedImage(filteredImages[0]); // Vòng lại ảnh đầu
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto">
      <div className="mb-4"></div>

      {/* Categories Filter */}
      <div className="flex gap-3 mb-8 px-6 lg:px-8 overflow-x-auto hide-scrollbar py-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 font-medium transition-all duration-300 shrink-0 whitespace-nowrap ${
              activeCategory === cat
                ? "bg-[#d4ae6f] text-slate-900 shadow-lg shadow-[#d4ae6f]/30 border-0 font-bold"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 pb-12 px-4 md:px-6 lg:px-8"
      >
        <AnimatePresence>
          {filteredImages.map((img) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              key={img.id}
              className="relative group overflow-hidden aspect-square cursor-pointer shadow-sm hover:shadow-xl transition-shadow bg-slate-200"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="inline-block px-3 py-1 bg-[#d4ae6f]/20 backdrop-blur-md text-[#d4ae6f] text-xs font-bold w-fit mb-2 border border-[#d4ae6f]/20">
                  {img.category}
                </span>
                <h4 className="text-white font-bold text-lg leading-tight flex justify-between items-end">
                  {img.title}
                  <ZoomIn className="text-white/70" size={20} />
                </h4>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-900/95 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-md z-50"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>

            {/* Prev Button */}
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white transition-colors backdrop-blur-md z-50"
              onClick={handlePrev}
            >
              <ChevronLeft size={32} />
            </button>

            {/* Next Button */}
            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white transition-colors backdrop-blur-md z-50"
              onClick={handleNext}
            >
              <ChevronRight size={32} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage.id}
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                transition={{ duration: 0.2 }}
                className="relative max-w-7xl max-h-full flex flex-col"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
              >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="w-auto h-auto max-w-full max-h-[85vh] object-contain shadow-2xl"
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
