import { request } from "./client";
import type { Page } from "./types";

export type BusinessReviewRequest = {
  text: string;
  rating: number;
};

export type BusinessReview = {
  id: string;
  authorId: string;
  authorName: string;
  businessId: string;
  rating: number;
  text: string;
  createdAt: string;
  updatedAt: string;
};

const businessReviewsUrl = (businessId: string) => {
  return `/api/businesses/${businessId}/reviews`;
};

export const getBusinessReviews = (
  businessId: string,
  page: number,
  sort: string,
) => {
  return request<Page<BusinessReview>>(
    `${businessReviewsUrl(businessId)}?page=${page}&sort=${sort}`,
  );
};

export const getMyBusinessReview = (businessId: string) => {
  return request<BusinessReview | undefined>(
    `${businessReviewsUrl(businessId)}/mine`,
  );
};

export const createBusinessReview = (
  businessId: string,
  data: BusinessReviewRequest,
) => {
  return request<BusinessReview>(businessReviewsUrl(businessId), {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateBusinessReview = (
  businessId: string,
  reviewId: string,
  data: BusinessReviewRequest,
) => {
  return request<BusinessReview>(
    `${businessReviewsUrl(businessId)}/${reviewId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
};

export const deleteBusinessReview = (businessId: string, reviewId: string) => {
  return request<void>(`${businessReviewsUrl(businessId)}/${reviewId}`, {
    method: "DELETE",
  });
};

export type AttractionReviewRequest = {
  text: string;
};
export type AttractionReview = {
  id: string;
  authorId: string;
  authorName: string;
  businessId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

const attractionReviewsUrl = (attractionId: string) => {
  return `/api/attractions/${attractionId}/reviews`;
};

export const getAttractionReviews = (attractionId: string, page: number) => {
  return request<Page<AttractionReview>>(
    `${attractionReviewsUrl(attractionId)}?page=${page}`,
  );
};

export const getMyAttractionReview = (attractionId: string) => {
  return request<AttractionReview | undefined>(
    `${attractionReviewsUrl(attractionId)}/mine`,
  );
};

export const createAttractionReview = (
  attractionId: string,
  data: AttractionReviewRequest,
) => {
  return request<AttractionReview>(attractionReviewsUrl(attractionId), {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateAttractionReview = (
  attractionId: string,
  reviewId: string,
  data: AttractionReviewRequest,
) => {
  return request<AttractionReview>(
    `${attractionReviewsUrl(attractionId)}/${reviewId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
};

export const deleteAttractionReview = (
  attractionId: string,
  reviewId: string,
) => {
  return request<void>(`${attractionReviewsUrl(attractionId)}/${reviewId}`, {
    method: "DELETE",
  });
};

export type PlaceType = "business" | "attraction";

export type Review = BusinessReview | AttractionReview;

export type ReviewInput = { text: string; rating: number };

type ReviewApi = {
  getList: (placeId: string, page: number, sort:string) => Promise<Page<Review>>;
  getMine: (placeId: string) => Promise<Review | undefined>;
  create: (placeId: string, input: ReviewInput) => Promise<Review>;
  update: (
    placeId: string,
    reviewId: string,
    input: ReviewInput,
  ) => Promise<Review>;
  remove: (placeId: string, reviewId: string) => Promise<void>;
};

export const reviewApis: Record<PlaceType, ReviewApi> = {
  business: {
    getList: getBusinessReviews,
    getMine: getMyBusinessReview,
    create: (placeId, input) =>
      createBusinessReview(placeId, { text: input.text, rating: input.rating }),
    update: (placeId, reviewId, input) =>
      updateBusinessReview(placeId, reviewId, {
        text: input.text,
        rating: input.rating,
      }),
    remove: deleteBusinessReview,
  },
  attraction: {
    getList: getAttractionReviews,
    getMine: getMyAttractionReview,
    create: (placeId, input) =>
      createAttractionReview(placeId, { text: input.text }),
    update: (placeId, reviewId, input) =>
      updateAttractionReview(placeId, reviewId, { text: input.text }),
    remove: deleteAttractionReview,
  },
};
