import React, { useRef, useState } from "react";
import L from "leaflet";
import { Map, Image as ImageIcon, Navigation, Box } from "lucide-react";
import osmtogeojson from 'osmtogeojson';
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

// Fix leaflet default icon issue
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Hooks
import { useAmenities } from "./hooks/useAmenities";
import { useMapDraw } from "./hooks/useMapDraw";
import { useOverpass } from "./hooks/useOverpass";

// Components
import InteractiveMap from "./components/InteractiveMap";
import MapToolbar from "./components/MapToolbar";
import AmenitiesSidebar from "./components/AmenitiesSidebar";
import PropertySidebar from "./components/PropertySidebar";
import OverpassModal from "./components/OverpassModal";
import Tower3DViewer from "./components/Tower3D";

import Mapbox3DViewer from "./components/Mapbox3DViewer";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const centerPosition = [10.946522643033038, 106.74770128793497];

export default function SectionLocation() {
  const featureGroupRef = useRef();
  const fileInputRef = useRef();

  // State for menus
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [showCurvedLines, setShowCurvedLines] = useState(false);

  // Custom Hooks
  const {
    dynamicAmenities,
    isLoadingAmenities,
    searchRadius,
    setSearchRadius,
    showAmenities,
    setShowAmenities,
    fetchNearbyAmenities,
    amenitiesToUse,
    groupedAmenities
  } = useAmenities(centerPosition);

  const {
    mapMode, setMapMode,
    drawnItems, setDrawnItems,
    selectedLayer, setSelectedLayer,
    drawStyle, setDrawStyle,
    sidebarData, setSidebarData,
    handleSidebarChange,
    handleDrawStyleChange,
    saveDrawings,
    exportGeoJSON,
    exportImage
  } = useMapDraw();

  const {
    showOverpassModal, setShowOverpassModal,
    overpassQuery, setOverpassQuery,
    isOverpassLoading,
    handleRunOverpassQuery
  } = useOverpass(setDrawnItems, drawStyle);

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const applyStyles = (geojson) => {
            if (geojson && geojson.features) {
              geojson.features.forEach(f => {
                f.properties = f.properties || {};
                if (!f.properties.style) {
                  f.properties.style = { ...drawStyle, className: 'animated-map-shape' };
                }
              });
            }
            return geojson;
          };

          const json = JSON.parse(event.target.result);
          if (json && json.type === 'FeatureCollection') {
            setDrawnItems(applyStyles(json));
          } else if (json && json.elements) {
            const geojson = osmtogeojson(json);
            if (geojson && geojson.type === 'FeatureCollection') {
              setDrawnItems(applyStyles(geojson));
            } else {
              alert("Không thể chuyển đổi dữ liệu OSM sang GeoJSON.");
            }
          } else {
            alert("File JSON không hợp lệ hoặc không đúng định dạng GeoJSON/OSM JSON.");
          }
        } catch (error) {
          alert("Lỗi khi đọc file JSON.");
        }
      };
      reader.readAsText(file);
    }
    e.target.value = null;
  };

  const projectIcon = L.divIcon({
    className: "custom-project-icon",
    html: `
      <div class="project-marker-container">
        <div class="project-marker-ping"></div>
        <div class="project-marker-core"></div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex">
        {/* Map Area */}
        <div className="flex-1 relative bg-white shadow-xl overflow-hidden border border-slate-200">
          
          {/* Toggle buttons */}
          <div className="absolute top-4 left-16 flex flex-row bg-white shadow-lg border border-slate-100 p-1 z-[400] rounded-md max-w-[calc(100vw-80px)] overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setMapMode("interactive")}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors rounded-md whitespace-nowrap ${mapMode === "interactive" ? "bg-[#d4ae6f] text-slate-900 shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <Map size={16} /> <span className="hidden sm:inline">Bản đồ tương tác</span><span className="sm:hidden">Tương tác</span>
            </button>
            <button
              onClick={() => setMapMode("svg")}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors rounded-md whitespace-nowrap ${mapMode === "svg" ? "bg-[#d4ae6f] text-slate-900 shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <ImageIcon size={16} /> <span className="hidden sm:inline">Bản đồ đồ họa</span><span className="sm:hidden">Đồ họa</span>
            </button>
            <button
              onClick={() => setMapMode("mapbox3d")}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors rounded-md whitespace-nowrap ${mapMode === "mapbox3d" ? "bg-blue-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg> 
              <span className="hidden sm:inline">Mapbox 3D</span><span className="sm:hidden">Mapbox</span>
            </button>
          </div>

          <MapToolbar
            mapMode={mapMode}
            showStyleMenu={showStyleMenu}
            setShowStyleMenu={setShowStyleMenu}
            drawStyle={drawStyle}
            handleDrawStyleChange={handleDrawStyleChange}
            setShowOverpassModal={setShowOverpassModal}
            fileInputRef={fileInputRef}
            exportGeoJSON={() => exportGeoJSON(featureGroupRef)}
            exportImage={exportImage}
          />

          <input 
            type="file" 
            accept=".json,application/json" 
            ref={fileInputRef} 
            onChange={handleImportJSON} 
            className="hidden" 
          />

          <AmenitiesSidebar
            mapMode={mapMode}
            selectedLayer={selectedLayer}
            fetchNearbyAmenities={fetchNearbyAmenities}
            isLoadingAmenities={isLoadingAmenities}
            searchRadius={searchRadius}
            setSearchRadius={setSearchRadius}
            showAmenities={showAmenities}
            setShowAmenities={setShowAmenities}
            showCurvedLines={showCurvedLines}
            setShowCurvedLines={setShowCurvedLines}
            groupedAmenities={groupedAmenities}
          />
          
          <PropertySidebar
            selectedLayer={selectedLayer}
            setSelectedLayer={setSelectedLayer}
            sidebarData={sidebarData}
            handleSidebarChange={handleSidebarChange}
          />

          <InteractiveMap 
            mapMode={mapMode}
            centerPosition={centerPosition}
            showAmenities={showAmenities}
            amenitiesToUse={amenitiesToUse}
            drawnItems={drawnItems}
            featureGroupRef={featureGroupRef}
            drawStyle={drawStyle}
            setSelectedLayer={setSelectedLayer}
            projectIcon={projectIcon}
            showCurvedLines={showCurvedLines}
          />

          {mapMode === "svg" && (
            <div className="w-full h-full bg-slate-50 flex items-center justify-center relative">
              <img
                src="/assets/images/vi-tri.svg"
                alt="Map Location"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80";
                }}
              />
              <div className="absolute inset-0 bg-[#d4ae6f]/5 pointer-events-none" />
            </div>
          )}

          {mapMode === "mapbox3d" && (
            <div className="w-full h-full relative z-[300]">
              <Mapbox3DViewer centerPosition={centerPosition} />
            </div>
          )}

          {mapMode !== "mapbox3d" && (
            <div className="absolute bottom-6 right-6 flex gap-4 z-[400]">
              <button 
                onClick={() => saveDrawings(featureGroupRef)}
                className="bg-white p-3 shadow-lg text-slate-700 hover:text-green-600 transition-colors rounded-full"
                title="Lưu lại nét vẽ"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              </button>
              <button 
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const { latitude, longitude } = position.coords;
                        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${centerPosition[0]},${centerPosition[1]}`;
                        window.open(url, '_blank');
                      },
                      (error) => {
                        console.error("Lỗi lấy vị trí:", error);
                        alert("Không thể lấy vị trí hiện tại của bạn. Vui lòng cho phép truy cập vị trí trong trình duyệt.");
                      }
                    );
                  } else {
                    alert("Trình duyệt của bạn không hỗ trợ định vị.");
                  }
                }}
                className="bg-white p-3 shadow-lg text-slate-700 hover:text-[#d4ae6f] transition-colors rounded-full"
                title="Chỉ đường đến dự án"
              >
                <Navigation size={24} />
              </button>
            </div>
          )}
        </div>

        <PropertySidebar
          selectedLayer={selectedLayer}
          setSelectedLayer={setSelectedLayer}
          sidebarData={sidebarData}
          handleSidebarChange={handleSidebarChange}
        />
      </div>

      <OverpassModal
        showOverpassModal={showOverpassModal}
        setShowOverpassModal={setShowOverpassModal}
        overpassQuery={overpassQuery}
        setOverpassQuery={setOverpassQuery}
        isOverpassLoading={isOverpassLoading}
        handleRunOverpassQuery={handleRunOverpassQuery}
      />
    </div>
  );
}
