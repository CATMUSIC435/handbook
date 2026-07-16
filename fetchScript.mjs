import fs from 'fs';

// Calculate distance (Haversine)
function distance(lat1, lon1, lat2, lon2) {
  const p = 0.017453292519943295;    
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;
  return 12742 * Math.asin(Math.sqrt(a)); 
}

async function run() {
  console.log('Fetching Overpass data...');
  const query = `[out:json][timeout:90];(nwr["amenity"~"school|university|hospital|clinic|marketplace"](around:20000,10.946522,106.747701);nwr["shop"~"supermarket|mall"](around:20000,10.946522,106.747701);nwr["tourism"~"attraction|theme_park|museum|resort|hotel"](around:20000,10.946522,106.747701);nwr["landuse"="industrial"](around:20000,10.946522,106.747701);nwr["leisure"="park"](around:20000,10.946522,106.747701);nwr["aeroway"="aerodrome"](around:20000,10.946522,106.747701););out center;`;
  
  const cleanQuery = query.replace(/\s+/g, ' ').trim();
  const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(cleanQuery);
  
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'FenicaApp/1.0 (Contact: me@example.com)'
    },
    signal: AbortSignal.timeout(95000)
  });
  if(!res.ok) throw new Error('API failed: ' + res.status);
  
  const data = await res.json();
  const elements = data.elements;
  
  const locations = [];
  const names = new Set();
  
  for(const el of elements) {
      let lat = el.lat || (el.center && el.center.lat);
      let lng = el.lon || (el.center && el.center.lon);
      if(!lat || !lng) continue;
      
      const name = el.tags?.name || el.tags?.['name:en'];
      if(!name || names.has(name)) continue;
      names.add(name);
      
      const distKm = distance(10.946522, 106.747701, lat, lng);
      
      let icon = 'MapPin';
      const t = el.tags;
      if(t.amenity === 'school' || t.amenity === 'university') icon = 'School';
      else if(t.shop === 'supermarket' || t.shop === 'mall' || t.amenity === 'marketplace') icon = 'ShoppingBag';
      else if(t.aeroway === 'aerodrome') icon = 'Plane';
      else if(t.amenity === 'hospital' || t.amenity === 'clinic') icon = 'MapPin';
      
      let desc = 'Tiện ích ngoại khu lân cận dự án Fenica';
      if(t.amenity === 'school') desc = 'Cơ sở giáo dục lân cận.';
      if(t.amenity === 'hospital') desc = 'Cơ sở y tế chăm sóc sức khoẻ.';
      if(t.shop === 'supermarket') desc = 'Trung tâm mua sắm, siêu thị tiện lợi.';
      
      locations.push({
          icon, name,
          time: Math.round((distKm / 40) * 60) + ' phút',
          dist: distKm.toFixed(1) + ' km',
          lat, lng,
          description: desc,
          rawDist: distKm
      });
  }
  
  locations.sort((a,b) => a.rawDist - b.rawDist);
  
  locations.forEach(loc => delete loc.rawDist);
  
  // limit to top 80
  const topLocations = locations.slice(0, 80);
  
  console.log('Saved ' + topLocations.length + ' locations.');
  
  const filepath = './src/data/amenities.json';
  const currentData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  
  currentData.locations = topLocations;
  
  fs.writeFileSync(filepath, JSON.stringify(currentData, null, 2));
  console.log('Successfully updated amenities.json!');
}
run().catch(console.error);
