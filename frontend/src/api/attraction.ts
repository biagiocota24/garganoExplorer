import { request } from "./client";
import type { Page, Town } from "./types";

export type AttractionCategory =
  | "BEACH"
  | "CHURCH"
  | "TRAIL"
  | "HISTORIC_CENTER"
  | "VIEWPOINT"
  | "NATURE_RESERVE"
  | "MUSEUM"
  | "CAVE";

export type Attraction = {
  id: string;
  name: string;
  description: string;
  town: Town;
  category: AttractionCategory;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
};

export type AttractionRequest = {
  name: string;
  description: string;
  town: Town;
  category: AttractionCategory;
  latitude?: number | null;
  longitude?: number | null;
};


export const getAttractions = (
  params: { town?: Town; category?: AttractionCategory; page?: number } = {},
) => {
  const query = new URLSearchParams();
  if (params.town) {
    query.append("town", params.town);
  }
  if (params.category) {
    query.append("category", params.category);
  }
  if (params.page !== undefined) {
    query.append("page", params.page.toString());
  }
  return request<Page<Attraction>>(`/api/attractions?${query.toString()}`);
};

export const getAttractionById = (id: string) => {
  return request<Attraction>(`/api/attractions/${id}`);
};

export const createAttraction = (data: AttractionRequest) => {
  return request<Attraction>("/api/attractions", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateAttraction = (id: string, data: AttractionRequest) => {
  return request<Attraction>(`/api/attractions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteAttraction = (id: string) => {
  return request<void>(`/api/attractions/${id}`, {
    method: "DELETE",
  });
};
