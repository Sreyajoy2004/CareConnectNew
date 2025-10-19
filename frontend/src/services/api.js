// src/services/api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';


class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    console.log('API: Making request to:', url);
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
      console.log('API: Response status:', response.status);
      
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

      const result = await response.json();
      console.log('API: Response data:', result);
      return result;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ================================
  // AUTH METHODS
  // ================================
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    
   if (response && response.token) {
  this.token = response.token;
  localStorage.setItem('token', response.token);

  if (response.user) {
    localStorage.setItem('user', JSON.stringify(response.user)); // ✅ save user too
  }
}

    return response;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // ================================
  // PROFILE METHODS
  // ================================
  async getProfile() {
    return this.request('/profile/me');
  }

  async updateProfile(profileData) {
    return this.request('/profile/me', {
      method: 'PUT',
      body: profileData,
    });
  }

  // ================================
  // CAREGIVER METHODS
  // ================================
  async getCaregivers() {
    console.log('API: Getting caregivers from /caregivers');
    const result = await this.request('/caregivers');
    console.log('API: Received caregivers data:', result);
    return result;
  }

  async getCaregiver(id) {
    return this.request(`/caregivers/${id}`);
  }

  async addCaregiver(caregiverData) {
    return this.request('/caregivers', {
      method: 'POST',
      body: caregiverData,
    });
  }

  async uploadVerificationDoc(caregiverId, docUrl) {
    return this.request(`/caregivers/${caregiverId}/upload-doc`, {
      method: 'PATCH',
      body: { docUrl },
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

  // ================================
  // BOOKING METHODS
  // ================================
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

  // ================================
  // REVIEW METHODS
  // ================================
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

  async getMyReviews() {
    return this.request('/reviews/my');
  }

  // ================================
  // ADMIN METHODS
  // ================================
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
}

export default new ApiService();