import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Scale,
  ArrowRightLeft,
  Check,
  X,
  Ruler,
  Tag,
  Compass,
  Building2,
  Layers,
  Eye,
} from "lucide-react";
import MOCK_UNITS from "../../data/units.json";
import CustomSelect from "../../components/ui/CustomSelect";

export default function SectionCompare() {
  const [unit1Id, setUnit1Id] = useState("A-1205");
  const [unit2Id, setUnit2Id] = useState("A-1608");

  const unit1 = useMemo(
    () => MOCK_UNITS.find((u) => u.id === unit1Id) || null,
    [unit1Id],
  );
  const unit2 = useMemo(
    () => MOCK_UNITS.find((u) => u.id === unit2Id) || null,
    [unit2Id],
  );

  const UnitSelector = ({ value, onChange, label }) => {
    const options = useMemo(
      () =>
        MOCK_UNITS.map((u) => ({
          label: `${u.code} (${u.beds}PN - ${u.area}m²)`,
          value: u.id,
        })),
      [],
    );

    return (
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </label>
        <CustomSelect
          value={value}
          onChange={onChange}
          options={options}
          className="py-4 pl-6 pr-4 bg-white font-bold text-lg border-slate-200"
        />
      </div>
    );
  };

  const CompareRow = ({
    icon: Icon,
    label,
    val1,
    val2,
    highlightBetter = false,
    lowerIsBetter = false,
  }) => {
    // Basic logic to highlight differences (if numbers)
    let c1 = "text-slate-900 font-bold";
    let c2 = "text-slate-900 font-bold";

    if (
      highlightBetter &&
      typeof val1 === "number" &&
      typeof val2 === "number"
    ) {
      if (val1 !== val2) {
        if ((val1 > val2 && !lowerIsBetter) || (val1 < val2 && lowerIsBetter)) {
          c1 = "text-emerald-600 font-black";
          c2 = "text-slate-500 font-medium";
        } else {
          c2 = "text-emerald-600 font-black";
          c1 = "text-slate-500 font-medium";
        }
      }
    }

    return (
      <div className="grid grid-cols-12 gap-4 py-6 border-b border-slate-100 items-center hover:bg-slate-50/50 transition-colors px-4">
        <div className="col-span-12 md:col-span-4 flex items-center gap-3 text-slate-500 font-semibold mb-2 md:mb-0">
          <div className="w-8 h-8 bg-slate-100 flex items-center justify-center shrink-0">
            <Icon size={16} />
          </div>
          {label}
        </div>
        <div className="col-span-6 md:col-span-4 text-center md:text-left text-lg">
          <span className={c1}>{val1}</span>
        </div>
        <div className="col-span-6 md:col-span-4 text-center md:text-left text-lg border-l md:border-l-0 border-slate-200 pl-4 md:pl-0">
          <span className={c2}>{val2}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto">
      <div className="max-w-full mx-auto w-full mb-8 mt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-bold text-sm mb-4">
          <Scale size={16} /> Công cụ phân tích
        </div>
        {/* <h2 className="text-xl lg:text-xl font-bold text-slate-900 mb-2">So Sánh Căn Hộ</h2>
 <p className="text-slate-500 text-lg">Đối chiếu chi tiết các thông số để đưa ra quyết định lựa chọn tốt nhất</p> */}
      </div>

      <div className="max-w-screen mx-auto w-full pb-20">
        <div className="bg-white shadow-xl border border-slate-100 overflow-hidden">
          {/* Top Selectors Area */}
          <div className="bg-slate-900 p-6 md:p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 relative z-10">
              <div className="flex-1 w-full">
                <UnitSelector
                  label="Căn hộ thứ nhất"
                  value={unit1Id}
                  onChange={setUnit1Id}
                />
              </div>

              <div className="w-10 h-10 md:w-14 md:h-14 bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/40 z-10 my-2 md:my-0">
                <span className="font-black text-xs md:text-sm italic">VS</span>
              </div>

              <div className="flex-1 w-full">
                <UnitSelector
                  label="Căn hộ thứ hai"
                  value={unit2Id}
                  onChange={setUnit2Id}
                />
              </div>
            </div>
          </div>

          {/* Compare Content */}
          <div className="p-4 md:p-8">
            <div className="grid grid-cols-12 gap-4 px-4 mb-4 text-sm font-bold text-slate-400 uppercase tracking-wider hidden md:grid">
              <div className="col-span-4">Tiêu chí</div>
              <div className="col-span-4 text-primary">{unit1?.code}</div>
              <div className="col-span-4 text-rose-500">{unit2?.code}</div>
            </div>

            <div className="flex flex-col">
              <CompareRow
                icon={Tag}
                label="Giá Bán (Tỷ VNĐ)"
                val1={unit1?.price}
                val2={unit2?.price}
                highlightBetter
                lowerIsBetter
              />
              <CompareRow
                icon={Ruler}
                label="Diện tích (m²)"
                val1={unit1?.area}
                val2={unit2?.area}
                highlightBetter
              />
              <CompareRow
                icon={Compass}
                label="Hướng"
                val1={unit1?.direction}
                val2={unit2?.direction}
              />
              <CompareRow
                icon={Eye}
                label="Tầm nhìn (View)"
                val1={unit1?.view}
                val2={unit2?.view}
              />
              <CompareRow
                icon={Building2}
                label="Block"
                val1={unit1?.block}
                val2={unit2?.block}
              />
              <CompareRow
                icon={Layers}
                label="Tầng"
                val1={unit1?.floor}
                val2={unit2?.floor}
              />
            </div>

            {/* Images Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 px-4">
              <div className="flex flex-col gap-4">
                <p className="font-bold text-slate-500 text-sm uppercase tracking-wider text-center">
                  Mặt bằng {unit1?.code}
                </p>
                <div className="bg-slate-50 p-4 border border-slate-100">
                  <img
                    src={unit1?.layout}
                    alt={unit1?.code}
                    className="w-full h-48 object-contain mix-blend-multiply"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-bold text-slate-500 text-sm uppercase tracking-wider text-center">
                  Mặt bằng {unit2?.code}
                </p>
                <div className="bg-slate-50 p-4 border border-slate-100">
                  <img
                    src={unit2?.layout}
                    alt={unit2?.code}
                    className="w-full h-48 object-contain mix-blend-multiply"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
