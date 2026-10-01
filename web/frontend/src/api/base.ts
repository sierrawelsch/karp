const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export class HttpError extends Error {
  status: number;
  body: string;
  constructor(status: number, statusText: string, body: string) {
    super(`Request failed: ${status} ${statusText}`);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

export async function makeRequest<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
): Promise<T> {
  const token = localStorage.getItem('auth_token');

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw { status: response.status, ...errorData }; // include detail
  }

  return response.json() as Promise<T>;
}
