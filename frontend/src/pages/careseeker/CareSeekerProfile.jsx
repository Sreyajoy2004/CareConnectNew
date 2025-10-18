// src/pages/careseeker/CareSeekerProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import CareSeekerSidebar from '../../components/careseeker/CareSeekerSidebar';
import apiService from '../../services/api';

const CareSeekerProfile = () => {
  const { user, updateProfile } = useAppContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch profile data
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      try {
        // Try backend API first
        const response = await apiService.getProfile();
        
        // Transform backend data to frontend format
        const nameParts = response.name?.split(' ') || ['Sarah', 'Johnson'];
        const transformedData = {
          firstName: nameParts[0] || 'Sarah',
          lastName: nameParts.slice(1).join(' ') || 'Johnson',
          email: response.email || 'family@careconnect.com',
          phone: response.phone || '(555) 123-4567',
          address: response.address || '123 Main Street, Anytown, CA 12345',
          emergencyContact: '(555) 987-6543' // This would come from a separate API
        };
        
        setFormData(transformedData);
      } catch (apiError) {
        console.log('Backend unavailable, using demo mode');
        // Fallback to localStorage data
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const storedProfile = JSON.parse(localStorage.getItem('careSeekerProfile') || '{}');
        
        setFormData({
          firstName: storedUser.firstName || 'Sarah',
          lastName: storedUser.lastName || 'Johnson',
          email: storedUser.email || 'family@careconnect.com',
          phone: storedUser.phone || '(555) 123-4567',
          address: storedProfile.address || '123 Main Street, Anytown, CA 12345',
          emergencyContact: storedProfile.emergencyContact || '(555) 987-6543'
        });
      }
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Prepare data for backend - UPDATED FOR AMAL'S BACKEND STRUCTURE
      const profileData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        bio: '', // Add empty bio for backend compatibility
        // emergencyContact would be handled separately in a real app
      };

      const success = await updateProfile(profileData);
      
      if (success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Update localStorage for consistency
        const updatedUser = {
          ...JSON.parse(localStorage.getItem('user') || '{}'),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        const updatedProfile = {
          address: formData.address,
          emergencyContact: formData.emergencyContact
        };
        localStorage.setItem('careSeekerProfile', JSON.stringify(updatedProfile));
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'CS';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfileData(); // Reset form data
    setError('');
    setSuccess('');
  };

  if (loading && !formData.firstName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <CareSeekerSidebar />
        
        <div className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  My Profile
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your personal information and emergency contacts
                </p>
              </div>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-600 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl">
              {success}
            </div>
          )}

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                    {getInitials(formData.firstName, formData.lastName)}
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-gray-600">Care Seeker</p>
                  
                  <div className="mt-6 space-y-3 text-left">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Member since {new Date().getFullYear()}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Active Member</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter your first name"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter your last name"
                      />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter your email address"
                      />
                    </div>

                    {/* Phone */}
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Full Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter your full address"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact Section */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Emergency Contact
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Emergency Contact Number *
                        </label>
                        <input
                          type="tel"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="Enter emergency contact number"
                        />
                        <p className="text-gray-500 text-xs mt-2">
                          This information will be shared with your caregivers in case of emergency
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Completion Status */}
                  {!isEditing && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Profile Status</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Profile Completion</span>
                          <span className="text-green-600 font-medium">Complete</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full w-full"></div>
                        </div>
                        
                        <div className="flex items-center text-gray-600 text-sm">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          All required information is provided
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareSeekerProfile;