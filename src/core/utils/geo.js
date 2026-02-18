export function averageCoordinates(points, fallback) {
  const totalDataPoints = points.length;
  let totalLatitude = 0;
  let totalLongitude = 0;

  for (const point of points) {
    totalLatitude += point.latitude;
    totalLongitude += point.longitude;
  }

  const latitude = totalLatitude / totalDataPoints;
  const longitude = totalLongitude / totalDataPoints;

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return fallback;
  }

  return [Number(latitude.toFixed(6)), Number(longitude.toFixed(6))];
}
