// src/pages/careseeker/ReviewForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import apiService from '../../services/api';

const ReviewForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppContext();
  
  // Get booking data from location state or localStorage
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    recommend: true
  });

  useEffect(() => {
    const initializeForm = () => {
      try {
        setLoading(true);
        
        // Get booking data from location state (for new reviews)
        if (location.state?.booking) {
          setBooking(location.state.booking);
          setLoading(false);
          return;
        }

        // Get booking data from URL params or localStorage (for editing)
        const searchParams = new URLSearchParams(location.search);
        const bookingId = searchParams.get('bookingId');
        const reviewId = searchParams.get('reviewId');

        if (bookingId) {
          // Find booking from localStorage
          const storedBookings = JSON.parse(localStorage.getItem('careSeekerBookings') || '[]');
          const foundBooking = storedBookings.find(b => b.id === bookingId);
          if (foundBooking) {
            setBooking(foundBooking);
          }
        }

        if (reviewId) {
          // Find existing review for editing
          const storedReviews = JSON.parse(localStorage.getItem('careSeekerReviews') || '[]');
          const foundReview = storedReviews.find(r => r.id === parseInt(reviewId));
          if (foundReview) {
            setBooking(foundReview);
            setFormData({
              rating: foundReview.rating,
              comment: foundReview.comment,
              recommend: foundReview.recommend !== false
            });
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error initializing review form:', error);
        setLoading(false);
      }
    };

    initializeForm();
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!booking) {
      alert('Error: Booking information not found');
      return;
    }

    try {
      // Try backend first - UPDATED FOR AMAL'S BACKEND STRUCTURE
      const reviewData = {
        bookingId: booking.id,
        resourceId: booking.caregiverId || booking.providerId,
        rating: parseInt(formData.rating),
        comment: formData.comment
      };

      try {
        const response = await apiService.createReview(reviewData);
        
        if (response.reviewId) {
          // Also update localStorage for consistency
          await updateLocalStorageAfterSubmit(response.reviewId);
          alert(location.state?.editing ? 'Review updated successfully!' : 'Thank you for your review!');
          navigate('/careseeker/reviews');
          return;
        }
      } catch (apiError) {
        console.log('Backend review failed, using demo mode');
      }

      // Fallback to localStorage-only review
      await updateLocalStorageAfterSubmit(Date.now());
      alert(location.state?.editing ? 'Review updated successfully!' : 'Thank you for your review!');
      navigate('/careseeker/reviews');
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    }
  };

  const updateLocalStorageAfterSubmit = async (reviewId) => {
    const newReview = {
      id: reviewId,
      bookingId: booking.id,
      caregiverId: booking.caregiverId || booking.providerId,
      caregiverName: booking.caregiverName || booking.providerName,
      serviceType: booking.serviceType,
      rating: formData.rating,
      comment: formData.comment,
      recommend: formData.recommend,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      canEdit: true,
      clientName: user?.name || 'Care Seeker',
      clientId: user?.id
    };

    // Update care seeker reviews
    const seekerReviews = JSON.parse(localStorage.getItem('careSeekerReviews') || '[]');
    const existingReviewIndex = seekerReviews.findIndex(r => r.id === reviewId);
    
    let updatedSeekerReviews;
    if (existingReviewIndex >= 0) {
      // Update existing review
      updatedSeekerReviews = [...seekerReviews];
      updatedSeekerReviews[existingReviewIndex] = newReview;
    } else {
      // Add new review
      updatedSeekerReviews = [...seekerReviews, newReview];
    }
    localStorage.setItem('careSeekerReviews', JSON.stringify(updatedSeekerReviews));

    // Update care provider reviews
    const providerReviews = JSON.parse(localStorage.getItem('caregiverReviews') || '[]');
    const existingProviderReviewIndex = providerReviews.findIndex(r => r.id === reviewId);
    
    let updatedProviderReviews;
    if (existingProviderReviewIndex >= 0) {
      // Update existing review
      updatedProviderReviews = [...providerReviews];
      updatedProviderReviews[existingProviderReviewIndex] = {
        ...newReview,
        client: { name: user?.name || 'Care Seeker' }
      };
    } else {
      // Add new review
      updatedProviderReviews = [...providerReviews, {
        ...newReview,
        client: { name: user?.name || 'Care Seeker' }
      }];
    }
    localStorage.setItem('caregiverReviews', JSON.stringify(updatedProviderReviews));

    // Update bookings with review data
    const seekerBookings = JSON.parse(localStorage.getItem('careSeekerBookings') || '[]');
    const updatedSeekerBookings = seekerBookings.map(b =>
      b.id === booking.id 
        ? { 
            ...b, 
            rating: formData.rating, 
            review: formData.comment,
            canReview: false
          } 
        : b
    );
    localStorage.setItem('careSeekerBookings', JSON.stringify(updatedSeekerBookings));

    const providerBookings = JSON.parse(localStorage.getItem('careProviderBookings') || '[]');
    const updatedProviderBookings = providerBookings.map(b =>
      b.id === booking.id 
        ? { 
            ...b, 
            rating: formData.rating, 
            review: formData.comment
          } 
        : b
    );
    localStorage.setItem('careProviderBookings', JSON.stringify(updatedProviderBookings));

    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'));
  };

  const handleCancel = () => {
    if (location.state?.editing) {
      navigate('/careseeker/reviews');
    } else {
      navigate('/careseeker/bookings');
    }
  };

  // SVG Icons
  const StarIcon = ({ filled, size = 'w-8 h-8' }) => (
    <svg 
      className={`${size} ${filled ? 'text-yellow-400' : 'text-gray-300'} transition-colors`} 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-gray-100 py-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-800/10 to-transparent animate-pulse"></div>
      
      <div className="max-w-2xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {location.state?.editing ? 'Edit Review' : 'Leave a Review'}
          </h1>
          <div className="flex items-center justify-center text-blue-200">
            <UserIcon />
            <span className="text-lg">
              for {booking?.caregiverName || booking?.providerName || 'Caregiver'}
            </span>
          </div>
        </div>

        {/* Review Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-300/60">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Information */}
            {booking && (
              <div className="bg-blue-50 p-4 rounded-xl mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Service Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Caregiver:</span>
                    <p className="font-medium">{booking.caregiverName || booking.providerName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Service Type:</span>
                    <p className="font-medium capitalize">{booking.serviceType?.toLowerCase()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <p className="font-medium">
                      {new Date(booking.startTime || booking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium">{booking.duration} hours</p>
                  </div>
                </div>
              </div>
            )}

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                How would you rate this service? *
              </label>
              <div className="flex justify-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="transform hover:scale-110 transition-transform focus:outline-none"
                  >
                    <StarIcon filled={star <= formData.rating} />
                  </button>
                ))}
              </div>
              <div className="text-center">
                <span className="text-lg font-semibold text-gray-700">
                  {formData.rating}.0 out of 5
                </span>
                <div className="flex justify-center space-x-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon 
                      key={star} 
                      filled={star <= formData.rating} 
                      size="w-4 h-4" 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share your experience *
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Tell us about your experience with this caregiver. What did you like? Was there anything that could be improved?"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Your detailed feedback helps caregivers improve their services.
              </p>
            </div>

            {/* Recommend */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                name="recommend"
                checked={formData.recommend}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                I would recommend this caregiver to others
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-900 text-white py-3 rounded-full font-semibold hover:bg-blue-800 transition-colors"
              >
                {location.state?.editing ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-blue-600/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-blue-700/10 rounded-full blur-lg animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-gray-400/10 rounded-full blur-md animate-pulse delay-500"></div>
    </div>
  );
};

export default ReviewForm;