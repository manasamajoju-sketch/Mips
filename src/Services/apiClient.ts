const API_BASE = import.meta.env.VITE_API_BASE;

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });


  if (!response.ok) {
    throw new Error(
      `API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}