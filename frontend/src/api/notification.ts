import { request } from "./client";

export type NotificationType =
  | "BUSINESS_CHANGE_REQUEST"

export type AppNotification = {
  id: string;
  type: NotificationType;
  message: string;
  businessId: string | null;
  businessName: string | null;
  read: boolean;
  createdAt: string;
};

export type UnreadCount = {
  count: number;
};

export const getNotifications = () => {
  return request<AppNotification[]>("/api/notifications");
};

export const getUnreadCount = () => {
  return request<UnreadCount>("/api/notifications/unread-count");
};

export const markNotificationAsRead = (id: string) => {
  return request<void>(`/api/notifications/${id}/read`, { method: "PATCH" });
};

export const markAllNotificationsAsRead = () => {
  return request<void>("/api/notifications/read-all", { method: "PATCH" });
};

export const requestBusinessChange = (businessId: string, message: string) => {
  return request<void>(`/api/businesses/${businessId}/change-requests`, {
    method: "POST",
    body: JSON.stringify({message}),
  });
};
