// src/pages/careseeker/Reviews.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CareSeekerSidebar from '../../components/careseeker/CareSeekerSidebar';
import { useAppContext } from '../../context/AppContext';

const CareSeekerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAppContext();
  const navigate = useNavigate();

  // Define sample reviews as a constant
  const SAMPLE_REVIEWS = [
    {
      id: 1,
      caregiverId: 'caregiver1',
      caregiverName: 'Maria Garcia',
      serviceType: 'Elderly Care',
      rating: 5,
      comment: 'Maria was absolutely wonderful with my elderly mother. She was patient, professional, and went above and beyond her duties.',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      bookingId: 'booking123',
      canEdit: true
    },
    {
      id: 2,
      caregiverId: 'caregiver2',
      caregiverName: 'John Smith',
      serviceType: 'Child Care',
      rating: 4,
      comment: 'John was great with our kids. They really enjoyed their time with him. Would book again for sure.',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      bookingId: 'booking124',
      canEdit: true
    }
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(`/api/careseeker/${user?.id}/reviews`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
          setStats(data.stats || { totalReviews: 0, averageRating: 0 });
        } else {
          throw new Error('API not available');
        }
      } catch (apiError) {
        // Fallback to localStorage data
        const storedReviews = JSON.parse(localStorage.getItem('careSeekerReviews') || '[]');
        
        let reviewsToUse = storedReviews;
        
        if (storedReviews.length === 0) {
          // Add sample reviews if no reviews exist
          reviewsToUse = SAMPLE_REVIEWS;
          localStorage.setItem('careSeekerReviews', JSON.stringify(SAMPLE_REVIEWS));
        }
        
        setReviews(reviewsToUse);
        
        // Calculate stats
        setStats({
          totalReviews: reviewsToUse.length,
          averageRating: reviewsToUse.length > 0 
            ? reviewsToUse.reduce((acc, review) => acc + review.rating, 0) / reviewsToUse.length 
            : 0
        });
      }
    } catch (err) {
      setError('Failed to load reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    console.log('Deleting review:', reviewId);
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      // Try API first
      try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          await updateLocalStorageAfterDelete(reviewId);
        }
      } catch (apiError) {
        // Demo mode - update in localStorage
        await updateLocalStorageAfterDelete(reviewId);
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review');
    }
  };

  const updateLocalStorageAfterDelete = async (reviewId) => {
    console.log('Updating localStorage after delete');
    const reviewToDelete = reviews.find(r => r.id === reviewId);
    
    // Update care seeker reviews
    const seekerReviews = JSON.parse(localStorage.getItem('careSeekerReviews') || '[]');
    const updatedSeekerReviews = seekerReviews.filter(review => review.id !== reviewId);
    localStorage.setItem('careSeekerReviews', JSON.stringify(updatedSeekerReviews));

    // Update care provider reviews
    const providerReviews = JSON.parse(localStorage.getItem('caregiverReviews') || '[]');
    const updatedProviderReviews = providerReviews.filter(review => review.id !== reviewId);
    localStorage.setItem('caregiverReviews', JSON.stringify(updatedProviderReviews));

    // Update bookings to remove review data
    if (reviewToDelete?.bookingId) {
      const seekerBookings = JSON.parse(localStorage.getItem('careSeekerBookings') || '[]');
      const updatedSeekerBookings = seekerBookings.map(booking =>
        booking.id === reviewToDelete.bookingId 
          ? { 
              ...booking, 
              rating: null, 
              review: null,
              canReview: true
            } 
          : booking
      );
      localStorage.setItem('careSeekerBookings', JSON.stringify(updatedSeekerBookings));

      const providerBookings = JSON.parse(localStorage.getItem('careProviderBookings') || '[]');
      const updatedProviderBookings = providerBookings.map(booking =>
        booking.id === reviewToDelete.bookingId 
          ? { 
              ...booking, 
              rating: null, 
              review: null
            } 
          : booking
      );
      localStorage.setItem('careProviderBookings', JSON.stringify(updatedProviderBookings));
    }

    // Update the component state immediately
    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    setReviews(updatedReviews);
    
    // Update stats based on remaining reviews
    setStats({
      totalReviews: updatedReviews.length,
      averageRating: updatedReviews.length > 0 
        ? updatedReviews.reduce((acc, review) => acc + review.rating, 0) / updatedReviews.length 
        : 0
    });

    window.dispatchEvent(new Event('storage'));
    
    alert('Review deleted successfully!');
  };

  const formatDate = (dateString) => {
    const now = new Date();
    const reviewDate = new Date(dateString);
    const diffTime = now - reviewDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return reviewDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const StarRating = ({ rating, size = 'sm' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-8 h-8'
    };
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg 
            key={star} 
            className={`${sizeClasses[size]} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
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
              <p className="mt-4 text-gray-600">Loading reviews...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
            <p className="text-gray-600 mt-2">Reviews you've written for caregivers</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
              <button 
                onClick={fetchReviews}
                className="ml-4 text-red-700 underline hover:text-red-800"
              >
                Try Again
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Stats Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-6">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0.0'}
                  </div>
                  <StarRating rating={Math.round(stats.averageRating)} size="md" />
                  <p className="text-gray-600 mt-2">{stats.totalReviews} reviews written</p>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-700 font-medium">Total Reviews</span>
                    <span className="text-lg font-bold text-blue-900">{stats.totalReviews}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-700 font-medium">Average Rating</span>
                    <span className="text-lg font-bold text-green-900">{stats.averageRating.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-purple-700 font-medium">5-Star Reviews</span>
                    <span className="text-lg font-bold text-purple-900">
                      {reviews.filter(r => r.rating === 5).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-3">
              {reviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600 mb-4">You haven't written any reviews for caregivers yet.</p>
                  <p className="text-sm text-gray-500">
                    Reviews will appear here after you complete bookings and rate caregivers.
                  </p>
                  <button 
                    onClick={() => navigate('/careseeker/bookings')}
                    className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View My Bookings
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {review.caregiverName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{review.caregiverName}</h3>
                            <p className="text-gray-600 capitalize">{review.serviceType?.toLowerCase()}</p>
                            {review.bookingId && (
                              <p className="text-xs text-gray-500">Booking #{review.bookingId}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <StarRating rating={review.rating} size="md" />
                        <span className="text-sm font-medium text-gray-700">
                          {review.rating}.0 out of 5
                        </span>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
                      
                      {/* Action Buttons */}
                      {review.canEdit && (
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => navigate('/careseeker/review', { 
                              state: { 
                                booking: review, 
                                editing: true 
                              } 
                            })}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            Edit Review
                          </button>
                          <button 
                            onClick={() => handleDeleteReview(review.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareSeekerReviews;