import { useState, useEffect, useCallback } from "react";
import L from "leaflet";
import amenitiesData from "../../../data/amenities.json";
import {
  MapPin,
  School,
  ShoppingBag,
  Plane,
  Train,
  Car,
  Map,
  Factory,
  Hotel,
  TreePine,
} from "lucide-react";

import { fetchOverpassData } from "../../../utils/overpassUtils";

const iconMap = { School, MapPin, ShoppingBag, Plane, Car, Train };

export function useAmenities(centerPosition) {
  const [dynamicAmenities, setDynamicAmenities] = useState([]);
  const [isLoadingAmenities, setIsLoadingAmenities] = useState(false);
  const [searchRadius, setSearchRadius] = useState(20000);
  const [showAmenities, setShowAmenities] = useState(true);

  const fetchNearbyAmenities = useCallback(async () => {
    setIsLoadingAmenities(true);
    
    try {
      const radius = searchRadius;
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"~"school|university|hospital|clinic|marketplace"](around:${radius},${centerPosition[0]},${centerPosition[1]});
          node["shop"~"supermarket|mall"](around:${radius},${centerPosition[0]},${centerPosition[1]});
          node["tourism"~"attraction|theme_park|museum|resort|hotel"](around:${radius},${centerPosition[0]},${centerPosition[1]});
          node["landuse"="industrial"](around:${radius},${centerPosition[0]},${centerPosition[1]});
          node["leisure"="park"](around:${radius},${centerPosition[0]},${centerPosition[1]});
          node["aeroway"="aerodrome"](around:${radius},${centerPosition[0]},${centerPosition[1]});
        );
        out center;
      `;
      
      const data = await fetchOverpassData(query, 25000);
      
      const centerLatLng = L.latLng(centerPosition[0], centerPosition[1]);
      
      const mapped = data.elements.filter(el => el.tags && el.tags.name).map(el => {
        const lat = el.center ? el.center.lat : el.lat;
        const lon = el.center ? el.center.lon : el.lon;
        const latLng = L.latLng(lat, lon);
        const distMeters = centerLatLng.distanceTo(latLng);
        const distKm = (distMeters / 1000).toFixed(1) + ' km';
        const timeMins = Math.round(distMeters / 400) + ' phút';
        
        let icon = MapPin;
        let type = "Khác";
        if (el.tags.amenity === 'school' || el.tags.amenity === 'university') { icon = School; type = "Giáo dục"; }
        else if (el.tags.shop === 'supermarket' || el.tags.shop === 'mall' || el.tags.amenity === 'marketplace') { icon = ShoppingBag; type = "Mua sắm & Chợ"; }
        else if (el.tags.amenity === 'hospital' || el.tags.amenity === 'clinic') { icon = MapPin; type = "Y tế"; }
        else if (el.tags.tourism === 'resort' || el.tags.tourism === 'hotel') { icon = Hotel; type = "Lưu trú & Nghỉ dưỡng"; }
        else if (el.tags.tourism) { icon = Map; type = "Khu du lịch & Giải trí"; }
        else if (el.tags.landuse === 'industrial' || (el.tags.name && el.tags.name.toLowerCase().includes('kcn'))) { icon = Factory; type = "Khu công nghiệp"; }
        else if (el.tags.leisure === 'park') { icon = TreePine; type = "Công viên"; }
        else if (el.tags.aeroway === 'aerodrome') { icon = Plane; type = "Giao thông"; }
        
        return {
          name: el.tags.name,
          lat: lat,
          lng: lon,
          dist: distKm,
          time: timeMins,
          icon: icon,
          type: type
        };
      });
      
      mapped.sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist));
      const uniqueMapped = [];
      const names = new Set();
      mapped.forEach(item => {
        if (!names.has(item.name)) {
          names.add(item.name);
          uniqueMapped.push(item);
        }
      });
      
      const finalLocations = uniqueMapped.slice(0, 80);
      setDynamicAmenities(finalLocations);
      
      // XUẤT RA CONSOLE ĐỂ LẤY DỮ LIỆU
      const jsonFriendlyData = finalLocations.map((item, id) => {
        let iconStr = "MapPin";
        if (item.icon === School) iconStr = "School";
        else if (item.icon === ShoppingBag) iconStr = "ShoppingBag";
        else if (item.icon === Plane) iconStr = "Plane";
        else if (item.icon === Train) iconStr = "Train";
        else if (item.icon === Car) iconStr = "Car";
        else if (item.icon === Map) iconStr = "Map";
        else if (item.icon === Factory) iconStr = "Factory";
        else if (item.icon === Hotel) iconStr = "Hotel";
        else if (item.icon === TreePine) iconStr = "TreePine";

        return {
          id: id + 1,
          name: item.name,
          lat: item.lat,
          lng: item.lng,
          dist: item.dist,
          time: item.time,
          icon: iconStr,
          type: item.type
        };
      });
      // console.log("========== DỮ LIỆU JSON ĐỂ COPY ==========");
      // console.log(JSON.stringify({ locations: jsonFriendlyData }, null, 2));
      // console.log("==========================================");
      
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu Overpass:", err);
    } finally {
      setIsLoadingAmenities(false);
    }
  }, [searchRadius, centerPosition[0], centerPosition[1]]);

  useEffect(() => {
    fetchNearbyAmenities();
  }, [fetchNearbyAmenities]);

  // Lọc dữ liệu tĩnh theo bán kính (searchRadius tính bằng mét, loc.dist tính bằng km)
  const filteredStaticData = amenitiesData.locations.filter(loc => {
    const distVal = parseFloat(loc.dist.replace(" km", "").trim());
    return (distVal * 1000) <= searchRadius;
  });

  const amenitiesToUse = dynamicAmenities.length > 0 ? dynamicAmenities : filteredStaticData.map((loc) => {
    let type = "Khác";
    if (loc.icon === 'School') type = "Giáo dục";
    else if (loc.icon === 'ShoppingBag') type = "Mua sắm";
    else if (loc.icon === 'Train' || loc.icon === 'Plane' || loc.icon === 'Car') type = "Giao thông";
    else if (loc.icon === 'MapPin') type = "Y tế";

    return {
      ...loc,
      type: type,
      icon: iconMap[loc.icon] || MapPin,
    };
  });

  const groupedAmenities = amenitiesToUse.reduce((acc, curr) => {
    const t = curr.type || "Khác";
    if (!acc[t]) acc[t] = [];
    acc[t].push(curr);
    return acc;
  }, {});

  return {
    dynamicAmenities,
    isLoadingAmenities,
    searchRadius,
    setSearchRadius,
    showAmenities,
    setShowAmenities,
    fetchNearbyAmenities,
    amenitiesToUse,
    groupedAmenities
  };
}
