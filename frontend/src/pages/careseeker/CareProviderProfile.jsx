// src/pages/careseeker/CareProviderProfileRead.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const CareProviderProfileRead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    time: '',
    duration: '2',
    notes: '',
    serviceType: 'childcare'
  });

  // Fetch caregiver profile data
  useEffect(() => {
    const fetchCaregiverProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/careproviders/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch caregiver profile');
        
        const data = await response.json();
        setCaregiver(data);
      } catch (err) {
        setError('Failed to load caregiver profile');
        console.error('Error fetching caregiver:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaregiverProfile();
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/careprovider/${id}` } });
      return;
    }
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          caregiverId: id,
          caregiverName: caregiver.name,
          clientId: user.id,
          clientName: user.name,
          clientEmail: user.email,
          serviceType: bookingDetails.serviceType,
          date: bookingDetails.date,
          time: bookingDetails.time,
          duration: parseInt(bookingDetails.duration),
          notes: bookingDetails.notes,
          status: 'pending',
          totalAmount: calculateTotalAmount(caregiver.hourlyRate, bookingDetails.duration)
        })
      });

      if (response.ok) {
        const bookingData = await response.json();
        alert('Booking request sent successfully! The caregiver will confirm soon.');
        setShowBookingModal(false);
        setBookingDetails({ 
          date: '', 
          time: '', 
          duration: '2', 
          notes: '',
          serviceType: 'childcare'
        });
        
        // Navigate to care seeker bookings page
        navigate('/careseeker/bookings');
      } else {
        throw new Error('Failed to create booking');
      }
    } catch (error) {
      alert('Error sending booking request. Please try again.');
      console.error('Booking error:', error);
    }
  };

  const calculateTotalAmount = (hourlyRate, duration) => {
    const rate = parseInt(hourlyRate.replace('$', '').replace('/hr', ''));
    return rate * parseInt(duration);
  };

  const getInitials = (name) => {
    if (!name) return 'CP';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading caregiver profile...</p>
        </div>
      </div>
    );
  }

  if (error || !caregiver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Error loading profile</div>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="p-6 lg:p-8">
        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Search
          </button>
          
          {user && user.role === 'careseeker' && (
            <button 
              onClick={handleBookNow}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Book Now
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border-2 border-blue-100">
              <div className="text-center">
                {/* Profile Image */}
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white overflow-hidden">
                    {caregiver.profileImage ? (
                      <img 
                        src={caregiver.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(caregiver.name)
                    )}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{caregiver.name}</h2>
                <p className="text-gray-600 mb-3">Professional Caregiver</p>
                
                {/* Verification Status */}
                <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verified Caregiver
                </div>
              </div>

              {/* Stats Section */}
              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Response Rate</p>
                      <p className="font-semibold text-gray-900">{caregiver.responseRate}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Completed Jobs</p>
                      <p className="font-semibold text-gray-900">{caregiver.completedJobs}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="font-semibold text-gray-900">{caregiver.rating} ⭐ ({caregiver.reviews} reviews)</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-semibold text-gray-900">{caregiver.memberSince}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Read-only Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.name}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.phone}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.hourlyRate}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.availability}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.experience}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Specialty</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.mainSpecialty}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.qualifications}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.address}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.bio}
                  </div>
                </div>
                
                {/* Specialties Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {caregiver.specialties.map((specialty, index) => (
                      <span key={index} className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certificates Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificates & Documents
                  </label>
                  <div className="space-y-2">
                    {caregiver.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-700">{cert}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Book Care Session with {caregiver.name}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <select 
                  value={bookingDetails.serviceType}
                  onChange={(e) => setBookingDetails({...bookingDetails, serviceType: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="childcare">Child Care</option>
                  <option value="elderlycare">Elderly Care</option>
                  <option value="specialneeds">Special Needs</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input 
                  type="date"
                  value={bookingDetails.date}
                  onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input 
                  type="time"
                  value={bookingDetails.time}
                  onChange={(e) => setBookingDetails({...bookingDetails, time: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                <select 
                  value={bookingDetails.duration}
                  onChange={(e) => setBookingDetails({...bookingDetails, duration: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                  <option value="6">6 hours</option>
                  <option value="8">8 hours</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Notes</label>
                <textarea 
                  value={bookingDetails.notes}
                  onChange={(e) => setBookingDetails({...bookingDetails, notes: e.target.value})}
                  rows="3"
                  placeholder="Any special requirements or notes..."
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                />
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  Estimated Cost: ${calculateTotalAmount(caregiver.hourlyRate, bookingDetails.duration)}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowBookingModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmBooking}
                disabled={!bookingDetails.date || !bookingDetails.time}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareProviderProfileRead;