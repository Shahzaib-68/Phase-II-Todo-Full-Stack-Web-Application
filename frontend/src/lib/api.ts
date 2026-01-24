// Centralized API client with JWT injection and error handling
const API_BASE_URL = 'http://localhost:8000/api';

// Function to get the auth token from localStorage or cookie
const getAuthToken = (): string | null => {
  // Try to get token from localStorage first, then from cookie
  const localStorageToken = localStorage.getItem('auth-token');
  if (localStorageToken) {
    return localStorageToken;
  }

  // Try to get from document.cookie
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth-token') {
      return value;
    }
  }

  return null;
};

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Redirect to login on 401
        window.location.href = '/login';
        return Promise.reject('Unauthorized');
      }
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        return Promise.reject('Unauthorized');
      }
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        return Promise.reject('Unauthorized');
      }
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/login';
        return Promise.reject('Unauthorized');
      }
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  },
};

export default apiClient;