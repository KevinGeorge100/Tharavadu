import { ApiError } from "./types";

const CLIENT_HEADER = "x-tharavadu-client";
const CLIENT_VALUE = "web";

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set(CLIENT_HEADER, CLIENT_VALUE);

  if (options.body && typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  let response: Response;
  try {
    response = await fetch(endpoint, config);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    throw new ApiError(0, `Network failure: ${message}`);
  }

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      if (errorBody && typeof errorBody.detail === "string") {
        detail = errorBody.detail;
      }
    } catch {
      if (response.statusText) {
        detail = response.statusText;
      }
    }
    throw new ApiError(response.status, detail);
  }

  if (response.status === 204) {
    return {} as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    return {} as T;
  }
}
