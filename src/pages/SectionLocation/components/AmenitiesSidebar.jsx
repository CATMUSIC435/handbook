import React, { useState } from 'react';
import { Loader2, List, X } from "lucide-react";

export default function AmenitiesSidebar({ 
  mapMode, 
  selectedLayer, 
  fetchNearbyAmenities, 
  isLoadingAmenities, 
  searchRadius, 
  setSearchRadius, 
  showAmenities, 
  setShowAmenities, 
  showCurvedLines,
  setShowCurvedLines,
  groupedAmenities 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (mapMode !== "interactive" || selectedLayer) return null;

  return (
    <>
      {/* Nút Toggle trên Mobile */}
      <button 
        className="md:hidden absolute top-16 right-4 z-[400] bg-white p-3 rounded-full shadow-lg border border-slate-100 text-[#d4ae6f] flex items-center justify-center transition-all active:scale-95"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <X size={20} /> : <List size={20} />}
      </button>

      {/* Bảng Danh mục tiện ích */}
      <div className={`
        absolute z-[400] bg-white/95 backdrop-blur-sm shadow-xl  border border-slate-100 flex flex-col overflow-hidden transition-all duration-300
        ${isExpanded 
          ? 'top-32 right-4 w-[calc(100vw-32px)] max-h-[60vh] opacity-100 visible origin-top-right' 
          : 'opacity-0 invisible md:opacity-100 md:visible md:top-16 md:right-6 md:w-[280px] md:max-h-[70vh] scale-95 md:scale-100 origin-top-right'}
      `}>
         <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex flex-col gap-2 shrink-0">
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
               className="w-24 h-1 bg-slate-200  appearance-none cursor-pointer"
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
    </>
  );
}
