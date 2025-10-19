// src/pages/careseeker/CareSeekerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CareSeekerSidebar from '../components/careseeker/CareSeekerSidebar';
import { useAppContext } from '../context/AppContext';
import CaregiverCard from '../components/CaregiverCard';
import apiService from '../services/api';

const CareSeekerDashboard = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    careType: '',
    specialization: '',
    location: '',
    maxRate: ''
  });

  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define specialization options for each care type
  const specializationOptions = {
    'Childcare': ['Infant Care', 'Toddler Care', 'After School Care', 'Special Needs', 'Homework Assistance'],
    'Elderly Care': ['Dementia Care', 'Mobility Assistance', 'Medication Management', 'Companion Care', 'Post-Surgery Care'],
    '': []
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch caregivers from backend
      try {
        const caregiversData = await apiService.getCaregivers();
        // Transform backend data to frontend format with better specialization handling
        const transformedCaregivers = caregiversData.map(caregiver => ({
          id: caregiver.id,
          name: caregiver.name,
          careType: caregiver.category || 'General Care',
          specialization: caregiver.specialization || 'Care Specialist',
          rate: caregiver.hourly_rate || 25,
          rating: 4.8,
          reviews: 24,
          experience: caregiver.experience_years ? `${caregiver.experience_years} years experience` : '5 years experience',
          location: caregiver.address ? caregiver.address.split(',')[0] : 'Boston, MA', // Extract city from address
          availability: caregiver.available_at || 'Full-time',
          verified: caregiver.is_verified || true,
          profileImage: null,
          qualifications: 'CPR Certified, Nursing Degree',
          // Map backend specialization to our frontend specialties array
          specialties: mapSpecializationToArray(caregiver.specialization),
          address: caregiver.address || '123 Care Street, Boston, MA',
          hourlyRate: `$${caregiver.hourly_rate || 25}/hr`,
          bio: caregiver.description || 'Experienced caregiver providing quality care services.',
          memberSince: 'Jan 2023',
          completedJobs: 47,
          responseRate: 95
        }));
        setCaregivers(transformedCaregivers);
      } catch (apiError) {
        console.log('Backend unavailable, using demo data');
        // Fallback to demo data with proper specialties
        setCaregivers([
          {
            id: 1,
            name: "Maria Caregiver",
            careType: "Childcare",
            specialization: "Infant & Toddler Care",
            rate: 25,
            rating: 4.8,
            reviews: 47,
            experience: "5 years experience",
            location: "Boston, MA",
            availability: "Full-time",
            verified: true,
            profileImage: null,
            qualifications: "CPR Certified, Nursing Degree",
            specialties: ["Infant Care", "Toddler Care", "Homework Assistance"],
            address: "123 Care Street, Boston, MA 02115",
            hourlyRate: "$25/hr",
            bio: "Experienced caregiver with 5+ years in child and elderly care.",
            memberSince: "Jan 2023",
            completedJobs: 47,
            responseRate: 95
          },
          {
            id: 2,
            name: "Maria Garcia",
            careType: "Elderly Care", 
            specialization: "Dementia & Companion Care",
            rate: 28,
            rating: 4.9,
            reviews: 63,
            experience: "8 years experience",
            location: "Boston, MA",
            availability: "Part-time",
            verified: true,
            profileImage: null,
            qualifications: "CPR Certified, Elderly Care Specialist",
            specialties: ["Dementia Care", "Mobility Assistance", "Companion Care"],
            address: "456 Caregiver Ave, Boston, MA 02115",
            hourlyRate: "$28/hr",
            bio: "Dedicated caregiver specializing in elderly care with 8 years of experience.",
            memberSince: "Mar 2022",
            completedJobs: 63,
            responseRate: 98
          },
          {
            id: 3,
            name: "David Chen",
            careType: "Childcare",
            specialization: "Special Needs Expert",
            rate: 30,
            rating: 4.7,
            reviews: 38,
            experience: "6 years experience", 
            location: "Boston, MA",
            availability: "Full-time",
            verified: false,
            profileImage: null,
            qualifications: "Special Needs Certification",
            specialties: ["Special Needs", "Behavioral Therapy", "Homework Assistance"],
            address: "789 Childcare Lane, Boston, MA 02115",
            hourlyRate: "$30/hr",
            bio: "Specialized in special needs care with extensive experience.",
            memberSince: "Jun 2023",
            completedJobs: 38,
            responseRate: 92
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map backend specialization to frontend specialties array
  const mapSpecializationToArray = (specialization) => {
    if (!specialization) return ['General Care'];
    
    const spec = specialization.toLowerCase();
    if (spec.includes('child') || spec.includes('infant') || spec.includes('toddler')) {
      return ['Infant Care', 'Toddler Care', 'Child Development'];
    } else if (spec.includes('elderly') || spec.includes('senior') || spec.includes('dementia')) {
      return ['Dementia Care', 'Mobility Assistance', 'Companion Care'];
    } else if (spec.includes('special needs') || spec.includes('disability')) {
      return ['Special Needs', 'Behavioral Therapy', 'Personal Care'];
    }
    
    return ['General Care'];
  };

  // FIXED FILTER LOGIC
  const filteredCaregivers = caregivers.filter(caregiver => {
    const matchesCareType = !filters.careType || 
                           caregiver.careType.toLowerCase().includes(filters.careType.toLowerCase());
    
    const matchesSpecialization = !filters.specialization || 
                                caregiver.specialties.some(spec => 
                                  spec.toLowerCase().includes(filters.specialization.toLowerCase())
                                );
    
    const matchesLocation = !filters.location || 
                           caregiver.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesRate = !filters.maxRate || caregiver.rate <= parseInt(filters.maxRate);
    
    return matchesCareType && matchesSpecialization && matchesLocation && matchesRate;
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'careType' && { specialization: '' }) // Reset specialization when care type changes
    }));
  };

  const clearFilters = () => {
    setFilters({
      careType: '',
      specialization: '',
      location: '',
      maxRate: ''
    });
  };

  const handleBookCaregiver = (caregiverId) => {
    navigate(`/booking/${caregiverId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex">
          <CareSeekerSidebar />
          <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex">
        <CareSeekerSidebar />
        
        <div className="flex-1 p-6 lg:p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'Care Seeker'}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Find the perfect caregiver for your needs
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Upcoming Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed Services</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Find Your Perfect Caregiver
              </h2>
              
              {/* Filter Section */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Care Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Care Type</label>
                  <select 
                    value={filters.careType}
                    onChange={(e) => handleFilterChange('careType', e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
                  >
                    <option value="">Select Type</option>
                    <option value="Childcare">Childcare</option>
                    <option value="Elderly Care">Elderly Care</option>
                  </select>
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                  <select 
                    value={filters.specialization}
                    onChange={(e) => handleFilterChange('specialization', e.target.value)}
                    disabled={!filters.careType}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700 disabled:bg-gray-50"
                  >
                    <option value="">All Specialties</option>
                    {specializationOptions[filters.careType]?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input 
                    type="text"
                    placeholder="City or area..."
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700 placeholder-gray-400"
                  />
                </div>

                {/* Max Rate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Rate</label>
                  <input 
                    type="number"
                    placeholder="$ per hour"
                    value={filters.maxRate}
                    onChange={(e) => handleFilterChange('maxRate', e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button 
                  onClick={clearFilters}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Caregiver Cards Grid */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {filteredCaregivers.length > 0 
                  ? `Found ${filteredCaregivers.length} caregivers` 
                  : 'Browse our caregivers'
                }
              </h3>
            </div>

            {filteredCaregivers.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCaregivers.map(caregiver => (
                  <CaregiverCard 
                    key={caregiver.id} 
                    caregiver={caregiver}
                    onBook={() => handleBookCaregiver(caregiver.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  No caregivers match your current filters
                </h3>
                <p className="text-gray-600 mb-4">
                  Adjust your filters to see more results
                </p>
                <button 
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareSeekerDashboard;