import { request } from "./client";

export type Role = "VISITOR" | "OWNER" | "ADMIN";
export type AccounType = "VISITOR" | "OWNER";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  role: Role;
};

export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  accountType: AccounType;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const register = (data: RegisterRequest) => {
  return request<User>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const login = (data: LoginRequest) => {
  return request<User>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const logout = () => {
  return request<void>("/api/auth/logout", {
    method: "POST",
  });
};

export const getCurrentUser = () => {
  return request<User>("/api/users/me");
};
