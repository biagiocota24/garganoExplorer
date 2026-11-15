import { useMap } from "react-leaflet";
import type { MapPlace } from "../../api/map";
import { useEffect } from "react";
import type { LatLngTuple } from "leaflet";

interface FocusPlaceProps {
  place: MapPlace;
}

const FocusPlace = ({ place }: FocusPlaceProps) => {
  const map = useMap();

  useEffect(() => {
    if (!place) return;

    const point: LatLngTuple = [place.latitude, place.longitude];

    map.flyTo(point, 15);
  }, [map, place]);
  return null;
};

export default FocusPlace;
