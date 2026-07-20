import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ tempCoords, setTempCoords }) {
  useMapEvents({
    click(e) {
      setTempCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return tempCoords === null ? null : (
    <Marker position={[tempCoords.lat, tempCoords.lng]} />
  );
}

export default function MapboxLocationPicker({
  locationName,
  coordinates, // { lat, lng }
  onChange,
}) {
  const defaultCenter = [10.946522, 106.747701];
  
  const [showMap, setShowMap] = useState(false);
  const [tempLocation, setTempLocation] = useState(locationName || "");
  const [tempCoords, setTempCoords] = useState(coordinates || null);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange({ location: tempLocation, coordinates: tempCoords });
    setShowMap(false);
  };

  const handleOpen = () => {
    setTempLocation(locationName || "");
    setTempCoords(coordinates || null);
    setShowMap(true);
  };

  return (
    <div className="relative">
      <label className="text-xs font-bold text-slate-400 mb-1 block">
        Địa điểm
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={locationName}
          onChange={(e) => onChange({ location: e.target.value, coordinates })}
          className="flex-1 p-3 border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 outline-none"
          placeholder="Nhà mẫu / Gọi thoại..."
        />
        <button
          type="button"
          onClick={handleOpen}
          className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center justify-center font-bold"
          title="Chọn trên bản đồ"
        >
          <MapPin size={20} className={coordinates ? "text-amber-500" : ""} />
        </button>
      </div>

      {showMap && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden h-[80vh] md:h-[600px]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <MapPin className="text-amber-500" /> Chọn Địa Điểm Cuộc Hẹn
              </h3>
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xl px-2"
              >
                &times;
              </button>
            </div>
            
            <div className="p-4 border-b border-slate-100">
              <input
                type="text"
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                className="w-full p-3 border border-slate-200 focus:border-amber-500 outline-none "
                placeholder="Nhập tên địa điểm (VD: The Coffee House)..."
              />
              <p className="text-xs text-slate-500 mt-2">
                * Click vào bản đồ để chọn tọa độ chính xác. Tọa độ hiện tại: {tempCoords ? `${tempCoords.lat.toFixed(4)}, ${tempCoords.lng.toFixed(4)}` : "Chưa chọn"}
              </p>
            </div>

            <div className="flex-1 relative bg-slate-100">
              <MapContainer 
                center={tempCoords ? [tempCoords.lat, tempCoords.lng] : defaultCenter} 
                zoom={15} 
                style={{ height: '100%', width: '100%', zIndex: 0 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker tempCoords={tempCoords} setTempCoords={setTempCoords} />
              </MapContainer>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="px-6 py-2  font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2  font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md transition-colors"
              >
                Xác Nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
