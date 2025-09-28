// src/pages/careseeker/Bookings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CareSeekerSidebar from '../../components/careseeker/CareSeekerSidebar';
import { useAppContext } from '../../context/AppContext';

const Bookings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState({
    upcoming: [],
    pending: [],
    completed: [],
    cancelled: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAppContext();
  const navigate = useNavigate();

  // Mock data with localStorage integration
  const getMockBookings = () => {
    // Get bookings from localStorage for demo
    const storedBookings = JSON.parse(localStorage.getItem('careSeekerBookings') || '[]');
    
    const now = new Date();
    
    const upcoming = storedBookings.filter(booking => 
      new Date(booking.startTime) > now && booking.status === 'confirmed'
    );
    
    const pending = storedBookings.filter(booking => 
      booking.status === 'pending'
    );
    
    const completed = storedBookings.filter(booking => 
      new Date(booking.startTime) < now && booking.status === 'completed'
    );
    
    const cancelled = storedBookings.filter(booking => 
      booking.status === 'cancelled'
    );

    // Add static demo bookings if no stored bookings
    if (storedBookings.length === 0) {
      return {
        upcoming: [
          {
            id: 1,
            caregiverId: 'caregiver1',
            caregiverName: 'Maria Caregiver',
            serviceType: 'Elderly Care',
            startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
            duration: 4,
            totalAmount: 100,
            status: 'confirmed',
            address: '123 Main St, Boston, MA',
            specialRequirements: 'Help with medication at 2 PM',
            canCancel: true,
            canReschedule: true
          }
        ],
        pending: [
          {
            id: 2,
            caregiverId: 'caregiver2',
            caregiverName: 'John Caregiver',
            serviceType: 'Child Care',
            startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
            duration: 6,
            totalAmount: 150,
            status: 'pending',
            address: '456 Oak Ave, Cambridge, MA',
            specialRequirements: 'Vegetarian meals only',
            canCancel: true,
            canReschedule: false
          }
        ],
        completed: [
          {
            id: 3,
            caregiverId: 'caregiver1',
            caregiverName: 'Maria Caregiver',
            serviceType: 'Elderly Care',
            startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
            duration: 4,
            totalAmount: 100,
            status: 'completed',
            address: '123 Main St, Boston, MA',
            rating: 5,
            review: 'Excellent service! Very professional.',
            canReview: true
          }
        ],
        cancelled: []
      };
    }

    return { upcoming, pending, completed, cancelled };
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      try {
        const response = await fetch(`/api/careseeker/${user?.id}/bookings`, {
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
        // Use mock data with localStorage integration
        setBookings(getMockBookings());
      }
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        fetchBookings(); // Refresh data
      } else {
        // Fallback to local update
        const storedBookings = JSON.parse(localStorage.getItem('careSeekerBookings') || '[]');
        const updatedBookings = storedBookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
        );
        localStorage.setItem('careSeekerBookings', JSON.stringify(updatedBookings));
        fetchBookings(); // Refresh with updated data
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
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

  const getTimeUntilBooking = (dateString) => {
    const now = new Date();
    const bookingDate = new Date(dateString);
    const diffTime = bookingDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1 && diffDays < 7) return `${diffDays} days from now`;
    return formatDate(dateString);
  };

  // Refresh bookings when tab changes to show latest data
  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex">
          <CareSeekerSidebar />
          <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading bookings...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">Manage your appointments and schedules</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-gray-200 overflow-x-auto">
            {[
              { key: 'upcoming', label: 'Upcoming', count: bookings.upcoming.length },
              { key: 'pending', label: 'Pending', count: bookings.pending.length },
              { key: 'completed', label: 'Completed', count: bookings.completed.length },
              { key: 'cancelled', label: 'Cancelled', count: bookings.cancelled.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-4 px-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Bookings List */}
          <div className="space-y-6">
            {bookings[activeTab]?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} bookings</h3>
                <p className="text-gray-600">You don't have any {activeTab} bookings at the moment.</p>
                {activeTab === 'pending' && (
                  <p className="text-sm text-blue-600 mt-2">New bookings will appear here after you book a caregiver.</p>
                )}
                {activeTab === 'upcoming' && (
                  <button 
                    onClick={() => navigate('/search')}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Find Caregivers
                  </button>
                )}
              </div>
            ) : (
              bookings[activeTab]?.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {booking.caregiverName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{booking.caregiverName}</h3>
                          <p className="text-gray-600 capitalize">{booking.serviceType?.toLowerCase()}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Date & Time</p>
                          <p className="font-medium">{getTimeUntilBooking(booking.startTime)}</p>
                          <p className="text-sm text-gray-600">{formatDate(booking.startTime)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Duration & Amount</p>
                          <p className="font-medium">{booking.duration} hours • ${booking.totalAmount}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-sm text-gray-600">{booking.address}</p>
                        </div>
                        {booking.specialRequirements && (
                          <div>
                            <p className="text-sm text-gray-500">Special Requirements</p>
                            <p className="text-sm text-gray-600">{booking.specialRequirements}</p>
                          </div>
                        )}
                      </div>

                      {/* Rating for completed bookings */}
                      {activeTab === 'completed' && booking.rating && (
                        <div className="mt-4 flex items-center space-x-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg 
                                key={star} 
                                className={`w-4 h-4 ${star <= booking.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">Your rating: {booking.rating}/5</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end space-y-3 w-full lg:w-auto">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      } capitalize`}>
                        {booking.status}
                      </span>
                      
                      <div className="flex flex-col space-y-2 w-full lg:w-auto">
                        <button 
                          onClick={() => navigate(`/careprovider/${booking.caregiverId}`)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors w-full lg:w-auto"
                        >
                          View Caregiver
                        </button>
                        
                        {activeTab === 'upcoming' && booking.canCancel && (
                          <button 
                            onClick={() => handleCancelBooking(booking.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors w-full lg:w-auto"
                          >
                            Cancel Booking
                          </button>
                        )}
                        
                        {activeTab === 'completed' && booking.canReview && !booking.rating && (
                          <button 
                            onClick={() => navigate(`/review/${booking.id}`)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors w-full lg:w-auto"
                          >
                            Leave Review
                          </button>
                        )}
                      </div>
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

export default Bookings;