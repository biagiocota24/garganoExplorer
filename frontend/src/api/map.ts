import type { AttractionCategory } from "../api/attraction";
import type { BusinessCategory } from "../api/business";
import { request } from "../api/client";
import type { Town } from "../api/types";

export type MapPlaceType = "ATTRACTION" | "BUSINESS";

export type MapPlace = {
  id: string;
  type: MapPlaceType;
  name: string;
  category: AttractionCategory | BusinessCategory;
  town: Town;
  latitude: number;
  longitude: number;
  coverPhotoUrl: string | null;
};

export const getMapPlaces = () => {
  return request<MapPlace[]>("/api/map-places");
};

export const getDetailsPlace = (place: MapPlace) =>
  place.type === "ATTRACTION"
    ? `/attractions/${place.id}`
    : `/businesses/${place.id}`;
