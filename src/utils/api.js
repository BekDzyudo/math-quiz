/**
 * API utility - barcha fetch so'rovlar uchun
 * Avtomatik credentials qo'shadi (admin session uchun)
 */

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Fetch wrapper - avtomatik credentials: 'include' qo'shadi
 */
export async function apiFetch(url, options = {}) {
  const config = {
    credentials: 'include', // Admin session uchun muhim!
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const response = await fetch(fullUrl, config);
  
  return response;
}

/**
 * GET so'rov
 */
export async function apiGet(url) {
  const response = await apiFetch(url, { method: 'GET' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Xatolik yuz berdi');
  }
  return response.json();
}

/**
 * POST so'rov
 */
export async function apiPost(url, data) {
  const response = await apiFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response;
}

/**
 * PUT so'rov
 */
export async function apiPut(url, data) {
  const response = await apiFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response;
}

/**
 * DELETE so'rov
 */
export async function apiDelete(url) {
  const response = await apiFetch(url, { method: 'DELETE' });
  return response;
}
