import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, ArrowRight, Newspaper, Loader2, X } from "lucide-react";

export default function SectionNews() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [newsArticles, setNewsArticles] = useState([]);
  const [categories, setCategories] = useState(["Tất cả"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          "https://fenica.vn/wp-json/wp/v2/posts?_embed&per_page=12",
        );
        if (!res.ok) throw new Error("Không thể tải dữ liệu tin tức");
        const data = await res.json();

        const cats = new Set(["Tất cả"]);

        const formattedNews = data.map((post) => {
          // Extract category
          let catName = "Tin Tức";
          if (
            post._embedded &&
            post._embedded["wp:term"] &&
            post._embedded["wp:term"][0]
          ) {
            const catObj = post._embedded["wp:term"][0].find(
              (term) => term.taxonomy === "category",
            );
            if (catObj) {
              catName = catObj.name;
              cats.add(catName);
            }
          }

          // Extract image
          let imageUrl =
            "https://placehold.co/600x400/e2e8f0/64748b?text=Fenica+News";
          if (
            post._embedded &&
            post._embedded["wp:featuredmedia"] &&
            post._embedded["wp:featuredmedia"][0]
          ) {
            imageUrl = post._embedded["wp:featuredmedia"][0].source_url;
          }

          // Format date
          const date = new Date(post.date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          // Strip HTML from excerpt
          const div = document.createElement("div");
          div.innerHTML = post.excerpt.rendered;
          const excerptText = div.textContent || div.innerText || "";

          return {
            id: post.id,
            title: post.title.rendered,
            excerpt: excerptText,
            content: post.content?.rendered || "",
            image: imageUrl,
            category: catName,
            date: date,
            link: post.link,
          };
        });

        setNewsArticles(formattedNews);
        setCategories(Array.from(cats));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews =
    activeCategory === "Tất cả"
      ? newsArticles
      : newsArticles.filter((news) => news.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto">
      {/* Categories Filter */}
      {!isLoading && !error && (
        <div className="flex flex-wrap gap-3 mb-10 mx-auto w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="mx-auto w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-primary">
            <Loader2 size={48} className="animate-spin mb-4" />
            <p className="font-bold">Đang tải tin tức...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center text-rose-500">
            <Newspaper size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">{error}</p>
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredNews.map((news) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={news.id}
                    onClick={() => setSelectedArticle(news)}
                    className="bg-white overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col"
                  >
                    {/* Image Wrapper */}
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-1.5 bg-white/90 backdrop-blur text-primary text-xs font-bold uppercase tracking-wider shadow-sm">
                          {news.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-4">
                        <Calendar size={16} />
                        {news.date}
                      </div>

                      <h3
                        className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug"
                        dangerouslySetInnerHTML={{ __html: news.title }}
                      />

                      <p className="text-slate-600 line-clamp-3 mb-6 flex-1">
                        {news.excerpt}
                      </p>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-primary font-bold">
                        <span>Đọc tiếp</span>
                        <ArrowRight
                          size={20}
                          className="transform group-hover:translate-x-2 transition-transform"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredNews.length === 0 && (
              <div className="py-20 text-center text-slate-400">
                <Newspaper size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">
                  Chưa có bài viết nào trong chuyên mục này.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Article Viewer Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-center items-center p-4 sm:p-6"
          >
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedArticle(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white w-full max-w-4xl h-full max-h-[90vh] shadow-2xl relative flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0 bg-white">
                <h2
                  className="text-xl font-bold text-slate-800 pr-8 truncate"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.title }}
                />
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50">
                <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 shadow-sm border border-slate-100">
                  <div className="mb-8">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider mb-4 inline-block">
                      {selectedArticle.category}
                    </span>
                    <h1
                      className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight"
                      dangerouslySetInnerHTML={{
                        __html: selectedArticle.title,
                      }}
                    />
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <Calendar size={16} /> {selectedArticle.date}
                    </div>
                  </div>

                  <div className="w-full h-[300px] sm:h-[450px] overflow-hidden mb-10 shadow-md">
                    <img
                      src={selectedArticle.image}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <style>{`
 .wp-content p { margin-bottom: 1.5em; }
 .wp-content h2, .wp-content h3 { font-size: 1.5em; font-weight: bold; margin-top: 2em; margin-bottom: 1em; color: #0f172a; }
 .wp-content img { border-radius: 1rem; margin: 2em 0; max-width: 100%; height: auto; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
 .wp-content ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.5em; }
 .wp-content a { color: #1d4ed8; text-decoration: underline; }
`}</style>

                  <div
                    className="wp-content text-slate-700 leading-loose text-lg"
                    dangerouslySetInnerHTML={{
                      __html: selectedArticle.content,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
