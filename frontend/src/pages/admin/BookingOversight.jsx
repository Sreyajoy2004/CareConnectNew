// src/pages/admin/BookingOversight.jsx
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAppContext } from '../../context/AppContext';

const BookingOversight = () => {
  const { user } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Get demo bookings data
  const getDemoBookings = () => {
    const storedBookings = JSON.parse(localStorage.getItem('careSeekerBookings') || '[]');
    return storedBookings;
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      try {
        const response = await fetch('/api/admin/bookings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          throw new Error('API not available');
        }
      } catch (apiError) {
        setBookings(getDemoBookings());
      }
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.caregiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
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
              <p className="mt-4 text-gray-600">Loading bookings...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Booking Oversight</h1>
            <p className="text-gray-600 mt-2">Monitor all bookings across the platform</p>
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
                  placeholder="Search by client, provider, or service..."
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
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-6">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600">No bookings match your search criteria.</p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusBadgeColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Booking #{booking.id}</h3>
                          <p className="text-gray-600 capitalize">{booking.serviceType?.toLowerCase() || 'Care Service'}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Client</p>
                          <p className="font-medium">{booking.clientName || 'Sarah Family'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Care Provider</p>
                          <p className="font-medium">{booking.caregiverName || 'Professional Caregiver'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date & Time</p>
                          <p className="font-medium">{formatDate(booking.startTime)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Duration & Amount</p>
                          <p className="font-medium">{booking.duration} hours • ${booking.totalAmount}</p>
                        </div>
                      </div>

                      {booking.specialRequirements && (
                        <div>
                          <p className="text-sm text-gray-500">Special Requirements</p>
                          <p className="text-sm text-gray-600">{booking.specialRequirements}</p>
                        </div>
                      )}

                      {booking.cancelledBy && (
                        <div className="mt-2">
                          <p className="text-sm text-red-600">
                            Cancelled by: {booking.cancelledBy === 'careprovider' ? 'Care Provider' : 'Client'}
                          </p>
                          {booking.cancellationReason && (
                            <p className="text-sm text-gray-600">Reason: {booking.cancellationReason}</p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end space-y-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(booking.status)} capitalize`}>
                        {booking.status}
                      </span>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="text-sm text-gray-600">{new Date(booking.startTime).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="mt-6 text-sm text-gray-600">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingOversight;