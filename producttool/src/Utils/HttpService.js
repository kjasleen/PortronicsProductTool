// src/services/HttpService.js
import axios from 'axios';

class HttpService {
  constructor(baseURL = '') {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Automatically add Authorization token from localStorage
    this.api.interceptors.request.use(
      (config) => {
       // console.log("Adding token in HTTPService");
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
        window.location.href = '/login'; // Redirect to login
      } else {
        console.error(`API Error: ${status} - ${message}`);
      }
    } else {
      console.error('Network or unknown error:', error.message);
    }

    throw error; // Rethrow so caller can also handle if needed
  }

  async get(url, params = {}) {
    try {
      const response = await this.api.get(url, { params });
      //console.log("Response in Get - ", response.data);
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
      //console.log("HTTPservice Put File called", data);
      const response = await this.api.put(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      //console.log("HTTPservice Put File Received resp", response.data);
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
