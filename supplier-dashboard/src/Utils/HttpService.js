// const BASE_URL = 'https://portronicsproducttool-supplierdashboard.onrender.com'; // Production
const BASE_URL = 'http://localhost:4000'; // Development

import { toast } from 'react-toastify';

const handleResponse = async (response) => {
  console.log("Handle Response - ", response.status); 
   console.log("Handle Response - ", response);

  if (response.status === 403 || response.status === 401) {
    // Unauthorized — redirect to login
    console.log("Auth error (403/401)");
    toast.error('Invalid credentials/Session Expired. Please login again.');
    setTimeout(() => {
      console.log("Timeout over");
      window.location.href = '/login';
    }, 2000); // 1.5 seconds delay
    //throw new Error('Unauthorized. Redirecting to login.');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Request failed');
  }

  return response.json();
};

const HttpService = {
  get: async (url) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'GET',
      credentials: 'include', // 💥 Send cookies
    });
    return handleResponse(response);
  },

  post: async (url, body) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (url, body) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (url) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse(response);
  },
};

export default HttpService;
