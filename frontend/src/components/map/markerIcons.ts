import L from "leaflet";
import type { MapPlaceType } from "../../api/map";
import "./markerIcons.css"

// Segnaposto a goccia disegnato in CSS: nessuna immagine da importare
const createPinIcon = (modifier: string) =>
  L.divIcon({
    className: `map-pin map-pin--${modifier}`,
    html: '<span class="map-pin__shape"></span>',
    iconSize: [28, 28],
    iconAnchor: [14, 34], // la punta della goccia tocca le coordinate
    popupAnchor: [0, -32], // il popup si apre sopra il segnaposto
  });

export const attractionIcon = createPinIcon("attraction");
export const businessIcon = createPinIcon("business");

const iconByType: Record<MapPlaceType, L.DivIcon> = {
  ATTRACTION: attractionIcon,
  BUSINESS: businessIcon,
};

export const getMarkerIcon = (type: MapPlaceType) => iconByType[type];