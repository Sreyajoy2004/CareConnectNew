// src/pages/careseeker/CareSeekerDashboard.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CareSeekerSidebar from '../components/careseeker/CareSeekerSidebar';
import { useAppContext } from '../context/AppContext';
import CaregiverCard from '../components/CaregiverCard';
import { assets } from '../assets/assets';

const CareSeekerDashboard = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    careType: '',
    specialization: '',
    location: '',
    maxRate: ''
  });

  // Enhanced caregiver data that matches our actual caregiver accounts
  const caregivers = [
    {
      id: 'caregiver', // This matches the login ID
      name: "Maria Caregiver",
      careType: "Childcare & Elderly Care",
      specialization: "Infant & Senior Care Specialist",
      rate: 25,
      rating: 4.8,
      reviews: 47,
      experience: "5 years experience",
      location: "Boston, MA",
      availability: "Full-time",
      verified: true,
      profileImage: null,
      qualifications: "CPR Certified, Nursing Degree",
      specialties: ["Child Care", "Elderly Care"],
      address: "123 Care Street, Boston, MA 02115",
      hourlyRate: "$25/hr",
      bio: "Experienced caregiver with 5+ years in child and elderly care.",
      memberSince: "Jan 2023",
      completedJobs: 47,
      responseRate: 95
    },
    {
      id: 'mariagarcia', // This matches the login ID
      name: "Maria Garcia",
      careType: "Elderly Care", 
      specialization: "Senior Companion & Dementia Care",
      rate: 28,
      rating: 4.9,
      reviews: 63,
      experience: "8 years experience",
      location: "Boston, MA",
      availability: "Part-time",
      verified: true,
      profileImage: null,
      qualifications: "CPR Certified, Elderly Care Specialist",
      specialties: ["Elderly Care", "Special Needs", "Dementia Care"],
      address: "456 Caregiver Ave, Boston, MA 02115",
      hourlyRate: "$28/hr",
      bio: "Dedicated caregiver specializing in elderly care with 8 years of experience.",
      memberSince: "Mar 2022",
      completedJobs: 63,
      responseRate: 98
    },
    {
      id: 'caregiver3',
      name: "David Chen",
      careType: "Childcare",
      specialization: "Toddler Care Expert",
      rate: 20,
      rating: 4.7,
      reviews: 38,
      experience: "6 years experience", 
      location: "Boston, MA",
      availability: "Full-time",
      verified: false,
      profileImage: null,
      qualifications: "Early Childhood Education",
      specialties: ["Homework Assistance", "Child Development"],
      address: "789 Childcare Lane, Boston, MA 02115",
      hourlyRate: "$20/hr",
      bio: "Passionate about child development and early education.",
      memberSince: "Jun 2023",
      completedJobs: 38,
      responseRate: 92
    },
    {
      id: 'caregiver4',
      name: "Lisa Wang",
      careType: "Elderly Care",
      specialization: "Dementia Care Specialist", 
      rate: 25,
      rating: 4.9,
      reviews: 34,
      experience: "10 years experience",
      location: "Boston, MA",
      availability: "Full-time",
      verified: true,
      profileImage: null,
      qualifications: "Special Needs Certification",
      specialties: ["Alzheimer Care", "Medication Management"],
      address: "321 Elder Care Road, Boston, MA 02115",
      hourlyRate: "$25/hr",
      bio: "Specialized in dementia and Alzheimer's care with extensive experience.",
      memberSince: "Feb 2022",
      completedJobs: 34,
      responseRate: 96
    }
  ];

  const specializationOptions = {
    'Childcare': ['Infant Care Specialist', 'Toddler Care Expert', 'After School Care', 'Special Needs'],
    'Elderly Care': ['Senior Companion', 'Dementia Care Specialist', 'Mobility Assistance', 'Medical Care'],
    '': []
  };

  const filteredCaregivers = useMemo(() => {
    const hasActiveFilters = filters.careType || filters.specialization || filters.location || filters.maxRate;
    if (!hasActiveFilters) return caregivers; // Show all caregivers when no filters

    return caregivers.filter(caregiver => {
      const matchesCareType = !filters.careType || caregiver.careType.includes(filters.careType);
      const matchesSpecialization = !filters.specialization || caregiver.specialization.includes(filters.specialization);
      const matchesLocation = !filters.location || caregiver.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesRate = !filters.maxRate || caregiver.rate <= parseInt(filters.maxRate);
      
      return matchesCareType && matchesSpecialization && matchesLocation && matchesRate;
    });
  }, [filters, caregivers]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'careType' && { specialization: '' })
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
                  <CaregiverCard key={caregiver.id} caregiver={caregiver} />
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