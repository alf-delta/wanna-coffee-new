const token = import.meta.env.VITE_MAPBOX_TOKEN;

if (!token) {
  console.warn('Mapbox token not found. Set VITE_MAPBOX_TOKEN in your .env.local file.');
}

export const MAPBOX_TOKEN = token || '';
