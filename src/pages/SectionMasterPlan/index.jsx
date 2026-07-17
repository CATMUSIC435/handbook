import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Maximize2, Minimize2, Search } from "lucide-react";
import UnitDetail from "../../components/ui/UnitDetail";

import { floor3MapData, mockFloors } from "../SectionLocation/components/Tower3D/data";

export default function SectionMasterPlan() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef(null);

  // Available floors based on images (03, 04, 05, 06)
  const floors = [3, 4, 5, 6];

  // States for viewing
  const [selectedFloor, setSelectedFloor] = useState(floors[0]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  
  // States for hotspots
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  // States for drag-to-scroll
  const viewportRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 1));

  // Mouse handlers for drag-to-scroll
  const onMouseDown = (e) => {
    if (!viewportRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - viewportRef.current.offsetLeft);
    setStartY(e.pageY - viewportRef.current.offsetTop);
    setScrollLeft(viewportRef.current.scrollLeft);
    setScrollTop(viewportRef.current.scrollTop);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e) => {
    if (!isDragging || !viewportRef.current) return;
    e.preventDefault();
    const x = e.pageX - viewportRef.current.offsetLeft;
    const y = e.pageY - viewportRef.current.offsetTop;
    const walkX = (x - startX) * 2;
    const walkY = (y - startY) * 2;
    viewportRef.current.scrollLeft = scrollLeft - walkX;
    viewportRef.current.scrollTop = scrollTop - walkY;
  };

  if (selectedUnit) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <UnitDetail
          unitId={selectedUnit}
          onBack={() => setSelectedUnit(null)}
        />
      </div>
    );
  }

  const floorImg = `/assets/images/mb/mau-mat-bang-tang-0${selectedFloor}.png`;

  return (
    <div className="min-h-[100vh] bg-slate-50 flex flex-col" onClick={() => setSelectedHotspot(null)}>
      <div
        ref={containerRef}
        className={`flex-1 flex flex-col relative bg-[#070B19] overflow-hidden shadow-xl border border-slate-200 ${isFullscreen ? "fixed inset-0 z-50 border-none m-0" : "min-h-[75vh]"}`}
      >
        {/* Navigation / Selection Bar - Fixed at top */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white border-b border-slate-200 p-4 md:px-8 z-40 relative shadow-sm">
          {/* Floor Selector */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-2">
            <h3 className="text-xl font-bold text-slate-900 pr-4">
              Mặt Bằng Tầng
            </h3>
            {floors.map((floor) => (
              <button
                key={floor}
                onClick={() => {
                  setSelectedFloor(floor);
                  setSelectedHotspot(null);
                }}
                className={`w-10 h-10 flex-shrink-0 font-bold transition-all ${
                  selectedFloor === floor
                    ? "bg-[#d4ae6f] text-slate-900 shadow-md scale-110"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {floor}
              </button>
            ))}
          </div>
        </div>

        {/* Controls Overlay */}
        <div className="absolute top-24 right-6 z-40 flex flex-col gap-3">
          <div className="bg-white/90 backdrop-blur shadow-lg border border-slate-100 flex flex-col overflow-hidden">
            <button
              onClick={handleZoomIn}
              className="p-3 hover:bg-slate-100 text-slate-700 transition-colors border-b border-slate-100"
            >
              <Search size={20} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-3 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <span className="font-bold text-xl block leading-none">-</span>
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="bg-white/90 backdrop-blur p-3 shadow-lg border border-slate-100 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>

        {/* Viewport - Zoomable Image Area */}
        <div 
          ref={viewportRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className={`flex-1 overflow-auto bg-[#070B19] relative custom-scrollbar select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          <div
            className="flex items-center justify-center p-4 md:p-8 transition-all duration-300 mx-auto h-full"
            style={{
              minWidth: zoomLevel > 1 ? `${1200 * zoomLevel}px` : "100%",
              width: zoomLevel > 1 ? `${100 * zoomLevel}%` : "100%",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFloor}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative inline-block drop-shadow-2xl"
              >
                <img
                  src={floorImg}
                  alt={`Mặt Bằng Tầng ${selectedFloor}`}
                  className="w-auto h-auto max-w-full max-h-[80vh] object-contain pointer-events-none"
                  onLoad={(e) => setImgSize({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/images/mb/mau-mat-bang-tang-03.png";
                  }}
                />
                
                {/* Hotspots overlay */}
                {selectedFloor === 3 && imgSize.w > 0 && floor3MapData.map(point => {
                  const left = (point.x / imgSize.w) * 100;
                  const top = (point.y / imgSize.h) * 100;
                  const isSelected = selectedHotspot === point.id;
                  const unitData = mockFloors[0].units.find(u => u.code === point.id);
                  
                  return (
                    <div 
                      key={point.id}
                      className={`absolute w-5 h-5 md:w-8 md:h-8 rounded-full border-[3px] border-white shadow-lg cursor-pointer hover:scale-125 transition-all -translate-x-1/2 -translate-y-1/2 group/pin z-20 flex items-center justify-center ${isSelected ? 'bg-[#d4ae6f] scale-125' : 'bg-emerald-500/80 hover:bg-emerald-500'}`}
                      style={{ left: `${left}%`, top: `${top}%` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHotspot(isSelected ? null : point.id);
                      }}
                    >
                      <span className="text-white text-[8px] md:text-xs font-bold opacity-0 group-hover/pin:opacity-100 transition-opacity drop-shadow-md">
                        {point.id.split('-')[1]}
                      </span>

                      {/* Popup chi tiết khi click */}
                      {isSelected && unitData && (
                        <div 
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white w-[280px] rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-[100] origin-bottom animate-in fade-in zoom-in duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="h-40 bg-slate-100 relative">
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
                          <div className="p-4 cursor-default">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-bold text-slate-900 text-base">{unitData.type}</h4>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                                unitData.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                                unitData.status === 'sold' ? 'bg-rose-100 text-rose-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {unitData.status === 'available' ? 'Mở bán' : unitData.status === 'sold' ? 'Đã bán' : 'Booking'}
                              </span>
                            </div>
                            
                            <div className="space-y-3 mb-4">
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="text-slate-400 block mb-0.5 text-xs">Tim tường</span>
                                  <span className="font-bold text-slate-700">{unitData.builtUpArea} m²</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block mb-0.5 text-xs">Thông thủy</span>
                                  <span className="font-bold text-slate-700">{unitData.carpetArea} m²</span>
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => setSelectedUnit(point.id)}
                              className="w-full mt-4 bg-slate-900 text-white font-bold py-2.5 rounded-none hover:bg-slate-800 transition-colors text-sm"
                            >
                              Xem chi tiết căn hộ
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
