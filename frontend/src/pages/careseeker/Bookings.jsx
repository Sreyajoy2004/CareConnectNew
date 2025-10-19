// src/pages/careseeker/Bookings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CareSeekerSidebar from '../../components/careseeker/CareSeekerSidebar';
import { useAppContext } from '../../context/AppContext';
import apiService from '../../services/api';

const CareSeekerBookings = () => {
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

  // Transform backend bookings to frontend format
  const transformBackendBookings = (backendBookings) => {
    const now = new Date();
    
    const transformed = backendBookings.map(booking => ({
      id: booking.id,
      caregiverName: booking.careprovider_name || booking.provider_name || 'Caregiver',
      serviceType: booking.category || 'Care Service',
      startTime: booking.booking_date,
      endTime: new Date(new Date(booking.booking_date).getTime() + 2 * 60 * 60 * 1000).toISOString(),
      duration: 2,
      totalAmount: 50, // Default amount
      status: booking.status,
      address: 'Address not specified',
      specialRequirements: '',
      date: booking.booking_date.split('T')[0],
      time: new Date(booking.booking_date).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      notes: '',
      caregiverId: booking.resource_id,
      canCancel: ['pending', 'confirmed'].includes(booking.status),
      canReview: booking.status === 'completed' && !booking.rating
    }));

    // Categorize bookings
    const upcoming = transformed.filter(booking => 
      booking.status === 'confirmed' && new Date(booking.startTime) > now
    );
    
    const pending = transformed.filter(booking => 
      booking.status === 'pending'
    );
    
    const completed = transformed.filter(booking => 
      booking.status === 'completed'
    );

    const cancelled = transformed.filter(booking => 
      booking.status === 'cancelled'
    );

    return { upcoming, pending, completed, cancelled };
  };

  // Get demo bookings fallback
  const getMockBookings = () => {
    const storedBookings = JSON.parse(localStorage.getItem('careSeekerBookings') || '[]');
    
    const now = new Date();
    
    // Categorize bookings properly
    const upcoming = storedBookings.filter(booking => 
      booking.status === 'confirmed' && new Date(booking.startTime) > now
    );
    
    const pending = storedBookings.filter(booking => 
      booking.status === 'pending'
    );
    
    const completed = storedBookings.filter(booking => 
      booking.status === 'completed'
    );
    
    const cancelled = storedBookings.filter(booking => 
      booking.status === 'cancelled'
    );

    return { upcoming, pending, completed, cancelled };
  };

  useEffect(() => {
    fetchBookings();
    
    // Listen for storage changes to get real-time updates
    const handleStorageChange = () => {
      fetchBookings();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up interval to check for updates
    const interval = setInterval(() => {
      fetchBookings();
    }, 3000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      try {
        // Use backend API
        const response = await apiService.getMyBookings();
        const categorizedBookings = transformBackendBookings(response);
        setBookings(categorizedBookings);
      } catch (apiError) {
        // Fallback to demo data
        console.log('Backend unavailable, using demo mode');
        const mockBookings = getMockBookings();
        setBookings(mockBookings);
      }
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      // Use backend API
      await apiService.cancelBooking(bookingId);
      fetchBookings();
      alert('Booking cancelled successfully!');
    } catch (error) {
      console.log('Backend unavailable, using demo mode');
      // Fallback to demo logic
      const seekerBookings = JSON.parse(localStorage.getItem('careSeekerBookings') || '[]');
      const providerBookings = JSON.parse(localStorage.getItem('careProviderBookings') || '[]');
      
      const updatedSeekerBookings = seekerBookings.map(booking =>
        booking.id === bookingId 
          ? { 
              ...booking, 
              status: 'cancelled', 
              cancelledBy: 'careseeker',
              cancellationReason: 'Changed plans',
              canCancel: false
            } 
          : booking
      );
      localStorage.setItem('careSeekerBookings', JSON.stringify(updatedSeekerBookings));
      
      const updatedProviderBookings = providerBookings.map(booking =>
        booking.id === bookingId 
          ? { 
              ...booking, 
              status: 'cancelled', 
              cancelledBy: 'careseeker',
              cancellationReason: 'Changed plans'
            } 
          : booking
      );
      localStorage.setItem('careProviderBookings', JSON.stringify(updatedProviderBookings));
      
      fetchBookings();
      window.dispatchEvent(new Event('storage'));
      alert('Booking cancelled successfully!');
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

          {/* Demo Mode Indicator */}
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Integrated Mode: Using backend API with demo fallback</span>
            </div>
          </div>

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
                          {booking.caregiverName?.split(' ').map(n => n[0]).join('') || 'CG'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{booking.caregiverName || 'Caregiver'}</h3>
                          <p className="text-gray-600 capitalize">{booking.serviceType?.toLowerCase() || 'care service'}</p>
                          {booking.cancelledBy && (
                            <p className="text-sm text-red-600">
                              Cancelled by: {booking.cancelledBy === 'careprovider' ? 'Caregiver' : 'You'}
                            </p>
                          )}
                          {booking.cancellationReason && (
                            <p className="text-sm text-gray-600">Reason: {booking.cancellationReason}</p>
                          )}
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
                          <p className="text-sm text-gray-600">{booking.address || 'Address not specified'}</p>
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
                        <div className="mt-4">
                          <div className="flex items-center space-x-2 mb-2">
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
                          {booking.review && (
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              "{booking.review}"
                            </p>
                          )}
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
                        
                        {/* REMOVED: Contact Now button - redundant with View Caregiver */}
                        
                        {/* Cancel button - Only for pending and upcoming bookings */}
                        {(activeTab === 'pending' || activeTab === 'upcoming') && booking.canCancel !== false && (
                          <button 
                            onClick={() => handleCancelBooking(booking.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors w-full lg:w-auto"
                          >
                            Cancel Booking
                          </button>
                        )}
                        
                        {/* Leave Review button - Only for completed bookings without review */}
                        {activeTab === 'completed' && booking.canReview && !booking.rating && (
                          <button 
                            onClick={() => navigate('/careseeker/review', { state: { booking } })}
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

export default CareSeekerBookings;