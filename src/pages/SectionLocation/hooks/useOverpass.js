import { useState } from "react";
import osmtogeojson from "osmtogeojson";

export function useOverpass(setDrawnItems, drawStyle) {
  const [showOverpassModal, setShowOverpassModal] = useState(false);
  const [overpassQuery, setOverpassQuery] = useState("");
  const [isOverpassLoading, setIsOverpassLoading] = useState(false);

  const handleRunOverpassQuery = async () => {
    if (!overpassQuery.trim()) return;
    setIsOverpassLoading(true);
    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'data=' + encodeURIComponent(overpassQuery)
      });
      
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      
      const data = await response.json();
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
      const geojson = osmtogeojson(data);
      if (geojson && geojson.type === 'FeatureCollection') {
        setDrawnItems(applyStyles(geojson));
        setShowOverpassModal(false);
        setOverpassQuery("");
      } else {
        alert("Không có dữ liệu hợp lệ trả về.");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi chạy lệnh Overpass: Vui lòng kiểm tra lại cú pháp lệnh hoặc xem Console.");
    } finally {
      setIsOverpassLoading(false);
    }
  };

  return {
    showOverpassModal, setShowOverpassModal,
    overpassQuery, setOverpassQuery,
    isOverpassLoading,
    handleRunOverpassQuery
  };
}
