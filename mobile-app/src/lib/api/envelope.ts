/**
 * Mirrors the Go backend's APIResponse envelope (see context/code-standards.md)
 * so mock-backed calls and future real `fetch` calls share the same shape.
 */
export type ApiError = {
  code: string;
  message: string;
};

export type ApiResponse<T> = {
  data?: T;
  error?: ApiError;
};

export function ok<T>(data: T): ApiResponse<T> {
  return { data };
}
