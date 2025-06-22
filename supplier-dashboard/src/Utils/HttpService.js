const BASE_URL = 'https://portronicsproducttool-supplierdashboard.onrender.com'; // Replace with your actual backend URL
//const BASE_URL = 'http://localhost:4000';
import { toast } from 'react-toastify';


const handleResponse = async (response) => {
  console.log("Handle Response - ", response);
  if (response.status === 403) {
    // Token expired or unauthorized — log out user
    console.log("403 Error");
    toast.error('Session expired. Please *********** login again.');
    localStorage.clear(); // Clear everything just to be safe
    window.location.href = '/login'; // Redirect to login
    throw new Error('Unauthorized. Redirecting to login.');
  }

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
    console.log("Get Response", response);
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
