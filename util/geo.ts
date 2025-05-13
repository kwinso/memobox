export function getCenterBetweenPoints(points: number[][]): {
  latitude: number;
  longitude: number;
} {
  if (!points.length) return { latitude: 0, longitude: 0 };

  let totalLng = 0;
  let totalLat = 0;

  for (const [lat, lng] of points) {
    totalLng += lng;
    totalLat += lat;
  }

  return {
    longitude: totalLng / points.length,
    latitude: totalLat / points.length,
  };
}
