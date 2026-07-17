import React, { useState, useRef, useEffect } from 'react';
import { floor3MapData, mockFloors } from './data';

export default function FloorPlanImage({ src, floor }) {
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const imgRef = useRef(null);
  const isFloor3 = floor <= 7;

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setImgSize({ w: imgRef.current.naturalWidth, h: imgRef.current.naturalHeight });
    }
  }, [src]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-500 bg-white">
      <img 
        ref={imgRef}
        src={src} 
        alt={`Mặt bằng tầng ${floor}`} 
        className="w-full h-auto object-contain"
        onLoad={(e) => setImgSize({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
        }}
      />
      {isFloor3 && imgSize.w > 0 && floor3MapData.map(point => {
        const left = (point.x / imgSize.w) * 100;
        const top = (point.y / imgSize.h) * 100;
        const isSelected = selectedHotspot === point.id;
        const unitData = mockFloors[0].units.find(u => u.code === point.id);
        
        return (
          <div 
            key={point.id}
            className={`absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-all -translate-x-1/2 -translate-y-1/2 group/pin z-20 ${isSelected ? 'bg-[#d4ae6f] scale-125' : 'bg-rose-500'}`}
            style={{ left: `${left}%`, top: `${top}%` }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedHotspot(isSelected ? null : point.id);
            }}
          >
            {/* Tooltip khi chưa click */}
            {!isSelected && (
              <div className="absolute opacity-0 group-hover/pin:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded pointer-events-none transition-opacity whitespace-nowrap z-30">
                {point.id}
              </div>
            )}

            {/* Popup chi tiết khi click */}
            {isSelected && unitData && (
              <div 
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white w-[260px] rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-[100] origin-bottom animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="h-36 bg-slate-100 relative">
                  <img 
                    src={unitData.room3dImage} 
                    alt={`Mặt bằng 3D ${unitData.type}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur rounded text-xs font-black text-slate-900 shadow-sm">
                    {point.id}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-slate-900 text-base">{unitData.type}</h4>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      unitData.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                      unitData.status === 'sold' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {unitData.status === 'available' ? 'Mở bán' : unitData.status === 'sold' ? 'Đã bán' : 'Booking'}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Tim tường</span>
                        <span className="font-bold text-slate-700">{unitData.builtUpArea} m²</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Thông thủy</span>
                        <span className="font-bold text-slate-700">{unitData.carpetArea} m²</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 text-xs">Giá tham khảo:</span>
                    <span className="font-black text-lg text-[#d4ae6f]">{unitData.price}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
