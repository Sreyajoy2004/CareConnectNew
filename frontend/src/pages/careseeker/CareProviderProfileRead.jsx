// src/pages/careseeker/CareProviderProfileRead.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import apiService from '../../services/api';

const CareProviderProfileRead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingBackend, setUsingBackend] = useState(false);

  // Mock data - fallback
  const mockCaregivers = {
    '1': {
      id: '1',
      name: 'Maria Garcia',
      specialty: 'Elderly Care & Childcare',
      rating: 4.8,
      reviews: 47,
      hourlyRate: '$25/hr',
      experience: '5 years',
      availability: 'Full-time',
      bio: 'Experienced caregiver with 5+ years in child and elderly care. Specialized in dementia care and post-surgery recovery.',
      specialties: ['Dementia Care', 'Mobility Assistance', 'Medication Management', 'Child Care'],
      address: '123 Care Street, Boston, MA 02115',
      phone: '+1 (555) 123-4567',
      email: 'maria@careconnect.com',
      responseRate: 95,
      completedJobs: 47,
      memberSince: 'Jan 2023',
      qualifications: 'CPR Certified, Nursing Degree, First Aid Certified',
      mainSpecialty: 'Elderly Care',
      certifications: ['CPR Certificate.pdf', 'First Aid Certificate.pdf', 'Nursing Degree.pdf'],
      isVerified: true,
      profileImage: null
    },
    '2': {
      id: '2',
      name: 'John Smith',
      specialty: 'Child Care',
      rating: 4.9,
      reviews: 32,
      hourlyRate: '$30/hr',
      experience: '3 years',
      availability: 'Part-time',
      bio: 'Passionate about child development and creating safe, engaging environments for children of all ages.',
      specialties: ['Newborn Care', 'Homework Assistance', 'Child Development', 'Educational Activities'],
      address: '456 Caregiver Ave, Boston, MA 02115',
      phone: '+1 (555) 987-6543',
      email: 'john@careconnect.com',
      responseRate: 98,
      completedJobs: 32,
      memberSince: 'Mar 2023',
      qualifications: 'Early Childhood Education, CPR Certified',
      mainSpecialty: 'Child Care',
      certifications: ['Child Care Certificate.pdf', 'CPR Certificate.pdf'],
      isVerified: true,
      profileImage: null
    }
  };

  // Fetch caregiver profile data
  useEffect(() => {
    const fetchCaregiverProfile = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Try backend API first
        try {
          console.log('Fetching caregiver data from backend for ID:', id);
          const response = await apiService.getCaregiver(id);
          console.log('Backend caregiver response:', response);
          
          // Transform backend data to frontend format
          const transformedCaregiver = {
            id: response.id,
            name: response.name,
            specialty: response.specialization || response.category || 'General Care',
            rating: 4.8, // You can calculate this from reviews later
            reviews: 47, // You can get this from reviews count later
            hourlyRate: response.hourly_rate ? `$${response.hourly_rate}/hr` : '$25/hr',
            experience: response.experience_years ? `${response.experience_years} years` : '5 years',
            availability: response.available_at || 'Full-time',
            bio: response.description || 'Experienced caregiver providing quality care services.',
            specialties: response.specialization ? [response.specialization] : ['General Care'],
            address: response.address || 'Address not specified',
            phone: response.phone || 'Phone not provided',
            email: response.mail || 'Email not provided',
            responseRate: 95,
            completedJobs: 47,
            memberSince: response.created_at ? new Date(response.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Jan 2023',
            qualifications: 'CPR Certified, Nursing Degree',
            mainSpecialty: response.specialization || 'General Care',
            certifications: response.verification_doc_url ? [response.verification_doc_url] : ['CPR Certificate.pdf'],
            isVerified: response.is_verified || false,
            profileImage: response.image || null
          };
          
          setCaregiver(transformedCaregiver);
          setUsingBackend(true);
          console.log('Using backend data for:', transformedCaregiver.name);
          
        } catch (apiError) {
          console.log('Backend unavailable, using mock data:', apiError.message);
          // Fallback to mock data
          const mockCaregiver = mockCaregivers[id] || mockCaregivers['1'];
          setCaregiver(mockCaregiver);
          setUsingBackend(false);
          console.log('Using mock data for caregiver:', mockCaregiver.name);
        }
      } catch (err) {
        console.error('Error fetching caregiver:', err);
        setError('Failed to load caregiver profile');
        // Still set mock data as fallback
        const mockCaregiver = mockCaregivers[id] || mockCaregivers['1'];
        setCaregiver(mockCaregiver);
        setUsingBackend(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCaregiverProfile();
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/careprovider/${id}` } });
      return;
    }
    navigate(`/booking/${id}`);
  };

  const getInitials = (name) => {
    if (!name) return 'CP';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading caregiver profile...</p>
        </div>
      </div>
    );
  }

  if (error && !caregiver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Error loading profile</div>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="p-6 lg:p-8">
        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Search
          </button>
          
          {user && (user.role === 'careseeker' || user.role === 'seeker') && (
            <button 
              onClick={handleBookNow}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Book Now
            </button>
          )}
        </div>

        {/* Connection Status */}
        {!usingBackend && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Showing demo data - Backend connection unavailable
            </div>
          </div>
        )}

        {usingBackend && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Connected to backend - Showing real data
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border-2 border-blue-100">
              <div className="text-center">
                {/* Profile Image */}
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white overflow-hidden">
                    {caregiver.profileImage ? (
                      <img 
                        src={caregiver.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(caregiver.name)
                    )}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{caregiver.name}</h2>
                <p className="text-gray-600 mb-3">Professional Caregiver</p>
                
                {/* Verification Status */}
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                  caregiver.isVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {caregiver.isVerified ? 'Verified Caregiver' : 'Pending Verification'}
                </div>
              </div>

              {/* Stats Section */}
              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Response Rate</p>
                      <p className="font-semibold text-gray-900">{caregiver.responseRate}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Completed Jobs</p>
                      <p className="font-semibold text-gray-900">{caregiver.completedJobs}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="font-semibold text-gray-900">{caregiver.rating} ⭐ ({caregiver.reviews} reviews)</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-semibold text-gray-900">{caregiver.memberSince}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Read-only Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.name}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.phone}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.hourlyRate}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.availability}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.experience}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Specialty</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.mainSpecialty}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.qualifications}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.address}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.bio}
                  </div>
                </div>
                
                {/* Specialties Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {caregiver.specialties && caregiver.specialties.map((specialty, index) => (
                      <span key={index} className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certificates Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificates & Documents
                  </label>
                  <div className="space-y-2">
                    {caregiver.certifications && caregiver.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-700">{cert}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View
                        </button>
                      </div>
                    ))}
                    {(!caregiver.certifications || caregiver.certifications.length === 0) && (
                      <div className="text-center py-4 text-gray-500">
                        No certificates uploaded
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareProviderProfileRead;