import { apiFetch } from "./client";
import { ApiError, Credentials, User } from "./types";

export async function register(credentials: Credentials): Promise<User> {
  return apiFetch<User>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function login(credentials: Credentials): Promise<User> {
  return apiFetch<User>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function logout(): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>("/api/auth/logout", {
    method: "POST",
  });
}

export async function getMe(): Promise<User | null> {
  try {
    return await apiFetch<User>("/api/me", {
      method: "GET",
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}
