import { ArrowLeft, Check, X } from "lucide-react";
import mockUnits from "../../data/units.json";
export default function UnitCompare({ unitIds, onBack, isUpdating }) {
  const units = unitIds
    .map((id) => mockUnits.find((u) => u.id === id))
    .filter(Boolean);
  const attributes = [
    { key: "price", label: "Giá (Tỷ VNĐ)" },
    { key: "area", label: "Diện tích (m²)" },
    { key: "beds", label: "Phòng ngủ" },
    { key: "baths", label: "Phòng tắm" },
    { key: "block", label: "Block" },
    { key: "floor", label: "Tầng" },
    { key: "direction", label: "Hướng" },
    { key: "view", label: "View" },
    { key: "status", label: "Tình trạng" },
  ];
  return (
    <div className="absolute inset-0 bg-slate-50 p-4 flex flex-col z-50 overflow-y-auto cursor-auto">
      <div className="flex items-center gap-4 mb-8 sticky top-0 bg-slate-50 z-30 py-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white bg-slate-100 transition-colors shadow-sm"
        >
          <ArrowLeft size={24} />
        </button>
        <h3 className="text-lg lg:text-xl font-bold text-slate-900">
          So sánh <span className="text-primary">{units.length}</span> căn hộ
        </h3>
      </div>
      <div className="flex-1 max-w-6xl mx-auto w-full bg-white shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="p-4 border-b border-slate-200 bg-slate-50 w-32 md:w-48 sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-xs">
                    Tiêu chí
                  </span>
                </th>
                {""}
                {units.map((unit) => (
                  <th
                    key={unit.id}
                    className="p-4 border-b border-l border-slate-200 bg-white min-w-[200px] md:min-w-[250px]"
                  >
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="w-16 h-16 md:w-24 md:h-24 overflow-hidden border border-slate-100 shadow-sm">
                        <img
                          src={unit.image}
                          alt={unit.id}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-lg lg:text-xl font-black text-slate-900">
                        {unit.id}
                      </h4>
                      <span
                        className={`px-2 py-1 md:px-3 text-[10px] font-bold uppercase tracking-wider ${isUpdating ? "bg-slate-100 text-slate-500" : (unit.status === "Đang mở bán" ? "bg-emerald-100 text-emerald-700" : unit.status === "Đã bán" ? "bg-slate-100 text-slate-500" : "bg-amber-100 text-amber-700")}`}
                      >
                        {""}
                        {isUpdating ? "Đang cập nhật" : unit.status}
                        {""}
                      </span>
                    </div>
                  </th>
                ))}
                {""}
              </tr>
            </thead>
            <tbody>
              {""}
              {attributes.map((attr, index) => (
                <tr
                  key={attr.key}
                  className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                >
                  <td className="p-4 border-b border-slate-100 font-bold text-slate-700 sticky left-0 bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    {""}
                    {attr.label}
                    {""}
                  </td>
                  {""}
                  {units.map((unit) => (
                    <td
                      key={unit.id}
                      className="p-4 border-b border-l border-slate-100 text-center font-medium text-slate-900"
                    >
                      {""}
                      {attr.key === "price" ? (
                        <span className="text-lg font-black text-accent">
                          {isUpdating ? "Đang cập nhật" : unit[attr.key]}
                        </span>
                      ) : (
                        (isUpdating && ["direction", "view", "status"].includes(attr.key)) ? "Đang cập nhật" : unit[attr.key]
                      )}
                      {""}
                    </td>
                  ))}
                  {""}
                </tr>
              ))}
              {""}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
