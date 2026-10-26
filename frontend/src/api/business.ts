import { request } from "./client";
import type { Page, Town } from "./types";

export type BusinessCategory =
  | "HOTEL"
  | "BED_AND_BREAKFAST"
  | "HOLIDAY_HOME"
  | "VILLAGE"
  | "CAMPING"
  | "AGRITURISMO"
  | "RESTAURANT"
  | "BEACH_CLUB"
  | "BOAT_TOUR"
  | "EXCURSION";

export type PriceRange = "BUDGET" | "MODERATE" | "EXPENSIVE" | "LUXURY";

export type Business = {
  id: string;
  name: string;
  description: string;
  category: BusinessCategory;
  town: Town;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  priceRange: PriceRange | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type BusinessRequest = {
  name: string;
  description: string;
  category: BusinessCategory;
  town: Town;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  priceRange: PriceRange | null;
};

export const getBusinesses = (
  params: { town?: Town; category?: BusinessCategory; page?: number } = {},
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
  return request<Page<Business>>(`/api/businesses?${query.toString()}`);
};

export const getBusinessById = (id: string) => {
  return request<Business>(`/api/businesses/${id}`);
};

export const createBusiness = (data: BusinessRequest) => {
  return request<Business>("/api/businesses", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateBusiness = (businessId: string, data: BusinessRequest) => {
  return request<Business>(`/api/businesses/${businessId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteBusiness = (businessId: string) => {
  return request<void>(`/api/businesses/${businessId}`, { method: "DELETE" });
};

export const getMyBusinesses = () => {
  return request<Business[]>("/api/businesses/mine");
};
