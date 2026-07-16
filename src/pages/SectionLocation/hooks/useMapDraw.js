import { useState, useEffect } from "react";
import L from "leaflet";
import html2canvas from "html2canvas";

export function useMapDraw() {
  const [mapMode, setMapMode] = useState("interactive");
  const [drawnItems, setDrawnItems] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(null);
  
  const [drawStyle, setDrawStyle] = useState({
    color: '#d4ae6f',
    fillColor: '#d4ae6f',
    weight: 3
  });

  const [sidebarData, setSidebarData] = useState({ 
    title: '', 
    description: '', 
    color: '#d4ae6f', 
    fillColor: '#d4ae6f', 
    weight: 3 
  });

  // Sync selected layer properties with sidebar state
  useEffect(() => {
    if (selectedLayer) {
      setSidebarData({
        title: selectedLayer.feature?.properties?.title || '',
        description: selectedLayer.feature?.properties?.description || '',
        color: selectedLayer.options?.color || '#d4ae6f',
        fillColor: selectedLayer.options?.fillColor || '#d4ae6f',
        weight: selectedLayer.options?.weight || 3
      });
    }
  }, [selectedLayer]);

  const handleSidebarChange = (field, value) => {
    setSidebarData(prev => ({ ...prev, [field]: value }));
    if (selectedLayer) {
      if (field === 'title' || field === 'description') {
        selectedLayer.feature = selectedLayer.feature || { type: 'Feature', properties: {} };
        selectedLayer.feature.properties[field] = value;
      } else {
        if (selectedLayer.setStyle) {
          selectedLayer.setStyle({ [field]: value });
          selectedLayer.feature = selectedLayer.feature || { type: 'Feature', properties: {} };
          selectedLayer.feature.properties.style = selectedLayer.feature.properties.style || {};
          selectedLayer.feature.properties.style[field] = value;
          // Sync top menu as well
          setDrawStyle(prev => ({...prev, [field]: value}));
        }
      }
    }
  };

  const handleDrawStyleChange = (field, value) => {
    setDrawStyle(prev => ({...prev, [field]: value}));
    if (selectedLayer && selectedLayer.setStyle) {
      selectedLayer.setStyle({ [field]: value });
      selectedLayer.feature = selectedLayer.feature || { type: 'Feature', properties: {} };
      selectedLayer.feature.properties.style = selectedLayer.feature.properties.style || {};
      selectedLayer.feature.properties.style[field] = value;
      setSidebarData(prev => ({ ...prev, [field]: value }));
    }
  };

  // Load drawings from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("mapDrawings");
    if (savedData) {
      try {
        setDrawnItems(JSON.parse(savedData));
      } catch (e) {
        console.error("Error parsing saved map drawings", e);
      }
    }
  }, []);

  const saveDrawings = (featureGroupRef) => {
    const featureGroup = featureGroupRef.current;
    if (featureGroup) {
      const data = { type: 'FeatureCollection', features: [] };
      
      featureGroup.eachLayer(layer => {
        const geojson = layer.toGeoJSON ? layer.toGeoJSON() : null;
        if (geojson) {
          geojson.properties = geojson.properties || {};
          if (layer instanceof L.Circle) {
            geojson.properties.radius = layer.getRadius();
            geojson.properties.isCircle = true;
          }
          if (layer.options) {
            geojson.properties.style = {
              color: layer.options.color,
              fillColor: layer.options.fillColor,
              weight: layer.options.weight,
              className: layer.options.className
            };
          }
          data.features.push(geojson);
        }
      });

      localStorage.setItem("mapDrawings", JSON.stringify(data));
      alert("Đã lưu các hình vẽ vào bộ nhớ trình duyệt!");
    }
  };

  const exportGeoJSON = (featureGroupRef) => {
    const featureGroup = featureGroupRef.current;
    if (featureGroup) {
      const data = { type: 'FeatureCollection', features: [] };
      featureGroup.eachLayer(layer => {
        const geojson = layer.toGeoJSON ? layer.toGeoJSON() : null;
        if (geojson) {
          geojson.properties = geojson.properties || {};
          if (layer instanceof L.Circle) {
            geojson.properties.radius = layer.getRadius();
            geojson.properties.isCircle = true;
          }
          if (layer.options) {
            geojson.properties.style = {
              color: layer.options.color,
              fillColor: layer.options.fillColor,
              weight: layer.options.weight,
              className: layer.options.className
            };
          }
          data.features.push(geojson);
        }
      });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "map-drawings.json";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const exportImage = async () => {
    const mapElement = document.getElementById("map-container-export");
    if (mapElement) {
      try {
        const canvas = await html2canvas(mapElement, {
          useCORS: true,
          allowTaint: true,
          logging: false,
        });
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = "map-snapshot.png";
        a.click();
      } catch (err) {
        console.error("Lỗi xuất ảnh bản đồ:", err);
        alert("Có lỗi khi xuất ảnh bản đồ!");
      }
    }
  };

  return {
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
  };
}
