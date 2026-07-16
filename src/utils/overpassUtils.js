const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter'
];

export async function fetchOverpassData(query, timeoutMs = 15000) {
  let lastError = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'data=' + encodeURIComponent(query),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status} from ${endpoint}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`Overpass API endpoint ${endpoint} failed:`, err.message);
      lastError = err;
      // Continue to the next endpoint
    }
  }

  // If all endpoints failed
  throw new Error(`Tất cả các máy chủ Overpass đều không phản hồi. Lỗi cuối cùng: ${lastError?.message}`);
}
