// src/pages/admin/CaregiverManagement.jsx
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAppContext } from '../../context/AppContext';

const CaregiverManagement = () => {
  const { user } = useAppContext();
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Get demo caregivers data
  const getDemoCaregivers = () => {
    const storedCaregivers = JSON.parse(localStorage.getItem('caregivers') || '[]');
    
    if (storedCaregivers.length === 0) {
      const demoCaregivers = [
        {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah@careconnect.com',
          status: 'verified',
          rating: 4.8,
          bookings: 45,
          experience: '5 years',
          specialties: ['Child Care', 'Elderly Care'],
          joined: '2023-01-15',
          hourlyRate: '$25/hr',
          responseRate: 98,
          flagged: false
        },
        {
          id: 2,
          name: 'Mike Brown',
          email: 'mike@careconnect.com',
          status: 'verified',
          rating: 4.5,
          bookings: 32,
          experience: '3 years',
          specialties: ['Special Needs'],
          joined: '2023-03-20',
          hourlyRate: '$22/hr',
          responseRate: 95,
          flagged: false
        },
        {
          id: 3,
          name: 'Emily Davis',
          email: 'emily@careconnect.com',
          status: 'pending',
          rating: 0,
          bookings: 0,
          experience: '2 years',
          specialties: ['Child Care'],
          joined: '2024-01-25',
          hourlyRate: '$20/hr',
          responseRate: 0,
          flagged: false
        },
        {
          id: 4,
          name: 'David Wilson',
          email: 'david@careconnect.com',
          status: 'flagged',
          rating: 3.2,
          bookings: 12,
          experience: '4 years',
          specialties: ['Elderly Care'],
          joined: '2023-12-10',
          hourlyRate: '$24/hr',
          responseRate: 85,
          flagged: true,
          flagReason: 'Multiple complaints'
        },
        {
          id: 5,
          name: 'Lisa Chen',
          email: 'lisa@careconnect.com',
          status: 'verified',
          rating: 4.9,
          bookings: 67,
          experience: '6 years',
          specialties: ['Special Needs', 'Child Care'],
          joined: '2023-02-28',
          hourlyRate: '$28/hr',
          responseRate: 99,
          flagged: false
        }
      ];
      localStorage.setItem('caregivers', JSON.stringify(demoCaregivers));
      return demoCaregivers;
    }
    return storedCaregivers;
  };

  useEffect(() => {
    fetchCaregivers();
  }, []);

  const fetchCaregivers = async () => {
    try {
      setLoading(true);
      
      try {
        const response = await fetch('/api/admin/careproviders', {
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
        setCaregivers(getDemoCaregivers());
      }
    } catch (err) {
      setError('Failed to load caregivers');
      console.error('Error fetching caregivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifyCaregiver = async (caregiverId) => {
    try {
      try {
        const response = await fetch(`/api/caregivers/${caregiverId}/verify`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          fetchCaregivers();
          return;
        }
      } catch (apiError) {
        console.log('API not available, using demo mode');
      }

      // Demo mode - update in localStorage
      const updatedCaregivers = caregivers.map(cg => 
        cg.id === caregiverId ? { ...cg, status: 'verified' } : cg
      );
      setCaregivers(updatedCaregivers);
      localStorage.setItem('caregivers', JSON.stringify(updatedCaregivers));
      
      alert('Caregiver verified successfully!');
    } catch (err) {
      setError('Failed to verify caregiver');
      console.error('Error verifying caregiver:', err);
    }
  };

  const flagCaregiver = async (caregiverId) => {
    try {
      const caregiverToUpdate = caregivers.find(cg => cg.id === caregiverId);
      const updatedFlagStatus = !caregiverToUpdate.flagged;

      try {
        const response = await fetch(`/api/caregivers/${caregiverId}/flag`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ flagged: updatedFlagStatus })
        });
        
        if (response.ok) {
          fetchCaregivers();
          return;
        }
      } catch (apiError) {
        console.log('API not available, using demo mode');
      }

      // Demo mode - update in localStorage
      const updatedCaregivers = caregivers.map(cg => 
        cg.id === caregiverId ? { 
          ...cg, 
          flagged: updatedFlagStatus,
          status: updatedFlagStatus ? 'flagged' : 'verified'
        } : cg
      );
      setCaregivers(updatedCaregivers);
      localStorage.setItem('caregivers', JSON.stringify(updatedCaregivers));
      
      alert(`Caregiver ${updatedFlagStatus ? 'flagged' : 'unflagged'} successfully!`);
    } catch (err) {
      setError('Failed to update caregiver flag status');
      console.error('Error flagging caregiver:', err);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <span className="text-sm text-gray-600 ml-1">{rating > 0 ? rating.toFixed(1) : 'No ratings'}</span>
      </div>
    );
  };

  // Filter caregivers based on search and filters
  const filteredCaregivers = caregivers.filter(caregiver => {
    const matchesSearch = caregiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caregiver.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || caregiver.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading caregivers...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-60 to-blue-100">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Caregiver Management</h1>
            <p className="text-gray-600 mt-2">Manage all care providers on the platform</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search caregivers by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
          </div>

          {/* Caregivers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCaregivers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No caregivers found</h3>
                <p className="text-gray-600">No caregivers match your search criteria.</p>
              </div>
            ) : (
              filteredCaregivers.map((caregiver) => (
                <div key={caregiver.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {caregiver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{caregiver.name}</h3>
                        <p className="text-sm text-gray-600">{caregiver.email}</p>
                      </div>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(caregiver.status)}`}>
                      {caregiver.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <StarRating rating={caregiver.rating} />
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Experience</span>
                      <span className="font-medium">{caregiver.experience}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Bookings</span>
                      <span className="font-medium">{caregiver.bookings}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Response Rate</span>
                      <span className="font-medium">{caregiver.responseRate}%</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {caregiver.specialties.map((specialty, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {caregiver.status === 'pending' && (
                      <button
                        onClick={() => verifyCaregiver(caregiver.id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => flagCaregiver(caregiver.id)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        caregiver.flagged 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {caregiver.flagged ? 'Unflag' : 'Flag'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="mt-6 text-sm text-gray-600">
            Showing {filteredCaregivers.length} of {caregivers.length} caregivers
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverManagement;