// API service module
const BASE_URL = 'https://api.example.com/v1';

console.log('break here')

class ApiService {
  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  async get(endpoint) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.headers,
      });
      return await response.json();
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }

  async put(endpoint, data) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  }

  async delete(endpoint) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.headers,
      });
      return response.ok;
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  }
}

module.exports = new ApiService();
