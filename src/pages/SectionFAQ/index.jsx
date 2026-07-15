import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import faqs from "../../data/faqs.json";

export default function SectionFAQ() {
  const [openId, setOpenId] = useState(faqs[0].id);

  // Group FAQs by category
  const categories = useMemo(() => {
    const cats = [...new Set(faqs.map((faq) => faq.category))];
    return cats;
  }, []);

  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => faq.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full mb-8 text-center mt-8">
        <h2 className="hidden text-2xl md:text-3xl font-black text-slate-900 mb-4">
          Câu Hỏi Thường Gặp
        </h2>
        <p className="hidden text-slate-500 text-base md:text-lg">
          Giải đáp những thắc mắc phổ biến nhất từ phía khách hàng về dự án
          Fenica
        </p>
      </div>

      <div className="max-w-screen mx-auto px-6 lg:px-8 w-full pb-20">
        {/* Category Tabs */}
        <div
          className="flex overflow-x-auto gap-2 mb-8 pb-2 no-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveCategory(cat);
                // Optionally open the first FAQ in the new category
                const firstFaq = faqs.find((f) => f.category === cat);
                if (firstFaq) setOpenId(firstFaq.id);
              }}
              className={`whitespace-nowrap px-5 py-2.5 font-bold text-sm transition-all shadow-sm border ${
                activeCategory === cat
                  ? "bg-primary text-white border-primary shadow-primary/20"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs List */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`bg-white border overflow-hidden transition-all duration-300 shadow-sm ${
                      isOpen
                        ? "border-primary shadow-md"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <button
                      className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                    >
                      <span
                        className={`text-base md:text-lg font-bold transition-colors pr-4 ${isOpen ? "text-primary" : "text-slate-800"}`}
                      >
                        {faq.question}
                      </span>
                      <div
                        className={`w-8 h-8 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "bg-primary/10 text-primary rotate-180" : "bg-slate-100 text-slate-400"}`}
                      >
                        <ChevronDown size={20} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div
                            className="px-5 md:px-6 pb-5 md:pb-6 pt-0 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-50 mt-2 prose-sm md:prose"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Contact Support block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-12 bg-slate-900 p-6 md:p-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent pointer-events-none" />
          <h3 className="text-lg md:text-xl font-bold text-white mb-2 relative z-10">
            Bạn vẫn còn câu hỏi khác?
          </h3>
          <p className="text-slate-300 text-sm md:text-base mb-6 relative z-10">
            Đừng ngần ngại liên hệ trực tiếp với chúng tôi để được tư vấn cụ thể
            24/7.
          </p>
          <button className="px-6 md:px-8 py-3 bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 relative z-10">
            Trò chuyện với Tư vấn viên
          </button>
        </motion.div>
      </div>
    </div>
  );
}
