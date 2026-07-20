import React, { useEffect, useState, useMemo } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const createCustomIcon = (index, type) => {
  let color = "#3b82f6";
  if (type === "contract") color = "#10b981";
  if (type === "call") color = "#a855f7";
  if (type === "reminder") color = "#f59e0b";

  const html = `<div class="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center font-bold text-sm text-white relative z-20" style="background-color: ${color}">${index + 1}</div>`;
  
  return L.divIcon({
    html: html,
    className: "custom-leaflet-icon bg-transparent border-none",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

function MapUpdater({ bounds, defaultCenter }) {
  const map = useMap();
  useEffect(() => {
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    } else {
      map.setView(defaultCenter, 13);
    }
  }, [bounds, map, defaultCenter]);
  return null;
}

export default function MapboxOverview({ appointments, isFullScreen = false }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const defaultCenter = [10.946522, 106.747701];

  // Sort appointments by time
  const sortedApts = useMemo(() => {
    return [...appointments].sort((a, b) => {
      if (!a.time || !b.time) return 0;
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });
  }, [appointments]);

  const { bounds, routeCoordinates, validApts } = useMemo(() => {
    const b = new L.LatLngBounds();
    const coords = [];
    const valid = [];
    sortedApts.forEach((apt) => {
      if (apt.coordinates && apt.coordinates.lat && apt.coordinates.lng) {
        coords.push([apt.coordinates.lat, apt.coordinates.lng]);
        b.extend([apt.coordinates.lat, apt.coordinates.lng]);
        valid.push(apt);
      }
    });
    return { bounds: b, routeCoordinates: coords, validApts: valid };
  }, [sortedApts]);

  return (
    <div className={`bg-slate-100 border border-slate-200 transition-all duration-300 ${isFullScreen ? 'absolute inset-0' : (isExpanded ? 'relative h-[600px]' : 'relative h-[350px]')}`}>
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater bounds={bounds} defaultCenter={defaultCenter} />
        
        {routeCoordinates.length > 1 && (
          <Polyline positions={routeCoordinates} color="#3b82f6" weight={4} opacity={0.8} lineJoin="round" />
        )}

        {validApts.map((apt, index) => (
          <Marker 
            key={apt.id || index} 
            position={[apt.coordinates.lat, apt.coordinates.lng]}
            icon={createCustomIcon(index, apt.type)}
          >
            <Popup offset={[0, -10]}>
              <div className="font-sans">
                <div className="font-bold text-indigo-600 text-xs mb-1">{apt.time}</div>
                <h4 className="font-bold text-sm mb-1">Trạm {index + 1}: {apt.title}</h4>
                <div className="text-xs text-slate-500">{apt.customer}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {!isFullScreen && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-2 left-2 z-[400] bg-white p-2  shadow-md text-slate-600 hover:text-indigo-600 transition-colors"
          title={isExpanded ? "Thu nhỏ bản đồ" : "Phóng to bản đồ"}
        >
          {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      )}
    </div>
  );
}
