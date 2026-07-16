import { useState } from "react";
import osmtogeojson from "osmtogeojson";
import { fetchOverpassData } from "../../../utils/overpassUtils";

export function useOverpass(setDrawnItems, drawStyle) {
  const [showOverpassModal, setShowOverpassModal] = useState(false);
  const [overpassQuery, setOverpassQuery] = useState("");
  const [isOverpassLoading, setIsOverpassLoading] = useState(false);

  const handleRunOverpassQuery = async () => {
    if (!overpassQuery.trim()) return;
    setIsOverpassLoading(true);
    try {
      const data = await fetchOverpassData(overpassQuery, 30000); // 30s timeout cho custom query
      
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
