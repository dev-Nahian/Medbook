export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://alrahman87.softvencealpha.com/api";

export type ApiEnvelope<T> = {
  status: number;
  success: boolean;
  message: string;
  data: T;
};

export type ApiErrorBody = {
  message?: string;
  detail?: string;
  error?: string;
  errors?: Record<string, string[] | string>;
  success?: boolean;
};

export class ApiClientError extends Error {
  status?: number;
  details?: ApiErrorBody;

  constructor(message: string, status?: number, details?: ApiErrorBody) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

export const extractErrorMessage = (
  body: ApiErrorBody | null | undefined,
  fallback = "Something went wrong. Please try again."
): string => {
  if (!body) return fallback;
  if (body.message) return body.message;
  if (body.detail) return body.detail;
  if (body.error) return body.error;

  if (body.errors) {
    const firstError = Object.values(body.errors)[0];
    if (Array.isArray(firstError)) return firstError[0];
    if (typeof firstError === "string") return firstError;
  }

  return fallback;
};

export const parseJson = async <T>(response: Response): Promise<T | null> => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
};

export const apiGet = async <T>(
  path: string,
  options?: {
    accessToken?: string | null;
    params?: Record<string, string | number | undefined>;
  }
): Promise<T> => {
  let url = `${API_BASE_URL}${path}`;

  if (options?.params) {
    const query = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const response = await fetch(url, {
    headers: options?.accessToken
      ? { Authorization: `Bearer ${options.accessToken}` }
      : undefined,
  });

  const body = await parseJson<T & ApiErrorBody>(response);

  if (!response.ok || (body && typeof body === "object" && "success" in body && body.success === false)) {
    throw new ApiClientError(extractErrorMessage(body), response.status, body ?? undefined);
  }

  if (!body) {
    throw new ApiClientError("Empty response received.", response.status);
  }

  return body as T;
};

export const apiPostForm = async <T>(
  path: string,
  formData: FormData,
  options?: { accessToken?: string | null }
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: options?.accessToken
      ? { Authorization: `Bearer ${options.accessToken}` }
      : undefined,
    body: formData,
  });

  const body = await parseJson<T & ApiErrorBody>(response);

  if (!response.ok || (body && typeof body === "object" && "success" in body && body.success === false)) {
    throw new ApiClientError(extractErrorMessage(body), response.status, body ?? undefined);
  }

  if (!body) {
    throw new ApiClientError("Empty response received.", response.status);
  }

  return body as T;
};

export const apiPostJson = async <T>(
  path: string,
  data: unknown,
  options?: { accessToken?: string | null }
): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const body = await parseJson<T & ApiErrorBody>(response);

  if (!response.ok || (body && typeof body === "object" && "success" in body && body.success === false)) {
    throw new ApiClientError(extractErrorMessage(body), response.status, body ?? undefined);
  }

  if (!body) {
    throw new ApiClientError("Empty response received.", response.status);
  }

  return body as T;
};
