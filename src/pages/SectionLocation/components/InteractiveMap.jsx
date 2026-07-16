import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, FeatureGroup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import { renderToString } from "react-dom/server";

function getBezierCurve(start, end, curvature = 0.3, numPoints = 50) {
  const lat1 = start[0], lng1 = start[1];
  const lat2 = end[0], lng2 = end[1];

  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;

  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;

  // Use perpendicular vector for control point
  const ctrlLat = midLat - dLng * curvature;
  const ctrlLng = midLng + dLat * curvature;

  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const t1 = 1 - t;
    const pLat = t1 * t1 * lat1 + 2 * t1 * t * ctrlLat + t * t * lat2;
    const pLng = t1 * t1 * lng1 + 2 * t1 * t * ctrlLng + t * t * lng2;
    points.push([pLat, pLng]);
  }
  return points;
}

function DrawTools({ featureGroupRef, drawStyle, setSelectedLayer }) {
  const map = useMap();

  useEffect(() => {
    if (!featureGroupRef.current) return;

    const baseShapeOptions = {
      ...drawStyle,
      className: 'animated-map-shape'
    };

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: featureGroupRef.current,
      },
      draw: {
        circle: { shapeOptions: baseShapeOptions },
        circlemarker: false,
        marker: true,
        polyline: { shapeOptions: baseShapeOptions },
        polygon: { shapeOptions: baseShapeOptions },
        rectangle: { shapeOptions: baseShapeOptions },
      },
      position: "bottomleft",
    });

    map.addControl(drawControl);

    const handleCreated = (e) => {
      if (e.layer.setStyle) {
        e.layer.setStyle(baseShapeOptions);
      }
      e.layer.feature = e.layer.feature || { type: 'Feature', properties: {} };
      e.layer.on('click', () => {
        setSelectedLayer(e.layer);
      });
      featureGroupRef.current.addLayer(e.layer);
      setSelectedLayer(e.layer);
    };

    map.on(L.Draw.Event.CREATED, handleCreated);

    return () => {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.CREATED, handleCreated);
    };
  }, [map, featureGroupRef, drawStyle, setSelectedLayer]);

  return null;
}

function PopupContent({ item }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col">
      {item.image && !imageError ? (
        <div className="-m-4 mb-3 rounded-t-lg overflow-hidden relative">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-32 object-cover"
            onError={() => setImageError(true)}
          />
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-indigo-600 uppercase">
            {item.type || "Tiện ích"}
          </div>
        </div>
      ) : (
        <div className="text-[10px] font-bold text-indigo-600 uppercase mb-1">
          {item.type || "Tiện ích"}
        </div>
      )}
      
      <div className="font-bold text-slate-900 text-base mb-1">
        {item.name}
      </div>
      <div className="text-xs text-[#d4ae6f] font-semibold uppercase tracking-wider mb-2">
        Khoảng cách: {item.dist} • {item.time}
      </div>
      {item.description && (
        <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2 mt-2">
          {item.description}
        </p>
      )}
    </div>
  );
}

export default function InteractiveMap({
  mapMode,
  centerPosition,
  showAmenities,
  amenitiesToUse,
  drawnItems,
  featureGroupRef,
  drawStyle,
  setSelectedLayer,
  projectIcon,
  showCurvedLines
}) {
  // Setup drawn items to layer when changed
  useEffect(() => {
    if (drawnItems && featureGroupRef.current) {
      const featureGroup = featureGroupRef.current;
      featureGroup.clearLayers();
      L.geoJSON(drawnItems, {
        style: function (feature) {
          if (feature.properties && feature.properties.style) {
            return feature.properties.style;
          }
          return { color: '#d4ae6f', fillColor: '#d4ae6f', weight: 3, className: 'animated-map-shape' };
        },
        pointToLayer: function(feature, latlng) {
          if (feature.properties && feature.properties.isCircle && feature.properties.radius) {
            return L.circle(latlng, { radius: feature.properties.radius });
          }
          return L.marker(latlng);
        },
        onEachFeature: function(feature, layer) {
          layer.on('click', () => {
            setSelectedLayer(layer);
          });
        }
      }).eachLayer((layer) => {
        featureGroup.addLayer(layer);
      });
    }
  }, [drawnItems, featureGroupRef, setSelectedLayer]);

  return (
    <div 
      id="map-container-export" 
      className={`w-full h-full relative z-0 ${mapMode === "interactive" ? "block" : "hidden"}`}
    >
      <MapContainer
        center={centerPosition}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <FeatureGroup ref={featureGroupRef}>
          <DrawTools 
            featureGroupRef={featureGroupRef} 
            drawStyle={drawStyle} 
            setSelectedLayer={setSelectedLayer} 
          />
        </FeatureGroup>
        
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

        {/* Project Center Marker */}
        <Marker position={centerPosition} icon={projectIcon}>
          <Popup>
            <div className="font-bold text-slate-800 text-center">
              Vị trí trung tâm dự án<br/>
              <span className="text-xs text-[#d4ae6f] font-medium">Fenica Bình Dương</span>
            </div>
          </Popup>
        </Marker>

        {/* Amenities Markers */}
        {showAmenities && amenitiesToUse.map((item, index) => {
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
            <React.Fragment key={index}>
              <Marker
                position={[item.lat, item.lng]}
                icon={customIcon}
              >
                <Popup className="custom-popup" minWidth={240}>
                  <PopupContent item={item} />
                </Popup>
              </Marker>
              
              {showCurvedLines && (
                <Polyline 
                  positions={getBezierCurve(centerPosition, [item.lat, item.lng])} 
                  pathOptions={{ 
                    color: '#d4ae6f', 
                    weight: 2, 
                    dashArray: '5, 10', 
                    className: 'animated-curve' 
                  }} 
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
