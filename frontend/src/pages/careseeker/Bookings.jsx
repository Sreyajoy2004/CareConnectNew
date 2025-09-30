// src/pages/careseeker/Bookings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CareSeekerSidebar from '../../components/careseeker/CareSeekerSidebar';
import { useAppContext } from '../../context/AppContext';

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
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const { user } = useAppContext();
  const navigate = useNavigate();

  // Enhanced demo data with more bookings for testing
  const getMockBookings = () => {
    // Get bookings from localStorage for demo
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

    // Enhanced demo data with more bookings for testing all scenarios
    if (storedBookings.length === 0) {
      const demoBookings = [
        // Upcoming Bookings (2 bookings)
        {
          id: 1,
          caregiverId: 'caregiver1',
          caregiverName: 'Maria Garcia',
          serviceType: 'Elderly Care',
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
          duration: 4,
          totalAmount: 100,
          status: 'confirmed',
          address: '123 Main St, Boston, MA',
          specialRequirements: 'Help with medication at 2 PM',
          canCancel: true,
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '14:00',
          notes: 'Please arrive 10 minutes early'
        },
        {
          id: 2,
          caregiverId: 'caregiver2',
          caregiverName: 'John Smith',
          serviceType: 'Child Care',
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
          duration: 6,
          totalAmount: 150,
          status: 'confirmed',
          address: '456 Oak Ave, Cambridge, MA',
          specialRequirements: 'Vegetarian meals only',
          canCancel: true,
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '09:00',
          notes: 'Child has peanut allergy'
        },
        // Pending Bookings (2 bookings)
        {
          id: 3,
          caregiverId: 'caregiver3',
          caregiverName: 'Sarah Johnson',
          serviceType: 'Special Needs',
          startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
          duration: 5,
          totalAmount: 125,
          status: 'pending',
          address: '789 Pine St, Boston, MA',
          specialRequirements: 'Therapeutic exercises required',
          canCancel: true,
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '10:00',
          notes: 'Session preparation needed'
        },
        {
          id: 4,
          caregiverId: 'caregiver4',
          caregiverName: 'David Chen',
          serviceType: 'Elderly Care',
          startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
          duration: 3,
          totalAmount: 75,
          status: 'pending',
          address: '321 Elm St, Boston, MA',
          specialRequirements: 'Light housekeeping',
          canCancel: true,
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '13:00',
          notes: 'Weekly visit'
        },
        // Completed Bookings (3 bookings - with different review statuses)
        {
          id: 5,
          caregiverId: 'caregiver5',
          caregiverName: 'Lisa Wang',
          serviceType: 'Child Care',
          startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
          duration: 8,
          totalAmount: 200,
          status: 'completed',
          address: '654 Maple Ave, Cambridge, MA',
          specialRequirements: 'Homework assistance',
          canReview: true,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '08:00',
          notes: 'Full day care'
        },
        {
          id: 6,
          caregiverId: 'caregiver6',
          caregiverName: 'Robert Brown',
          serviceType: 'Elderly Care',
          startTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
          duration: 6,
          totalAmount: 150,
          status: 'completed',
          address: '987 Cedar Rd, Boston, MA',
          specialRequirements: 'Physical therapy exercises',
          canReview: false,
          rating: 5,
          review: 'Excellent care provided. Very professional and caring.',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '11:00',
          notes: 'Therapy session'
        },
        {
          id: 7,
          caregiverId: 'caregiver7',
          caregiverName: 'Emily Davis',
          serviceType: 'Special Needs',
          startTime: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
          duration: 4,
          totalAmount: 120,
          status: 'completed',
          address: '147 Walnut St, Boston, MA',
          specialRequirements: 'Sensory activities',
          canReview: false,
          rating: 4,
          review: 'Good experience overall. Very patient with special needs.',
          date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '15:00',
          notes: 'Afternoon session'
        },
        // Cancelled Bookings (2 bookings - cancelled by different parties)
        {
          id: 8,
          caregiverId: 'caregiver8',
          caregiverName: 'Michael Taylor',
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
          time: '10:00'
        },
        {
          id: 9,
          caregiverId: 'caregiver9',
          caregiverName: 'Jennifer Lopez',
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
          time: '14:00'
        }
      ];

      // Store demo bookings in localStorage
      localStorage.setItem('careSeekerBookings', JSON.stringify(demoBookings));
      
      // Also store in careProviderBookings for synchronization
      const providerBookings = demoBookings.map(booking => ({
        ...booking,
        careSeekerName: user?.name || 'Care Seeker',
        careSeekerId: user?.id || 'careseeker1'
      }));
      localStorage.setItem('careProviderBookings', JSON.stringify(providerBookings));

      // Categorize the demo bookings
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
    }, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
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
      // Try API first
      try {
        const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cancelledBy: 'careseeker',
            cancellationReason: 'Changed plans'
          })
        });
        
        if (response.ok) {
          fetchBookings();
          return;
        }
      } catch (apiError) {
        console.log('API not available, using demo mode');
      }

      // Demo mode - update in localStorage for both care seeker and care provider
      const seekerBookings = JSON.parse(localStorage.getItem('careSeekerBookings') || '[]');
      const providerBookings = JSON.parse(localStorage.getItem('careProviderBookings') || '[]');
      
      // Update care seeker bookings
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
      
      // Update care provider bookings
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
      
    } catch (err) {
      setError('Failed to cancel booking');
      console.error('Error cancelling booking:', err);
    }
  };

  const handleContactCaregiver = (caregiverId) => {
    navigate(`/careprovider/${caregiverId}`);
  };

  const handleLeaveReview = (booking) => {
    setSelectedBooking(booking);
    setReviewData({
      rating: 5,
      comment: ''
    });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking) return;

    try {
      // Try API first
      try {
        const response = await fetch(`/api/bookings/${selectedBooking.id}/review`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rating: reviewData.rating,
            comment: reviewData.comment,
            caregiverId: selectedBooking.caregiverId,
            recommend: true
          })
        });
        
        if (response.ok) {
          await updateLocalStorageAfterReview();
        }
      } catch (apiError) {
        // Demo mode - update in localStorage
        await updateLocalStorageAfterReview();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review');
    }
  };

  const updateLocalStorageAfterReview = async () => {
    // Create a consistent review ID based on booking ID
    const reviewId = parseInt(selectedBooking.id) * 10; // Create unique but consistent ID
    
    // Update care seeker bookings
    const seekerBookings = JSON.parse(localStorage.getItem('careSeekerBookings') || '[]');
    const updatedSeekerBookings = seekerBookings.map(booking =>
      booking.id === selectedBooking.id 
        ? { 
            ...booking, 
            rating: reviewData.rating, 
            review: reviewData.comment, 
            canReview: false 
          } 
        : booking
    );
    localStorage.setItem('careSeekerBookings', JSON.stringify(updatedSeekerBookings));

    // Update care provider bookings
    const providerBookings = JSON.parse(localStorage.getItem('careProviderBookings') || '[]');
    const updatedProviderBookings = providerBookings.map(booking =>
      booking.id === selectedBooking.id 
        ? { 
            ...booking, 
            rating: reviewData.rating, 
            review: reviewData.comment 
          } 
        : booking
    );
    localStorage.setItem('careProviderBookings', JSON.stringify(updatedProviderBookings));

    // Update reviews in localStorage - Use consistent ID structure
    const existingReviews = JSON.parse(localStorage.getItem('careSeekerReviews') || '[]');
    const newReview = {
      id: reviewId, // Use consistent ID instead of Date.now()
      bookingId: selectedBooking.id,
      caregiverId: selectedBooking.caregiverId,
      caregiverName: selectedBooking.caregiverName,
      serviceType: selectedBooking.serviceType,
      rating: reviewData.rating,
      comment: reviewData.comment,
      recommend: true,
      createdAt: new Date().toISOString(), // Use createdAt instead of date
      canEdit: true, // Add canEdit flag
      clientName: user?.name || 'Care Seeker'
    };
    
    // Remove any existing review for this booking and add new one
    const filteredReviews = existingReviews.filter(review => review.bookingId !== selectedBooking.id);
    localStorage.setItem('careSeekerReviews', JSON.stringify([...filteredReviews, newReview]));

    // Also update caregiver reviews
    const caregiverReviews = JSON.parse(localStorage.getItem('caregiverReviews') || '[]');
    const filteredCaregiverReviews = caregiverReviews.filter(review => review.bookingId !== selectedBooking.id);
    localStorage.setItem('caregiverReviews', JSON.stringify([...filteredCaregiverReviews, {
      ...newReview,
      client: { name: user?.name || 'Care Seeker' }
    }]));

    setShowReviewModal(false);
    setSelectedBooking(null);
    fetchBookings();
    window.dispatchEvent(new Event('storage'));
    
    alert('Thank you for your review!');
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
              <span>Demo Mode: Real-time synchronization with caregivers. Bookings update automatically.</span>
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
                          {booking.caregiverName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{booking.caregiverName}</h3>
                          <p className="text-gray-600 capitalize">{booking.serviceType?.toLowerCase()}</p>
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
                        
                        {/* Contact Now button - Only for upcoming bookings */}
                        {activeTab === 'upcoming' && (
                          <button 
                            onClick={() => handleContactCaregiver(booking.caregiverId)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors w-full lg:w-auto"
                          >
                            Contact Now
                          </button>
                        )}
                        
                        {/* Cancel button - Only for pending and upcoming bookings */}
                        {(activeTab === 'pending' || activeTab === 'upcoming') && booking.canCancel && (
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
                            onClick={() => handleLeaveReview(booking)}
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

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Leave Review for {selectedBooking.caregiverName}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({...reviewData, rating: star})}
                      className="text-2xl focus:outline-none"
                    >
                      {star <= reviewData.rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <textarea 
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                  rows="4"
                  placeholder="Share your experience with this caregiver..."
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowReviewModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitReview}
                disabled={!reviewData.comment.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareSeekerBookings;