// src/services/HttpService.js
import axios from 'axios';
import BASE_URL from '../config';

class HttpService {
  constructor(baseURL = BASE_URL) {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Automatically add Authorization token from localStorage
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  handleError(error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || '';

      if (status === 401 && message.toLowerCase().includes('expired')) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        console.error(`API Error: ${status} - ${message}`);
      }
    } else {
      console.error('Network or unknown error:', error.message);
    }

    throw error;
  }

  async get(url, params = {}) {
    try {
      const response = await this.api.get(url, { params });
      return response.data;
    } catch (error) {
      console.log("Error in Get", error);
      this.handleError(error);
    }
  }

  async post(url, data = {}) {
    try {
      const response = await this.api.post(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put(url, data = {}) {
    try {
      const response = await this.api.put(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async patch(url, data = {}) {
    try {
      const response = await this.api.patch(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async postForm(url, formData) {
    try {
      const response = await this.api.post(url, formData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async postFile(url, data) {
    try {
      const response = await this.api.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async putFile(url, data) {
    try {
      const response = await this.api.put(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(url) {
    try {
      const response = await this.api.delete(url);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default new HttpService(); // Singleton instance
