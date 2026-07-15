import { useState } from "react";
import { motion } from "motion/react";
import {
  MapPin,
  Navigation,
  School,
  ShoppingBag,
  Plane,
  Train,
  Car,
  Map,
  Image as ImageIcon,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToString } from "react-dom/server";
import amenitiesData from "../../data/amenities.json";
import { Button } from "../../components/ui/Button";

// Fix leaflet default icon issue
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const iconMap = { School, MapPin, ShoppingBag, Plane, Car, Train };

export default function SectionLocation() {
  const [mapMode, setMapMode] = useState("interactive");

  const amenities = amenitiesData.locations.map((loc) => ({
    ...loc,
    icon: iconMap[loc.icon] || MapPin,
  }));

  const centerPosition = [10.893113, 106.778848];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex">
        {/* Map Area */}
        <div className="flex-1 relative bg-white shadow-xl overflow-hidden border border-slate-200">
          {/* Toggle buttons */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col sm:flex-row bg-white shadow-lg border border-slate-100 p-1 z-[400]">
            <button
              onClick={() => setMapMode("interactive")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${mapMode === "interactive" ? "bg-[#d4ae6f] text-slate-900 shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <Map size={16} /> Bản đồ tương tác
            </button>
            <button
              onClick={() => setMapMode("svg")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${mapMode === "svg" ? "bg-[#d4ae6f] text-slate-900 shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <ImageIcon size={16} /> Bản đồ đồ họa
            </button>
          </div>

          {mapMode === "interactive" ? (
            <MapContainer
              center={centerPosition}
              zoom={13}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Main Project Marker */}
              <Marker position={centerPosition}>
                <Popup>
                  <div className="font-bold text-lg">Dự án Fenica</div>
                  <div className="text-sm text-slate-500">Vị trí trung tâm</div>
                </Popup>
              </Marker>

              {/* Amenities Markers */}
              {amenities.map((item, index) => {
                if (!item.lat || !item.lng) return null;

                const IconCmp = item.icon;
                const iconHtml = renderToString(<IconCmp size={20} />);
                const customIcon = L.divIcon({
                  className: "custom-leaflet-icon",
                  html: `<div style="background-color: white; border-radius: 50%; padding: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: #d4ae6f;">${iconHtml}</div>`,
                  iconSize: [36, 36],
                  iconAnchor: [18, 18],
                  popupAnchor: [0, -18],
                });

                return (
                  <Marker
                    key={index}
                    position={[item.lat, item.lng]}
                    icon={customIcon}
                  >
                    <Popup>
                      <div className="font-semibold text-slate-900">
                        {item.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {item.dist} • {item.time}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          ) : (
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

          <div className="absolute bottom-6 right-6 flex gap-4 z-[400]">
            <button className="bg-white p-3 shadow-lg text-slate-700 hover:text-[#d4ae6f] transition-colors">
              <Navigation size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
