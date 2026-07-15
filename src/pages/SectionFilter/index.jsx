import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  BedDouble,
  Ruler,
  Tag,
  Building2,
  MapPin,
  Eye,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import UnitDetail from "../../components/ui/UnitDetail";
import UnitCompare from "../../components/ui/UnitCompare";
import CustomSelect from "../../components/ui/CustomSelect";
import mockUnits from "../../data/units.json";
export default function SectionFilter() {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [filters, setFilters] = useState({
    block: "",
    beds: "",
    direction: "",
    status: "Đang mở bán",
  });
  const filteredUnits = useMemo(() => {
    return mockUnits.filter((unit) => {
      if (filters.block && unit.block !== filters.block) return false;
      if (filters.beds && unit.beds.toString() !== filters.beds) return false;
      if (filters.direction && unit.direction !== filters.direction)
        return false;
      if (filters.status && unit.status !== filters.status) return false;
      return true;
    });
  }, [filters]);
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  if (selectedUnit) {
    return (
      <div className="relative min-h-screen">
        <UnitDetail
          unitId={selectedUnit}
          onBack={() => setSelectedUnit(null)}
        />
      </div>
    );
  }
  if (isComparing && compareList.length > 0) {
    return (
      <div className="relative min-h-screen">
        <UnitCompare
          unitIds={compareList}
          onBack={() => setIsComparing(false)}
        />
      </div>
    );
  }
  const handleToggleCompare = (e, unitId) => {
    e.stopPropagation();
    /* Ngăn sự kiện click lan ra ngoài card (mở UnitDetail) */ if (
      compareList.includes(unitId)
    ) {
      setCompareList(compareList.filter((id) => id !== unitId));
    } else {
      if (compareList.length >= 3) {
        alert("Bạn chỉ có thể so sánh tối đa 3 căn hộ cùng lúc.");
        return;
      }
      setCompareList([...compareList, unitId]);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col overflow-hidden">
      <div className="mb-6 flex justify-between items-end">
        <div>
          {/* <h2 className="text-lg lg:text-xl font-bold text-slate-900 mb-2">
 Tìm Kiếm Căn Hộ
 </h2>
 <p className="text-slate-500">
 Sử dụng bộ lọc để tìm căn hộ ưng ý nhất
 </p> */}
        </div>
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 font-bold text-slate-700 shadow-sm"
        >
          <SlidersHorizontal size={18} />
          {""}
          {showMobileFilters ? "Ẩn Lọc" : "Bộ Lọc"}
          {""}
        </button>
      </div>
      <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-0">
        {""}
        {/* Sidebar Filters */}
        {""}
        <div
          className={`w-full lg:w-80 bg-white shadow-sm border border-slate-200 p-4 lg:p-6 shrink-0 lg:overflow-y-auto transition-all ${showMobileFilters ? "flex flex-col" : "hidden lg:flex lg:flex-col"}`}
        >
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="text-primary" size={24} />
              <h3 className="text-lg lg:text-xl font-bold text-slate-900">
                Bộ Lọc
              </h3>
            </div>
          </div>
          <div className="space-y-5">
            <div className="relative z-40">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Block
              </label>
              <CustomSelect
                value={filters.block}
                onChange={(val) => handleFilterChange("block", val)}
                options={[
                  { value: "", label: "Tất cả Block" },
                  { value: "A", label: "Block A" },
                  { value: "B", label: "Block B" },
                ]}
              />
            </div>
            <div className="relative z-30">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Số phòng ngủ
              </label>
              <CustomSelect
                value={filters.beds}
                onChange={(val) => handleFilterChange("beds", val)}
                options={[
                  { value: "", label: "Tất cả" },
                  { value: "1", label: "1 Phòng ngủ" },
                  { value: "2", label: "2 Phòng ngủ" },
                  { value: "3", label: "3 Phòng ngủ" },
                ]}
              />
            </div>
            <div className="relative z-20">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Hướng
              </label>
              <CustomSelect
                value={filters.direction}
                onChange={(val) => handleFilterChange("direction", val)}
                options={[
                  { value: "", label: "Tất cả Hướng" },
                  { value: "Đông", label: "Đông" },
                  { value: "Đông Nam", label: "Đông Nam" },
                  { value: "Nam", label: "Nam" },
                  { value: "Tây Bắc", label: "Tây Bắc" },
                ]}
              />
            </div>
            <div className="relative z-10">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tình trạng
              </label>
              <CustomSelect
                value={filters.status}
                onChange={(val) => handleFilterChange("status", val)}
                options={[
                  { value: "", label: "Tất cả Tình trạng" },
                  { value: "Đang mở bán", label: "Đang mở bán" },
                  { value: "Sắp mở bán", label: "Sắp mở bán" },
                  { value: "Đã bán", label: "Đã bán" },
                ]}
              />
            </div>
            <button
              onClick={() =>
                setFilters({ block: "", beds: "", direction: "", status: "" })
              }
              className="w-full py-3 mt-2 text-slate-500 font-medium hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100"
            >
              {""}
              Xóa bộ lọc{""}
            </button>
          </div>
        </div>
        {""}
        {/* Results Area */}
        {""}
        <div className="flex-1 bg-transparent flex flex-col min-h-0 overflow-y-auto hide-scrollbar pb-24 lg:pb-0">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-slate-50 z-10 py-2">
            <h3 className="text-lg lg:text-xl font-bold text-slate-900">
              {""}
              Kết quả:{""}
              <span className="text-primary">{filteredUnits.length}</span> căn
              hộ{""}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            <AnimatePresence>
              {""}
              {filteredUnits.map((unit) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit.id)}
                  className="bg-white shadow-sm border border-slate-200 p-4 lg:p-6 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg lg:text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {unit.id}
                      </h4>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1 font-medium">
                        <Building2 size={14} /> Block {unit.block} • Tầng{""}
                        {unit.floor}
                        {""}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${unit.status === "Đang mở bán" ? "bg-emerald-100 text-emerald-700" : unit.status === "Đã bán" ? "bg-slate-100 text-slate-500" : "bg-amber-100 text-amber-700"}`}
                      >
                        {""}
                        {unit.status}
                        {""}
                      </span>
                      <button
                        onClick={(e) => handleToggleCompare(e, unit.id)}
                        className={`text-xs font-bold px-3 py-1.5 border transition-colors flex items-center gap-1 ${compareList.includes(unit.id) ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:border-primary hover:text-primary"}`}
                      >
                        {""}
                        {compareList.includes(unit.id)
                          ? "Đang so sánh"
                          : "+ So sánh"}
                        {""}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <BedDouble size={18} className="text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">
                        {unit.beds} PN
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ruler size={18} className="text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">
                        {unit.area} m²
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">
                        {unit.direction}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye size={18} className="text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700 truncate">
                        {unit.view}
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm text-slate-500 font-medium">
                      Giá dự kiến
                    </span>
                    <span className="text-lg lg:text-xl font-bold text-accent">
                      {unit.price} Tỷ
                    </span>
                  </div>
                </motion.div>
              ))}
              {""}
            </AnimatePresence>
            {""}
            {filteredUnits.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
                <Search size={48} className="mb-4 opacity-30" />
                <p className="text-lg font-medium">
                  Không tìm thấy căn hộ phù hợp với bộ lọc.
                </p>
              </div>
            )}
            {""}
          </div>
        </div>
      </div>
      {""}
      {/* Floating Compare Bar */}
      {""}
      <AnimatePresence>
        {""}
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-4 flex items-center gap-4 lg:gap-6 shadow-2xl shadow-slate-900/50 border border-slate-700 w-[90%] md:w-auto"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 flex items-center justify-center font-bold text-sm">
                {""}
                {compareList.length}
                {""}
              </div>
              <span className="font-semibold hidden sm:inline">
                căn hộ đang chọn
              </span>
            </div>
            <div className="flex gap-3">
              {""}
              {compareList.map((id) => (
                <div
                  key={id}
                  className="px-3 py-1 bg-white/10 text-sm font-medium flex items-center gap-2"
                >
                  {""}
                  {id}
                  {""}
                  <button
                    onClick={() =>
                      setCompareList(compareList.filter((uid) => uid !== id))
                    }
                    className="hover:text-amber-400 p-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {""}
            </div>
            <button
              onClick={() => setIsComparing(true)}
              className="ml-auto px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg transition-colors whitespace-nowrap"
            >
              {""}
              So sánh ngay{""}
            </button>
          </motion.div>
        )}
        {""}
      </AnimatePresence>
    </div>
  );
}
