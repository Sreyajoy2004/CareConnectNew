import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CareSeekerSidebar from '../../components/careseeker/CareSeekerSidebar';
import { useAppContext } from '../../context/AppContext';

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

  // Mock data - will be replaced by API calls
  const mockCaregivers = [
    {
      id: 'caregiver1',
      name: 'Maria Caregiver',
      specialty: 'Elderly Care',
      rating: 4.8,
      reviewCount: 24,
      hourlyRate: 25,
      experience: '5 years',
      qualifications: 'CPR Certified, Nursing Degree',
      availability: 'Full-time',
      bio: 'Experienced caregiver specializing in elderly care with 5+ years of experience.',
      specialties: ['Dementia Care', 'Mobility Assistance', 'Medication Management'],
      responseRate: 95,
      completedJobs: 47,
      isFavorite: false
    },
    {
      id: 'caregiver2',
      name: 'John Caregiver',
      specialty: 'Child Care',
      rating: 4.9,
      reviewCount: 18,
      hourlyRate: 30,
      experience: '3 years',
      qualifications: 'Early Childhood Education',
      availability: 'Part-time',
      bio: 'Passionate about child development and creating safe, engaging environments.',
      specialties: ['Newborn Care', 'Homework Assistance', 'Child Development'],
      responseRate: 98,
      completedJobs: 32,
      isFavorite: true
    },
    {
      id: 'caregiver3',
      name: 'Sarah Johnson',
      specialty: 'Elderly Care',
      rating: 4.7,
      reviewCount: 15,
      hourlyRate: 28,
      experience: '7 years',
      qualifications: 'Registered Nurse, CPR Certified',
      availability: 'Full-time',
      bio: 'Compassionate RN with extensive experience in elderly care and medication management.',
      specialties: ['Post-Surgery Care', 'Alzheimer Care', 'Personal Hygiene'],
      responseRate: 92,
      completedJobs: 63,
      isFavorite: false
    }
  ];

  useEffect(() => {
    fetchCaregivers();
  }, []);

  const fetchCaregivers = async () => {
    try {
      setLoading(true);
      
      // Try API call first
      try {
        const response = await fetch('/api/caregivers/search', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCaregivers(data);
        } else {
          throw new Error('API not available');
        }
      } catch (apiError) {
        // Fallback to mock data
        console.log('Using mock data for caregivers');
        setCaregivers(mockCaregivers);
      }
    } catch (err) {
      console.error('Error fetching caregivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/caregivers/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          searchTerm,
          filters
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCaregivers(data);
      } else {
        // Fallback to filtered mock data
        const filtered = mockCaregivers.filter(caregiver => {
          const matchesSearch = caregiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              caregiver.specialty.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesSpecialty = !filters.specialty || caregiver.specialty === filters.specialty;
          const matchesAvailability = !filters.availability || caregiver.availability === filters.availability;
          const matchesRating = caregiver.rating >= filters.minRating;
          const matchesRate = caregiver.hourlyRate <= filters.maxRate;
          
          return matchesSearch && matchesSpecialty && matchesAvailability && matchesRating && matchesRate;
        });
        
        setCaregivers(filtered);
      }
    } catch (err) {
      console.error('Error searching caregivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (caregiverId) => {
    try {
      const response = await fetch(`/api/caregivers/${caregiverId}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setCaregivers(prev => prev.map(cg => 
          cg.id === caregiverId ? { ...cg, isFavorite: !cg.isFavorite } : cg
        ));
      } else {
        // Fallback to local toggle
        setCaregivers(prev => prev.map(cg => 
          cg.id === caregiverId ? { ...cg, isFavorite: !cg.isFavorite } : cg
        ));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg 
            key={star} 
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex">
          <CareSeekerSidebar />
          <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Find Caregivers</h1>
            <p className="text-gray-600 mt-2">Search and book qualified caregivers for your needs</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by name, specialty, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-3 border border-gray-300 rounded-xl hover:border-gray-400 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                  Filters
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                    <select
                      value={filters.specialty}
                      onChange={(e) => setFilters({...filters, specialty: e.target.value})}
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
                      onChange={(e) => setFilters({...filters, availability: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="">Any Availability</option>
                      <option value="Full-time">Full Time</option>
                      <option value="Part-time">Part Time</option>
                      <option value="Weekends">Weekends Only</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                    <select
                      value={filters.minRating}
                      onChange={(e) => setFilters({...filters, minRating: parseFloat(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value={0}>Any Rating</option>
                      <option value={4.5}>4.5+ Stars</option>
                      <option value={4.0}>4.0+ Stars</option>
                      <option value={3.5}>3.5+ Stars</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Rate ($/hr)</label>
                    <input
                      type="number"
                      value={filters.maxRate}
                      onChange={(e) => setFilters({...filters, maxRate: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {caregivers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No caregivers found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters</p>
              </div>
            ) : (
              caregivers.map((caregiver) => (
                <div key={caregiver.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {caregiver.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {caregiver.name}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize">{caregiver.specialty.toLowerCase()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFavorite(caregiver.id)}
                        className={`p-2 rounded-full transition-colors ${
                          caregiver.isFavorite 
                            ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                            : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
                        }`}
                      >
                        <svg className="w-5 h-5" fill={caregiver.isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>

                    {/* Rating and Rate */}
                    <div className="flex justify-between items-center mb-4">
                      <StarRating rating={caregiver.rating} />
                      <div className="text-lg font-bold text-gray-900">${caregiver.hourlyRate}/hr</div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{caregiver.experience}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Availability:</span>
                        <span className="font-medium">{caregiver.availability}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Response Rate:</span>
                        <span className="font-medium">{caregiver.responseRate}%</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {caregiver.specialties.slice(0, 3).map((specialty, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {specialty}
                          </span>
                        ))}
                        {caregiver.specialties.length > 3 && (
                          <span className="text-gray-500 text-xs">+{caregiver.specialties.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-600 mb-6 line-clamp-2">{caregiver.bio}</p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {/* UPDATED NAVIGATION PATH */}
                        <button
                          onClick={() => navigate(`/careprovider/${caregiver.id}`)}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
>
                              View Profile
                        </button>
                      <button
                        onClick={() => navigate(`/booking/new?caregiverId=${caregiver.id}`)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Book Now
                      </button>
                    </div>
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