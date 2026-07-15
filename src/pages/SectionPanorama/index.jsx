import { useState, useRef } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

export default function SectionPanorama() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden text-white relative">
      {/* Main Viewer */}
      <div
        ref={containerRef}
        className="flex-1 relative w-full h-full bg-black"
      >
        <iframe
          src="https://fenica.vn/vr-360.html"
          title="Fenica VR 360"
          className="w-full h-full border-none"
          allowFullScreen
          allow="xr-spatial-tracking; gyroscope; accelerometer"
        ></iframe>

        {/* Fullscreen Control Overlay */}
        <div className="absolute bottom-8 right-8 z-30 pointer-events-auto">
          <button
            onClick={toggleFullscreen}
            className="bg-black/50 backdrop-blur p-4 shadow-lg border border-white/10 text-white hover:bg-white/20 transition-colors"
            title={isFullscreen ? "Thu nhỏ" : "Phóng to toàn màn hình"}
          >
            {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
}
