import { request } from "./client";


export interface Photo {
  url: string;
  publicId: string;
}

export interface UploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: string;
  folder: string;
  allowedFormats: string;
  signature: string;
}

export type PhotoResource = "businesses" | "attractions";

export const MAX_PHOTOS = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export function getUploadSignature() {
  return request<UploadSignature>("/api/photos/signature", { method: "POST" });
}

export async function uploadToCloudinary(file: File, signature: UploadSignature): Promise<Photo> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", signature.timestamp);
  formData.append("folder", signature.folder);
  formData.append("allowed_formats", signature.allowedFormats);
  formData.append("signature", signature.signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
    { method: "POST", body: formData },
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message ?? "Caricamento dell'immagine non riuscito");
  }

  const result = data as CloudinaryUploadResult;
  return { url: result.secure_url, publicId: result.public_id };
}

export function addPhoto(resource: PhotoResource, id: string, photo: Photo) {
  return request<Photo[]>(`/api/${resource}/${id}/photos`, {
    method: "POST",
    body: JSON.stringify(photo),
  });
}

export function removePhoto(resource: PhotoResource, id: string, publicId: string) {
  return request<void>(
    `/api/${resource}/${id}/photos?publicId=${encodeURIComponent(publicId)}`,
    { method: "DELETE" },
  );
}