import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Maximize2, Minimize2, Search } from "lucide-react";
import UnitDetail from "../../components/ui/UnitDetail";

export default function SectionMasterPlan() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef(null);

  // Available floors based on images (03, 04, 05, 06)
  const floors = [3, 4, 5, 6];

  // States for viewing
  const [selectedFloor, setSelectedFloor] = useState(floors[0]);
  const [selectedUnit, setSelectedUnit] = useState(null);

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
    <div className="min-h-[100vh] bg-slate-50 flex flex-col">
      <div
        ref={containerRef}
        className={`flex-1 flex flex-col relative bg-white overflow-hidden shadow-xl border border-slate-200 ${isFullscreen ? "fixed inset-0 z-50 border-none m-0" : "min-h-[75vh]"}`}
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
                onClick={() => setSelectedFloor(floor)}
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
        <div className="flex-1 overflow-auto bg-slate-100 cursor-grab active:cursor-grabbing relative custom-scrollbar">
          <div
            className="flex items-center justify-center p-4 md:p-8 transition-all duration-300 mx-auto"
            style={{
              minWidth: zoomLevel > 1 ? `${1200 * zoomLevel}px` : "100%",
              minHeight: zoomLevel > 1 ? `${800 * zoomLevel}px` : "100%",
              width: zoomLevel > 1 ? `${100 * zoomLevel}%` : "100%",
              height: zoomLevel > 1 ? `${100 * zoomLevel}%` : "100%",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedFloor}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={floorImg}
                alt={`Mặt Bằng Tầng ${selectedFloor}`}
                className="w-full h-full object-contain drop-shadow-2xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/images/mb/mau-mat-bang-tang-03.png";
                }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
