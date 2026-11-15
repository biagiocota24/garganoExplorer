import { useMap } from "react-leaflet";
import type { MapPlace } from "../../api/map";
import { useEffect } from "react";
import type { LatLngTuple } from "leaflet";

interface FitBoundsProps {
  places: MapPlace[];
}

const FitBounds = ({ places }: FitBoundsProps) => {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;

    const points: LatLngTuple[] = places.map((place) => [
      place.latitude,
      place.longitude,
    ]);
    map.fitBounds(points, { padding: [40, 40], maxZoom: 13 });
  }, [map, places]);
  return null;
};

export default FitBounds;
