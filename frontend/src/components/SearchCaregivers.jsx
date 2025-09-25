// src/components/SearchCaregivers.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import CaregiverCard from './CaregiverCard';
import { assets } from '../assets/assets';

const SearchCaregivers = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  
  const [filters, setFilters] = useState({
    careType: '',
    specialization: '',
    location: '',
    maxRate: ''
  });

  // Enhanced caregiver data
  const caregivers = [
    {
      id: 1,
      name: "Sarah Johnson",
      careType: "Childcare",
      specialization: "Infant Care Specialist",
      rate: 18,
      rating: 4.8,
      reviews: 42,
      experience: "5 years experience",
      location: "Downtown, NY",
      availability: "Full-time",
      image: assets.profile_icon,
      verified: true
    },
    {
      id: 2,
      name: "Maria Garcia",
      careType: "Elderly Care", 
      specialization: "Senior Companion",
      rate: 22,
      rating: 4.9,
      reviews: 56,
      experience: "8 years experience",
      location: "North District, CHI",
      availability: "Part-time",
      image: assets.profile_icon,
      verified: true
    },
    {
      id: 3,
      name: "David Chen",
      careType: "Childcare",
      specialization: "Toddler Care Expert",
      rate: 20,
      rating: 4.7,
      reviews: 38,
      experience: "6 years experience", 
      location: "East Side, BOS",
      availability: "Full-time",
      image: assets.profile_icon,
      verified: false
    },
    {
      id: 4,
      name: "Lisa Wang",
      careType: "Elderly Care",
      specialization: "Dementia Care Specialist", 
      rate: 25,
      rating: 4.9,
      reviews: 34,
      experience: "10 years experience",
      location: "West End, SEA",
      availability: "Full-time",
      image: assets.profile_icon,
      verified: true
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
      const matchesCareType = !filters.careType || caregiver.careType === filters.careType;
      const matchesSpecialization = !filters.specialization || caregiver.specialization === filters.specialization;
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

  // Non-user view
  if (!user) {
    return (
      <section id="search-caregivers" className="py-20 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-6">
              Meet Our Caregivers
            </h2>
            <p className="text-xl text-blue-200 mb-12">
              Browse through our verified caregivers and find the perfect match
            </p>

            {/* Premium Preview Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {caregivers.slice(0, 2).map(caregiver => (
                <CaregiverCard key={caregiver.id} caregiver={caregiver} />
              ))}
            </div>
            
            <button
              onClick={() => navigate('/login', { state: { from: '/caregivers' } })}
              className="bg-white text-blue-900 hover:bg-blue-50 px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Login to View All Profiles
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Logged-in user view
  return (
    <section id="search-caregivers" className="py-20 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Find Your Perfect Caregiver
          </h2>
          <p className="text-xl text-blue-200">
            Use filters to narrow down your search
          </p>
        </div>

        {/* Premium Filter Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-12 max-w-4xl mx-auto border border-white/20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Care Type */}
            <div>
              <label className="block text-sm font-semibold text-blue-200 mb-2">Care Type</label>
              <select 
                value={filters.careType}
                onChange={(e) => handleFilterChange('careType', e.target.value)}
                className="w-full border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/10 text-white"
              >
                <option value="" className="text-gray-700">Select Type</option>
                <option value="Childcare" className="text-gray-700">Childcare</option>
                <option value="Elderly Care" className="text-gray-700">Elderly Care</option>
              </select>
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-semibold text-blue-200 mb-2">Specialization</label>
              <select 
                value={filters.specialization}
                onChange={(e) => handleFilterChange('specialization', e.target.value)}
                disabled={!filters.careType}
                className="w-full border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/10 text-white disabled:bg-white/5"
              >
                <option value="" className="text-gray-700">All Specialties</option>
                {specializationOptions[filters.careType]?.map(option => (
                  <option key={option} value={option} className="text-gray-700">{option}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-blue-200 mb-2">Location</label>
              <input 
                type="text"
                placeholder="City or area..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/10 text-white placeholder-blue-200"
              />
            </div>

            {/* Max Rate */}
            <div>
              <label className="block text-sm font-semibold text-blue-200 mb-2">Max Rate</label>
              <input 
                type="number"
                placeholder="$ per hour"
                value={filters.maxRate}
                onChange={(e) => handleFilterChange('maxRate', e.target.value)}
                className="w-full border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/10 text-white placeholder-blue-200"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={clearFilters}
              className="px-6 py-2 border border-white/30 text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-white">
              {filteredCaregivers.length > 0 
                ? `Found ${filteredCaregivers.length} caregivers` 
                : 'Browse our caregivers'
              }
            </h3>
          </div>

          {filteredCaregivers.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredCaregivers.map(caregiver => (
                <CaregiverCard key={caregiver.id} caregiver={caregiver} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-3xl font-bold text-white mb-4">
                No caregivers match your current filters
              </h3>
              <p className="text-blue-200 text-lg">
                Adjust your filters to see more results
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchCaregivers;