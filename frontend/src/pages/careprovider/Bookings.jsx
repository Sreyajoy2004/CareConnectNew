// src/pages/careprovider/Bookings.jsx
import React, { useState, useEffect } from 'react';
import CareProviderSidebar from '../../components/careprovider/CareProviderSidebar';
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

  // Get demo bookings from localStorage with fallback - PERFECTLY SYNCED WITH CARE SEEKER
  const getDemoBookings = () => {
    const storedBookings = JSON.parse(localStorage.getItem('careProviderBookings') || '[]');
    
    if (storedBookings.length === 0) {
      // Create perfectly synchronized demo data that matches care seeker bookings exactly
      const demoBookings = [
        // Upcoming Bookings (IDs 1, 2)
        {
          id: 1,
          clientName: 'Sarah Family',
          clientEmail: 'family@careconnect.com',
          serviceType: 'Elderly Care',
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
          duration: 4,
          totalAmount: 100,
          status: 'confirmed',
          address: '123 Main St, Boston, MA',
          specialRequirements: 'Help with medication at 2 PM',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '14:00',
          notes: 'Please arrive 10 minutes early',
          clientId: 'family',
          caregiverId: 'caregiver1',
          caregiverName: 'Maria Garcia',
          canCancel: false
        },
        {
          id: 2,
          clientName: 'Sarah Family',
          clientEmail: 'family@careconnect.com',
          serviceType: 'Child Care',
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
          duration: 6,
          totalAmount: 150,
          status: 'confirmed',
          address: '456 Oak Ave, Cambridge, MA',
          specialRequirements: 'Vegetarian meals only',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '09:00',
          notes: 'Child has peanut allergy',
          clientId: 'family',
          caregiverId: 'caregiver2',
          caregiverName: 'John Smith',
          canCancel: false
        },
        // Pending Bookings (IDs 3, 4)
        {
          id: 3,
          clientName: 'Sarah Family',
          clientEmail: 'family@careconnect.com',
          serviceType: 'Special Needs',
          startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
          duration: 5,
          totalAmount: 125,
          status: 'pending',
          address: '789 Pine St, Boston, MA',
          specialRequirements: 'Therapeutic exercises required',
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '10:00',
          notes: 'Session preparation needed',
          clientId: 'family',
          caregiverId: 'caregiver3',
          caregiverName: 'Sarah Johnson',
          canCancel: false
        },
        {
          id: 4,
          clientName: 'Sarah Family',
          clientEmail: 'family@careconnect.com',
          serviceType: 'Elderly Care',
          startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
          duration: 3,
          totalAmount: 75,
          status: 'pending',
          address: '321 Elm St, Boston, MA',
          specialRequirements: 'Light housekeeping',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '13:00',
          notes: 'Weekly visit',
          clientId: 'family',
          caregiverId: 'caregiver4',
          caregiverName: 'David Chen',
          canCancel: false
        },
        // Completed Bookings (IDs 5, 6, 7)
        {
          id: 5,
          clientName: 'Sarah Family',
          clientEmail: 'family@careconnect.com',
          serviceType: 'Child Care',
          startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
          duration: 8,
          totalAmount: 200,
          status: 'completed',
          address: '654 Maple Ave, Cambridge, MA',
          specialRequirements: 'Homework assistance',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '08:00',
          notes: 'Full day care',
          clientId: 'family',
          caregiverId: 'caregiver5',
          caregiverName: 'Lisa Wang',
          canReview: false,
          canCancel: false
        },
        {
          id: 6,
          clientName: 'Sarah Family',
          clientEmail: 'family@careconnect.com',
          serviceType: 'Elderly Care',
          startTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
          duration: 6,
          totalAmount: 150,
          status: 'completed',
          address: '987 Cedar Rd, Boston, MA',
          specialRequirements: 'Physical therapy exercises',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '11:00',
          notes: 'Therapy session',
          clientId: 'family',
          caregiverId: 'caregiver6',
          caregiverName: 'Robert Brown',
          rating: 5,
          review: 'Excellent care provided. Very professional and caring.',
          canReview: false,
          canCancel: false
        },
        {
          id: 7,
          clientName: 'Sarah Family',
          clientEmail: 'family@careconnect.com',
          serviceType: 'Special Needs',
          startTime: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
          duration: 4,
          totalAmount: 120,
          status: 'completed',
          address: '147 Walnut St, Boston, MA',
          specialRequirements: 'Sensory activities',
          date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '15:00',
          notes: 'Afternoon session',
          clientId: 'family',
          caregiverId: 'caregiver7',
          caregiverName: 'Emily Davis',
          rating: 4,
          review: 'Good experience overall. Very patient with special needs.',
          canReview: false,
          canCancel: false
        },
        // Cancelled Bookings (IDs 8, 9)
        {
          id: 8,
          clientName: 'Sarah Family',
          clientEmail: 'family@careconnect.com',
          serviceType: 'Child Care',
          startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
          duration: 5,
          totalAmount: 125,
          status: 'cancelled',
          address: '258 Birch Ln, Cambridge, MA',
          cancelledBy: 'careprovider',
          cancellationReason: 'Caregiver emergency',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '10:00',
          clientId: 'family',
          caregiverId: 'caregiver8',
          caregiverName: 'Michael Taylor',
          canCancel: false
        },
        {
          id: 9,
          clientName: 'Sarah Family',
          clientEmail: 'family@careconnect.com',
          serviceType: 'Elderly Care',
          startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
          duration: 4,
          totalAmount: 100,
          status: 'cancelled',
          address: '369 Spruce Dr, Boston, MA',
          cancelledBy: 'careseeker',
          cancellationReason: 'Family emergency',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '14:00',
          clientId: 'family',
          caregiverId: 'caregiver9',
          caregiverName: 'Jennifer Lopez',
          canCancel: false
        }
      ];

      // Store demo bookings in localStorage
      localStorage.setItem('careProviderBookings', JSON.stringify(demoBookings));

      // Categorize the demo bookings
      const now = new Date();
      const demoUpcoming = demoBookings.filter(booking => 
        booking.status === 'confirmed' && new Date(booking.startTime) > now
      );
      
      const demoPending = demoBookings.filter(booking => 
        booking.status === 'pending'
      );
      
      const demoCompleted = demoBookings.filter(booking => 
        booking.status === 'completed'
      );
      
      const demoCancelled = demoBookings.filter(booking => 
        booking.status === 'cancelled'
      );

      return {
        upcoming: demoUpcoming,
        pending: demoPending,
        completed: demoCompleted,
        cancelled: demoCancelled
      };
    }

    // Categorize stored bookings
    const now = new Date();
    const upcoming = storedBookings.filter(booking => 
      new Date(booking.startTime) > now && booking.status === 'confirmed'
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
    
    // Set up real-time updates by listening to storage changes
    const handleStorageChange = () => {
      fetchBookings();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up interval to check for booking status changes
    const interval = setInterval(() => {
      fetchBookings();
    }, 5000); // Check every 5 seconds
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      try {
        const response = await fetch(`/api/careprovider/${user?.id}/bookings`, {
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
        // Use demo data with localStorage integration
        setBookings(getDemoBookings());
      }
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      // Try API first
      try {
        const response = await fetch(`/api/bookings/${bookingId}/accept`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          fetchBookings();
          return;
        }
      } catch (apiError) {
        console.log('API not available, using demo mode');
      }

      // Demo mode - update in localStorage for both care provider and care seeker
      const providerBookings = JSON.parse(localStorage.getItem('careProviderBookings') || '[]');
      const seekerBookings = JSON.parse(localStorage.getItem('careSeekerBookings') || '[]');
      
      // Update care provider bookings
      const updatedProviderBookings = providerBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: 'confirmed' } : booking
      );
      localStorage.setItem('careProviderBookings', JSON.stringify(updatedProviderBookings));
      
      // Update care seeker bookings
      const updatedSeekerBookings = seekerBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: 'confirmed' } : booking
      );
      localStorage.setItem('careSeekerBookings', JSON.stringify(updatedSeekerBookings));
      
      // Refresh data
      fetchBookings();
      
      // Trigger storage event to update other components
      window.dispatchEvent(new Event('storage'));
      
      alert('Booking confirmed successfully!');
      
    } catch (err) {
      setError('Failed to accept booking');
      console.error('Error accepting booking:', err);
    }
  };

  const handleDeclineBooking = async (bookingId) => {
    try {
      // Try API first
      try {
        const response = await fetch(`/api/bookings/${bookingId}/decline`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          fetchBookings();
          return;
        }
      } catch (apiError) {
        console.log('API not available, using demo mode');
      }

      // Demo mode - update in localStorage
      const providerBookings = JSON.parse(localStorage.getItem('careProviderBookings') || '[]');
      const seekerBookings = JSON.parse(localStorage.getItem('careSeekerBookings') || '[]');
      
      // Update care provider bookings
      const updatedProviderBookings = providerBookings.map(booking =>
        booking.id === bookingId ? { 
          ...booking, 
          status: 'cancelled',
          cancelledBy: 'careprovider',
          cancellationReason: 'Not available'
        } : booking
      );
      localStorage.setItem('careProviderBookings', JSON.stringify(updatedProviderBookings));
      
      // Update care seeker bookings
      const updatedSeekerBookings = seekerBookings.map(booking =>
        booking.id === bookingId ? { 
          ...booking, 
          status: 'cancelled',
          cancelledBy: 'careprovider',
          cancellationReason: 'Not available',
          canCancel: false
        } : booking
      );
      localStorage.setItem('careSeekerBookings', JSON.stringify(updatedSeekerBookings));
      
      fetchBookings();
      window.dispatchEvent(new Event('storage'));
      
      alert('Booking declined successfully!');
      
    } catch (err) {
      setError('Failed to decline booking');
      console.error('Error declining booking:', err);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      // Try API first
      try {
        const response = await fetch(`/api/bookings/${bookingId}/complete`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          fetchBookings();
          return;
        }
      } catch (apiError) {
        console.log('API not available, using demo mode');
      }

      // Demo mode - update in localStorage
      const providerBookings = JSON.parse(localStorage.getItem('careProviderBookings') || '[]');
      const seekerBookings = JSON.parse(localStorage.getItem('careSeekerBookings') || '[]');
      
      // Update care provider bookings
      const updatedProviderBookings = providerBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: 'completed' } : booking
      );
      localStorage.setItem('careProviderBookings', JSON.stringify(updatedProviderBookings));
      
      // Update care seeker bookings
      const updatedSeekerBookings = seekerBookings.map(booking =>
        booking.id === bookingId ? { 
          ...booking, 
          status: 'completed',
          canReview: true
        } : booking
      );
      localStorage.setItem('careSeekerBookings', JSON.stringify(updatedSeekerBookings));
      
      fetchBookings();
      window.dispatchEvent(new Event('storage'));
      
      alert('Booking marked as completed! Care seeker can now leave a review.');
      
    } catch (err) {
      setError('Failed to complete booking');
      console.error('Error completing booking:', err);
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

  // Refresh bookings when tab changes
  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex">
          <CareProviderSidebar />
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
        <CareProviderSidebar />
        
        <div className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
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
              <span>Demo Mode: Changes are saved locally and synchronized between care seeker and provider.</span>
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
              </div>
            ) : (
              bookings[activeTab]?.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {booking.clientName?.split(' ').map(n => n[0]).join('') || 'SF'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{booking.clientName || 'Sarah Family'}</h3>
                          <p className="text-gray-600">{booking.clientEmail}</p>
                          <p className="text-gray-500 text-sm capitalize">{booking.serviceType?.toLowerCase() || 'Care Service'}</p>
                          {booking.cancelledBy && (
                            <p className="text-sm text-red-600">
                              Cancelled by: {booking.cancelledBy === 'careprovider' ? 'You' : 'Client'}
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
                          <p className="text-sm text-gray-600">{booking.address || 'Address not provided'}</p>
                        </div>
                        {booking.specialRequirements && (
                          <div>
                            <p className="text-sm text-gray-500">Special Requirements</p>
                            <p className="text-sm text-gray-600">{booking.specialRequirements}</p>
                          </div>
                        )}
                      </div>

                      {booking.notes && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">Client Notes</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-1">{booking.notes}</p>
                        </div>
                      )}

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
                            <span className="text-sm text-gray-600">Rating: {booking.rating}/5</span>
                          </div>
                          {booking.review && (
                            <div>
                              <p className="text-sm text-gray-500">Review:</p>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-1">"{booking.review}"</p>
                            </div>
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
                        {activeTab === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleAcceptBooking(booking.id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors w-full lg:w-auto"
                            >
                              Accept Booking
                            </button>
                            <button 
                              onClick={() => handleDeclineBooking(booking.id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors w-full lg:w-auto"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        
                        {activeTab === 'upcoming' && booking.status === 'confirmed' && (
                          <button 
                            onClick={() => handleCompleteBooking(booking.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors w-full lg:w-auto"
                          >
                            Mark Complete
                          </button>
                        )}
                        
                        {activeTab === 'completed' && booking.rating && (
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Rated {booking.rating}/5</p>
                          </div>
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