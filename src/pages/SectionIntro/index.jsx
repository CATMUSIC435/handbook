import { motion } from "motion/react";
import { Download, Play, BedDouble, Bed } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function SectionIntro() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 relative pb-20">
      {""}
      {/* Hero Section */}
      {""}
      <div className="relative h-[85vh] overflow-hidden -[3rem] shadow-2xl">
        <img
          src="/assets/images/fenica-can-ho-tod.png"
          alt="Fenica Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/20" />
      </div>
      {""}
      {/* Project Overview */}
      {""}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-32 md:-mt-64 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {""}
          {/* Column 1 */}
          {""}
          <div className="flex flex-col gap-4">
            <div className="bg-white/[0.03] backdrop-blur-md border border-[#d4ae6f]/30 p-5 hover:bg-white/10 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] group">
              <h4 className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 group-hover:text-white/80 transition-colors">
                {""}
                Vị trí{""}
              </h4>
              <p className="text-sm text-gray-100 font-light leading-snug">
                {""}
                Đường Trần Quang Diệu, Phường Tân Đông Hiệp, Thành phố Hồ Chí
                Minh{""}
              </p>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-md border border-[#d4ae6f]/30 p-5 hover:bg-white/10 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] group">
              <h4 className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 group-hover:text-white/80 transition-colors">
                {""}
                Tổng diện tích{""}
              </h4>
              <p className="text-lg lg:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-[#f0e0ca] to-[#d4ae6f] bg-clip-text text-transparent drop-shadow-md">
                {""}
                5.537{""}
                <span className="text-lg font-light text-white/70 tracking-normal">
                  m²
                </span>
              </p>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-md border border-[#d4ae6f]/30 p-5 hover:bg-white/10 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] group">
              <h4 className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 group-hover:text-white/80 transition-colors">
                {""}
                Quy mô{""}
              </h4>
              <p className="text-sm text-gray-100 font-light leading-snug">
                {""}2 block, 2 tầng hầm & 2 tầng TTTM{""}
              </p>
            </div>
          </div>
          {""}
          {/* Column 2 */}
          {""}
          <div className="flex flex-col gap-4">
            <div className="bg-white/[0.03] backdrop-blur-md border border-[#d4ae6f]/30 p-5 hover:bg-white/10 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] group">
              <h4 className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 group-hover:text-white/80 transition-colors">
                {""}
                Chiều cao{""}
              </h4>
              <p className="text-lg lg:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-[#f0e0ca] to-[#d4ae6f] bg-clip-text text-transparent drop-shadow-md">
                {""}
                02{""}
                <span className="text-lg font-light text-white/70 tracking-normal">
                  tháp cao
                </span>
                {""}
                22{""}
                <span className="text-lg font-light text-white/70 tracking-normal">
                  tầng
                </span>
              </p>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-md border border-[#d4ae6f]/30 p-5 hover:bg-white/10 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] group">
              <h4 className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 group-hover:text-white/80 transition-colors">
                {""}
                Chủ đầu tư{""}
              </h4>
              <p className="text-sm text-gray-100 font-light leading-snug">
                {""}
                CT TNHH Đầu tư dự án Phượng Hoàng{""}
              </p>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-md border border-[#d4ae6f]/30 p-5 hover:bg-white/10 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] group">
              <h4 className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 group-hover:text-white/80 transition-colors">
                {""}
                Pháp lý sở hữu{""}
              </h4>
              <p className="text-sm text-gray-100 font-light leading-snug">
                {""}
                Sở hữu lâu dài{""}
              </p>
            </div>
          </div>
          {""}
          {/* Column 3 */}
          {""}
          <div className="flex flex-col gap-4">
            {""}
            {/* Tổng số căn hộ Card */}
            {""}
            <div className="bg-white/[0.03] backdrop-blur-md border border-[#d4ae6f]/50 p-4 lg:p-6 shadow-[0_10px_40px_rgba(212,174,111,0.15)] relative overflow-hidden group/main flex-1 h-full">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#d4ae6f]/20 blur-3xl opacity-50 group-hover/main:opacity-100 transition-opacity duration-500" />
              <h4 className="text-[#d4ae6f] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 relative z-10">
                {""}
                Tổng số Căn hộ{""}
              </h4>
              <p className="text-lg lg:text-xl lg:text-3xl lg:text-5xl font-bold mb-6 tracking-wide drop-shadow-lg bg-gradient-to-r from-[#f0e0ca] to-[#d4ae6f] bg-clip-text text-transparent relative z-10">
                {""}
                579{""}
                <span className="text-lg font-light tracking-normal uppercase text-white/70">
                  căn
                </span>
              </p>
              {""}
              {/* Interactive Apartment Types */}
              {""}
              <div className="flex flex-col gap-3 w-full relative z-10">
                <div className="flex items-center justify-between bg-black/20 border border-white/10 px-4 py-3 backdrop-blur-md hover:bg-[#d4ae6f]/20 hover:border-[#d4ae6f]/50 hover:shadow-[0_0_15px_rgba(212,174,111,0.3)] transition-all duration-300 cursor-pointer group/btn">
                  <div className="flex items-center gap-3">
                    <Bed className="w-5 h-5 text-[#d4ae6f] group-hover/btn:scale-110 transition-transform" />
                    <p className="text-white/80 text-sm font-medium group-hover/btn:text-[#f0e0ca] transition-colors">
                      1 Phòng ngủ
                    </p>
                  </div>
                  <span className="font-bold text-lg text-white group-hover/btn:text-[#d4ae6f] transition-colors">
                    43.08 m²
                  </span>
                </div>
                <div className="flex items-center justify-between bg-black/20 border border-white/10 px-4 py-3 backdrop-blur-md hover:bg-[#d4ae6f]/20 hover:border-[#d4ae6f]/50 hover:shadow-[0_0_15px_rgba(212,174,111,0.3)] transition-all duration-300 cursor-pointer group/btn">
                  <div className="flex items-center gap-3">
                    <Bed className="w-5 h-5 text-[#d4ae6f] group-hover/btn:scale-110 transition-transform" />
                    <p className="text-white/80 text-sm font-medium group-hover/btn:text-[#f0e0ca] transition-colors">
                      1 Phòng ngủ + 1
                    </p>
                  </div>
                  <span className="font-bold text-lg text-white group-hover/btn:text-[#d4ae6f] transition-colors">
                    49.46 – 50.48 m²
                  </span>
                </div>
                <div className="flex items-center justify-between bg-black/20 border border-white/10 px-4 py-3 backdrop-blur-md hover:bg-[#d4ae6f]/20 hover:border-[#d4ae6f]/50 hover:shadow-[0_0_15px_rgba(212,174,111,0.3)] transition-all duration-300 cursor-pointer group/btn">
                  <div className="flex items-center gap-3">
                    <BedDouble className="w-5 h-5 text-[#d4ae6f] group-hover/btn:scale-110 transition-transform" />
                    <p className="text-white/80 text-sm font-medium group-hover/btn:text-[#f0e0ca] transition-colors">
                      2 Phòng ngủ
                    </p>
                  </div>
                  <span className="font-bold text-lg text-white group-hover/btn:text-[#d4ae6f] transition-colors">
                    66.31 m²
                  </span>
                </div>
                <div className="flex items-center justify-between bg-black/20 border border-white/10 px-4 py-3 backdrop-blur-md hover:bg-[#d4ae6f]/20 hover:border-[#d4ae6f]/50 hover:shadow-[0_0_15px_rgba(212,174,111,0.3)] transition-all duration-300 cursor-pointer group/btn">
                  <div className="flex items-center gap-3">
                    <BedDouble className="w-5 h-5 text-[#d4ae6f] group-hover/btn:scale-110 transition-transform" />
                    <p className="text-white/80 text-sm font-medium group-hover/btn:text-[#f0e0ca] transition-colors">
                      3 Phòng ngủ
                    </p>
                  </div>
                  <span className="font-bold text-lg text-white group-hover/btn:text-[#d4ae6f] transition-colors">
                    99.01 m²
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {""}
      {/* Media Actions */}
      {""}
      <div className="max-w-6xl mx-auto px-8 mt-12 md:mt-20 flex flex-col sm:flex-row gap-4 lg:gap-6 items-center justify-center">
        <Button
          size="lg"
          icon={Play}
          className="w-full sm:w-auto px-10 bg-[#d4ae6f] text-slate-900 hover:bg-[#c39b5b] font-bold border-0"
          onClick={() => navigate("/video")}
        >
          {""}
          Xem Video{""}
        </Button>
        <Button
          variant="outline"
          size="lg"
          icon={Download}
          className="w-full sm:w-auto px-10 bg-white/10 text-white hover:bg-white/20 border-white/20 font-medium"
          onClick={() =>
            window.open(
              "https://fenica.vn/vr-360-virtual.html#/brochure",
              "_blank",
            )
          }
        >
          {""}
          Tải Brochure{""}
        </Button>
      </div>
    </div>
  );
}
