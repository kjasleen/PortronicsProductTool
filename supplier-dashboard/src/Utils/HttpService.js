const BASE_URL = 'http://localhost:4000'; // Replace with your actual backend URL

const handleResponse = async (response) => {
  /*if (response.status === 401) {
    // Token expired or unauthorized — log out user
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login
    throw new Error('Unauthorized. Redirecting to login.');
  }*/

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Request failed');
  }

  return response.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const HttpService = {
  get: async (url) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  post: async (url, body) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (url, body) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (url) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

export default HttpService;
