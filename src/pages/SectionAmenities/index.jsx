import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import amenitiesData from "../../data/amenities.json";

const amenities = amenitiesData.amenities;

const connectionData = [
  {
    id: "3-5",
    label: "3 - 5 PHÚT",
    locations: [
      "Ga S12 & ga An Phú",
      "Trường Mầm Non Hoa Cúc 2",
      "Trường tiểu học An Phú 3",
      "Trường tiểu học Bùi Thị Xuân",
      "Chợ Tân Bình",
      "Chợ Phú Phong",
      "Khu di tích - du lịch Hồ Lang",
    ],
  },
  {
    id: "5-7",
    label: "5 - 7 PHÚT",
    locations: [
      "Vincom Plaza Dĩ An",
      "KCN Sóng Thần 2",
      "KCN Tân Đông Hiệp B",
      "Trường THPT Lý Thái Tổ",
      "BVĐK Hoàn Hảo",
    ],
  },
  {
    id: "10-15",
    label: "10 - 15 PHÚT",
    locations: [
      "Làng Đại học Quốc gia TP.HCM",
      "Khu Công nghệ cao TP.HCM",
      "Sân Golf Sông Bé",
      "Bến xe Miền Đông mới",
    ],
  },
  {
    id: "20-25",
    label: "20 - 25 PHÚT",
    locations: ["Sân bay Tân Sơn Nhất", "Trung tâm Quận 1"],
  },
  {
    id: "30",
    label: "30 PHÚT",
    locations: ["Sân bay Quốc tế Long Thành"],
  },
];

export default function SectionAmenities() {
  const [activeTab, setActiveTab] = useState("3-5");
  const activeData = useMemo(
    () => connectionData.find((d) => d.id === activeTab),
    [activeTab],
  );
  const tabsRef = useRef(null);

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      tabsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] overflow-y-auto">
      {/* External Amenities (Connection Map) */}
      <div className="w-full flex flex-col lg:flex-row min-h-screen">
        {/* Left Side: Map Image */}
        <div className="w-full lg:w-2/3 relative h-[50vh] lg:h-auto overflow-hidden flex items-center justify-center p-8">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, #d4ae6f 0%, transparent 70%)",
            }}
          />
          <img
            src="/assets/images/connect.png"
            alt="Bản đồ kết nối Fenica"
            className="w-full h-full object-contain relative z-10"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80";
            }}
          />
          <h1 className="absolute bottom-10 left-10 text-5xl md:text-7xl font-black text-white tracking-widest z-20 mix-blend-overlay opacity-50">
            FENICA
          </h1>
        </div>

        {/* Right Side: Sidebar */}
        <div className="w-full lg:w-1/3 border-l border-white/10 flex flex-col pt-16 px-8 pb-12 bg-[#050b14]">
          <h2 className="text-3xl font-serif font-bold text-[#d4ae6f] tracking-widest mb-10">
            BẢN ĐỒ KẾT NỐI
          </h2>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-12">
            <button
              onClick={() => scrollTabs("left")}
              className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#d4ae6f] hover:border-[#d4ae6f]/50 hover:bg-[#d4ae6f]/10 transition-colors shrink-0"
            >
              <ChevronLeft size={20} />
            </button>

            <div
              ref={tabsRef}
              className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth flex-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {connectionData.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 text-sm font-bold transition-all duration-300 border whitespace-nowrap shrink-0 ${
                    activeTab === tab.id
                      ? "border-[#d4ae6f] bg-[#d4ae6f]/10 text-[#d4ae6f] shadow-[0_0_15px_rgba(212,174,111,0.2)]"
                      : "border-white/10 text-slate-400 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => scrollTabs("right")}
              className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#d4ae6f] hover:border-[#d4ae6f]/50 hover:bg-[#d4ae6f]/10 transition-colors shrink-0"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Location List */}
          <div className="flex-1 min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 bg-[#d4ae6f] shadow-[0_0_10px_#d4ae6f]" />
                  <h3 className="text-xl font-serif font-bold tracking-widest uppercase text-[#d4ae6f]">
                    {activeData?.label}
                  </h3>
                </div>

                {/* List Items */}
                <div className="flex flex-col gap-6 border-l border-white/10 ml-1 pl-6 py-2 relative">
                  {activeData?.locations.map((loc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 group cursor-default"
                    >
                      {/* Node point on the line */}
                      <div className="absolute left-[-4.5px] w-2 h-2 bg-white/20 group-hover:bg-[#d4ae6f] group-hover:shadow-[0_0_10px_#d4ae6f] transition-all duration-300" />

                      <MapPin
                        size={18}
                        className="text-white/40 group-hover:text-[#d4ae6f] transition-colors duration-300"
                      />
                      <p className="text-slate-300 font-medium text-base group-hover:text-white transition-colors duration-300">
                        {loc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Internal Amenities Section */}
      <div className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Hệ Thống Tiện Ích Nội Khu
          </h2>
          <p className="text-[#d4ae6f] text-lg max-w-2xl mx-auto">
            Đặc quyền tận hưởng cuộc sống nghỉ dưỡng mỗi ngày ngay tại thềm nhà.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col bg-white/[0.03] backdrop-blur-md shadow-xl overflow-hidden border border-[#d4ae6f]/20 group hover:border-[#d4ae6f]/50 hover:bg-white/5 transition-all"
            >
              <div className="w-full relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] to-transparent" />
                <h3 className="absolute bottom-4 left-5 text-xl font-bold text-white group-hover:text-[#d4ae6f] transition-colors">
                  {item.name}
                </h3>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-slate-400 mb-6 text-sm flex-1 leading-relaxed">
                  {item.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-[#d4ae6f] font-bold uppercase tracking-wider flex items-center gap-1">
                      <MapPin size={12} /> Vị trí
                    </p>
                    <p className="font-medium text-slate-200 text-sm">
                      {item.distance}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-[#d4ae6f] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clock size={12} /> Hoạt động
                    </p>
                    <p className="font-medium text-slate-200 text-sm">
                      {item.hours}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
