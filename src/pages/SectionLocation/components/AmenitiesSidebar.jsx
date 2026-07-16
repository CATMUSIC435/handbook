import React from 'react';
import { Loader2 } from "lucide-react";

export default function AmenitiesSidebar({ 
  mapMode, 
  selectedLayer, 
  fetchNearbyAmenities, 
  isLoadingAmenities, 
  searchRadius, 
  setSearchRadius, 
  showAmenities, 
  setShowAmenities, 
  groupedAmenities 
}) {
  if (mapMode !== "interactive" || selectedLayer) return null;

  return (
    <div className="absolute top-20 right-4 sm:right-6 w-[280px] max-h-[70vh] bg-white/95 backdrop-blur-sm shadow-xl rounded-xl border border-slate-100 flex flex-col z-[400] overflow-hidden">
       <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex flex-col gap-2">
         <div className="flex items-center justify-between">
           <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Danh mục tiện ích</h3>
           <button 
             onClick={fetchNearbyAmenities}
             className="text-slate-400 hover:text-indigo-600 transition-colors"
             title="Quét lại khu vực"
           >
             <Loader2 size={14} className={isLoadingAmenities ? "animate-spin text-indigo-600" : ""} />
           </button>
         </div>
         <div className="flex items-center justify-between mt-1">
           <label className="text-[10px] font-medium text-slate-600">Bán kính quét: {searchRadius / 1000} km</label>
           <input 
             type="range" 
             min="1" max="20" 
             value={searchRadius / 1000} 
             onChange={(e) => setSearchRadius(parseInt(e.target.value) * 1000)}
             className="w-24 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
           />
         </div>
         <div className="flex items-center justify-between">
           <label className="text-[10px] font-medium text-slate-600">Hiển thị trên bản đồ</label>
           <button 
             onClick={() => setShowAmenities(!showAmenities)}
             className={`w-7 h-4 rounded-full relative transition-colors ${showAmenities ? 'bg-green-500' : 'bg-slate-300'}`}
           >
             <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${showAmenities ? 'translate-x-3' : 'translate-x-0'}`} />
           </button>
         </div>
         <div className="flex items-center justify-between">
           <label className="text-[10px] font-medium text-slate-600">Đường cong chỉ dẫn</label>
           <button 
             onClick={() => setShowCurvedLines(!showCurvedLines)}
             className={`w-7 h-4 rounded-full relative transition-colors ${showCurvedLines ? 'bg-green-500' : 'bg-slate-300'}`}
           >
             <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${showCurvedLines ? 'translate-x-3' : 'translate-x-0'}`} />
           </button>
         </div>
       </div>
       <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {Object.entries(groupedAmenities).map(([type, items]) => (
            <div key={type}>
              <h4 className="text-[10px] font-bold text-[#d4ae6f] uppercase tracking-wider mb-1.5">{type}</h4>
              <ul className="space-y-1.5">
                {items.map((item, idx) => {
                  const IconCmp = item.icon;
                  return (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <div className="mt-0.5 text-[#d4ae6f] shrink-0">
                        <IconCmp size={12} />
                      </div>
                      <div className="leading-tight">
                        <div className="font-semibold text-slate-800 line-clamp-1" title={item.name}>{item.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{item.dist} • {item.time}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
       </div>
    </div>
  );
}
