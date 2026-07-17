import React from 'react';
import { motion } from 'motion/react';
import { X, Info, Layout, Home, CheckCircle2 } from 'lucide-react';
import FloorPlanImage from './FloorPlanImage';
import { useNavigate } from 'react-router-dom';

export default function TowerSideSheet({ selectedFloor, onClose }) {
  const navigate = useNavigate();

  if (!selectedFloor) return null;

  let floorPlanImage = "/assets/images/mb/mau-mat-bang-tang-03.png";
  const f = selectedFloor.floor;
  if (f <= 7) floorPlanImage = "/assets/images/mb/mau-mat-bang-tang-03.png";
  else if (f >= 8 && f <= 13) floorPlanImage = "/assets/images/mb/mau-mat-bang-tang-04.png";
  else if (f >= 14 && f <= 21) floorPlanImage = "/assets/images/mb/mau-mat-bang-tang-05.png";
  else if (f >= 22) floorPlanImage = "/assets/images/mb/mau-mat-bang-tang-06.png";

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 h-full w-full sm:w-80 md:w-96 bg-white shadow-2xl z-[400] flex flex-col border-l border-slate-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Tầng {selectedFloor.floor}
          </h2>
          <p className="text-sm font-medium text-[#d4ae6f] flex items-center gap-1 mt-1">
            <CheckCircle2 size={14} /> Trạng thái: Đang mở bán
          </p>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-white border border-slate-200 text-slate-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 rounded-full flex items-center justify-center transition-all shadow-sm"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 hide-scrollbar">
        
        {/* Floor Plan Image */}
        <div 
          className="w-full bg-slate-100 rounded-2xl p-4 border border-slate-200/60 shadow-inner group overflow-hidden relative cursor-pointer"
          onClick={() => navigate('/masterplan')}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-4">
            <span className="text-white text-sm font-bold flex items-center gap-1"><Layout size={16}/> Xem sơ đồ lớn</span>
          </div>
          <FloorPlanImage src={floorPlanImage} floor={f} />
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Độ cao</p>
            <p className="text-lg font-black text-slate-800">{selectedFloor.y} <span className="text-sm text-slate-500 font-medium">mét</span></p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Diện tích</p>
            <p className="text-lg font-black text-slate-800">1,240 <span className="text-sm text-slate-500 font-medium">m²</span></p>
          </div>
        </div>

        {/* Apartment Types */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Home size={16} className="text-[#d4ae6f]" /> Phân bổ căn hộ
          </h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-[#d4ae6f] transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">1PN</div>
                <span className="font-medium text-slate-700">Studio & 1 Phòng ngủ</span>
              </div>
              <span className="font-bold text-slate-900">4 căn</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-[#d4ae6f] transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">2PN</div>
                <span className="font-medium text-slate-700">2 Phòng ngủ</span>
              </div>
              <span className="font-bold text-slate-900">8 căn</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-[#d4ae6f] transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs group-hover:bg-amber-600 group-hover:text-white transition-colors">3PN</div>
                <span className="font-medium text-slate-700">3 Phòng ngủ (Góc)</span>
              </div>
              <span className="font-bold text-slate-900">2 căn</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Action */}
      <div className="p-6 border-t border-slate-100 bg-white">
        <button className="w-full py-4 bg-slate-900 hover:bg-[#d4ae6f] text-white font-bold rounded-xl shadow-xl shadow-slate-900/20 hover:shadow-[#d4ae6f]/30 transition-all flex items-center justify-center gap-2">
          <Info size={18} /> Xem bảng giá chi tiết
        </button>
      </div>
    </motion.div>
  );
}
