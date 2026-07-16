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
      // Xoá khoảng trắng thừa và dấu xuống dòng vì GET URL chứa %0A có thể bị chặn (Lỗi 406)
      const cleanQuery = query.replace(/\s+/g, ' ').trim();
      const url = `${endpoint}?data=${encodeURIComponent(cleanQuery)}`;
      const response = await fetch(url, {
        method: 'GET',
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
