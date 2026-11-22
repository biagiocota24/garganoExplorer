import type { Attraction } from "./attraction";
import type { Business } from "./business";
import { request } from "./client";
import type { PlaceType } from "./review";

export type FavoritesResponse = {
  businesses: Business[];
  attractions: Attraction[];
};

export type FavoriteIdsResponse = {
  businessIds: string[];
  attractionIds: string[];
};

export const addBusinessToFavorite = (businessId: string) => {
  return request<void>(`/api/businesses/${businessId}/favorite`, {
    method: "PUT",
  });
};

export const addAttractionToFavorite = (attractionId: string) => {
  return request<void>(`/api/attractions/${attractionId}/favorite`, {
    method: "PUT",
  });
};

export const removeBusinessFromFavorite = (businessId: string) => {
  return request<void>(`/api/businesses/${businessId}/favorite`, {
    method: "DELETE",
  });
};

export const removeAttractionFromFavorite = (attractionId: string) => {
  return request<void>(`/api/attractions/${attractionId}/favorite`, {
    method: "DELETE",
  });
};

export const getMyFavorites = () => {
  return request<FavoritesResponse>("/api/favorites");
};

export const getMyFavoriteIds = () => {
  return request<FavoriteIdsResponse>("/api/favorites/ids");
};

type FavoriteApi = {
  addFavorite: (placeId: string) => Promise<void>;
  removeFavorite: (placeId: string) => Promise<void>;
};

export const favoriteApis: Record<PlaceType, FavoriteApi> = {
  business: {
    addFavorite: (businessId) => addBusinessToFavorite(businessId),
    removeFavorite: (businessId) => removeBusinessFromFavorite(businessId),
  },
  attraction: {
    addFavorite: (attractionId) => addAttractionToFavorite(attractionId),
    removeFavorite: (attractionId) =>
      removeAttractionFromFavorite(attractionId),
  },
};
