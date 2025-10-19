// src/pages/careseeker/SearchCaregivers.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CareSeekerSidebar from '../../components/careseeker/CareSeekerSidebar';
import { useAppContext } from '../../context/AppContext';
import apiService from '../../services/api';

const SearchCaregivers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialty: '',
    availability: '',
    minRating: 0,
    maxRate: 100,
    location: ''
  });
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCaregivers();
  }, []);

  const fetchCaregivers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCaregivers();
      console.log('✅ Backend caregivers data:', response);

      if (response && Array.isArray(response)) {
        const transformedCaregivers = response.map(c => ({
          id: c.id?.toString() || c.caregiver_id?.toString(),
          name: c.name,
          specialty: c.specialization || c.category || 'General Care',
          rating: 4.8, // placeholder (can be replaced with backend review data)
          reviewCount: 24,
          hourlyRate: c.hourly_rate || 25,
          experience: c.experience_years ? `${c.experience_years} years` : '5 years',
          qualifications: c.description || 'Certified and Experienced',
          availability: c.availability || 'Full-time',
          bio: c.description || 'Dedicated caregiver providing quality services.',
          specialties: c.specialization ? [c.specialization] : ['General Care'],
          responseRate: 95,
          completedJobs: 47,
          isFavorite: false,
          isVerified: c.is_verified || false
        }));
        setCaregivers(transformedCaregivers);
      } else {
        setCaregivers([]);
      }
    } catch (error) {
      console.error('❌ Error fetching caregivers:', error);
      setCaregivers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = caregivers.filter(cg => {
      const matchesSearch =
        cg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cg.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = !filters.specialty || cg.specialty === filters.specialty;
      const matchesAvailability = !filters.availability || cg.availability === filters.availability;
      const matchesRating = cg.rating >= filters.minRating;
      const matchesRate = cg.hourlyRate <= filters.maxRate;
      return matchesSearch && matchesSpecialty && matchesAvailability && matchesRating && matchesRate;
    });
    setCaregivers(filtered);
  };

  const toggleFavorite = (caregiverId) => {
    setCaregivers(prev =>
      prev.map(cg => (cg.id === caregiverId ? { ...cg, isFavorite: !cg.isFavorite } : cg))
    );
  };

  const StarRating = ({ rating }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-gray-600 ml-1">({rating})</span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex">
          <CareSeekerSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading caregivers...</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Find Caregivers</h1>
            <p className="text-gray-600 mt-2">Search and book qualified caregivers for your needs</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, specialty, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-3 border border-gray-300 rounded-xl hover:border-gray-400 flex items-center gap-2"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18v2.586a1 1 0 01-.293.707L14.293 13a1 1 0 00-.293.707V17l-4 4v-7.293a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                  Search
                </button>
              </div>
            </form>

            {showFilters && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                  <select
                    value={filters.specialty}
                    onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">All Specialties</option>
                    <option value="Child Care">Child Care</option>
                    <option value="Elderly Care">Elderly Care</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Any Availability</option>
                    <option value="Full-time">Full Time</option>
                    <option value="Part-time">Part Time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={4.5}>4.5+ Stars</option>
                    <option value={4.0}>4.0+ Stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Rate ($/hr)</label>
                  <input
                    type="number"
                    value={filters.maxRate}
                    onChange={(e) => setFilters({ ...filters, maxRate: parseInt(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {caregivers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No caregivers found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            ) : (
              caregivers.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {c.name?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{c.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{c.specialty}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(c.id)}
                      className={`p-2 rounded-full ${
                        c.isFavorite
                          ? 'text-red-500 bg-red-50 hover:bg-red-100'
                          : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill={c.isFavorite ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <StarRating rating={c.rating} />
                    <div className="text-lg font-bold text-gray-900">${c.hourlyRate}/hr</div>
                  </div>

                  <p className="text-sm text-gray-600 mb-6 line-clamp-2">{c.bio}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/caregivers/${c.id}`)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => navigate(`/booking/${c.id}`)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCaregivers;
