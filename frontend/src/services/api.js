// src/services/api.js
const API_BASE = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Handle unauthorized (token expired)
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }

      // For 404 errors, we'll handle them gracefully and fallback to demo mode
      if (response.status === 404) {
        throw new Error('Endpoint not found - using demo mode');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentLength = response.headers.get('content-length');
      if (contentLength === '0') {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    
    if (response && response.token) {
      this.token = response.token;
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  // Profile methods
  async getProfile() {
    return this.request('/profile/me');
  }

  async updateProfile(profileData) {
    return this.request('/profile/me', {
      method: 'PUT',
      body: profileData,
    });
  }

  // Booking methods
  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: bookingData,
    });
  }

  async getMyBookings() {
    return this.request('/bookings/my');
  }

  async getProviderBookings() {
    return this.request('/bookings/provider');
  }

  async confirmBooking(bookingId) {
    return this.request(`/bookings/${bookingId}/confirm`, {
      method: 'PATCH',
    });
  }

  async completeBooking(bookingId) {
    return this.request(`/bookings/${bookingId}/complete`, {
      method: 'PATCH',
    });
  }

  async cancelBooking(bookingId) {
    return this.request(`/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
    });
  }

  // Caregiver methods - UPDATED FOR AMAL'S BACKEND
  async getCaregivers() {
    return this.request('/caregivers');
  }

  async getCaregiver(id) {
    return this.request(`/caregivers/${id}`);
  }

  // Review methods - UPDATED FOR AMAL'S BACKEND
  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: reviewData,
    });
  }

  async getReviews(resourceId) {
    return this.request(`/reviews/${resourceId}`);
  }

  async getAverageRating(resourceId) {
    return this.request(`/reviews/${resourceId}/average`);
  }

  // Get my reviews (seeker's own reviews) - This endpoint doesn't exist in Amal's backend yet
  async getMyReviews() {
    try {
      return await this.request('/reviews/my');
    } catch (error) {
      console.log('Get my reviews endpoint not available, using fallback');
      throw error;
    }
  }

  // Admin methods
  async getAdminUsers() {
    return this.request('/admin/users');
  }

  async getAdminBookings() {
    return this.request('/admin/bookings');
  }

  async getUnverifiedCaregivers() {
    return this.request('/admin/caregivers/unverified');
  }

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async verifyCaregiver(caregiverId) {
    return this.request(`/caregivers/${caregiverId}/verify`, {
      method: 'PATCH',
    });
  }

  async flagCaregiver(caregiverId) {
    return this.request(`/caregivers/${caregiverId}/flag`, {
      method: 'PATCH',
    });
  }

  async uploadVerificationDoc(caregiverId, docUrl) {
    return this.request(`/caregivers/${caregiverId}/upload-doc`, {
      method: 'PATCH',
      body: { docUrl },
    });
  }
}

export default new ApiService();