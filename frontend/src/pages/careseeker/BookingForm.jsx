// src/pages/careseeker/BookingForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import apiService from '../../services/api';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '2',
    address: '',
    specialInstructions: '',
    emergencyContact: ''
  });

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setLoading(true);
        
        // Try API call first
        try {
          const data = await apiService.getCaregiver(id);
          setProvider(data);
        } catch (apiError) {
          console.log('Backend unavailable, using demo mode');
          // Fallback to mock data
          const mockProvider = {
            id: id,
            name: 'Professional Caregiver',
            specialty: 'Care Services',
            hourlyRate: 25,
          };
          setProvider(mockProvider);
        }
      } catch (error) {
        console.error('Error fetching provider:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Try backend booking first
      const bookingData = {
        providerId: id,
        resourceId: id,
        bookingDate: new Date(`${formData.date}T${formData.time}`).toISOString()
      };

      const response = await apiService.createBooking(bookingData);
      
      if (response.bookingId) {
        // Also save to localStorage for demo consistency
        const newBooking = {
          id: response.bookingId,
          providerId: id,
          providerName: provider.name,
          clientId: user?.id,
          clientName: user?.name,
          clientEmail: user?.email,
          ...formData,
          totalAmount: provider.hourlyRate * parseInt(formData.duration),
          status: 'pending',
          bookingId: response.bookingId,
          bookingDate: new Date().toISOString(),
          startTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
          serviceType: provider.specialty,
          specialRequirements: formData.specialInstructions,
          canCancel: true,
          canReview: false
        };

        // Save to localStorage for real-time updates
        const existingBookings = JSON.parse(localStorage.getItem('careSeekerBookings') || '[]');
        existingBookings.push(newBooking);
        localStorage.setItem('careSeekerBookings', JSON.stringify(existingBookings));

        // Also update care provider bookings for synchronization
        const providerBookings = JSON.parse(localStorage.getItem('careProviderBookings') || '[]');
        providerBookings.push({
          ...newBooking,
          careSeekerName: user?.name,
          careSeekerId: user?.id,
          careSeekerEmail: user?.email
        });
        localStorage.setItem('careProviderBookings', JSON.stringify(providerBookings));

        window.dispatchEvent(new Event('storage'));
        alert('Booking request sent! The caregiver will confirm your appointment.');
        navigate('/careseeker/bookings');
      }
    } catch (error) {
      console.log('Backend booking failed, using demo mode');
      // Fallback to localStorage-only booking
      const newBooking = {
        id: Date.now().toString(),
        providerId: id,
        providerName: provider.name,
        clientId: user?.id,
        clientName: user?.name,
        clientEmail: user?.email,
        ...formData,
        totalAmount: provider.hourlyRate * parseInt(formData.duration),
        status: 'pending',
        bookingId: 'BK' + Date.now(),
        bookingDate: new Date().toISOString(),
        startTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
        serviceType: provider.specialty,
        specialRequirements: formData.specialInstructions,
        canCancel: true,
        canReview: false
      };

      // Save to localStorage for care seeker
      const existingBookings = JSON.parse(localStorage.getItem('careSeekerBookings') || '[]');
      existingBookings.push(newBooking);
      localStorage.setItem('careSeekerBookings', JSON.stringify(existingBookings));

      // Also update care provider bookings for synchronization
      const providerBookings = JSON.parse(localStorage.getItem('careProviderBookings') || '[]');
      providerBookings.push({
        ...newBooking,
        careSeekerName: user?.name,
        careSeekerId: user?.id,
        careSeekerEmail: user?.email
      });
      localStorage.setItem('careProviderBookings', JSON.stringify(providerBookings));

      window.dispatchEvent(new Event('storage'));
      alert('Booking request sent! The caregiver will confirm your appointment.');
      navigate('/careseeker/bookings');
    }
  };

  // SVG Icons (keep your existing icons)
  const CalendarIcon = () => (
    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const ClockIcon = () => (
    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const MapPinIcon = () => (
    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
          <h1 className="text-4xl font-bold text-white mb-2">Book Appointment</h1>
          <div className="flex items-center justify-center text-blue-200">
            <UserIcon />
            <span className="text-lg">with {provider?.name}</span>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-300/60">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ClockIcon />
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (hours)
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
                <option value="4">4 hours</option>
                <option value="6">6 hours</option>
                <option value="8">8 hours</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPinIcon />
                Service Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Enter the complete address where care will be provided"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                rows={3}
                placeholder="Any special requirements or instructions for the caregiver"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                required
                placeholder="Emergency contact number"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
            </div>

            {/* Cost Summary */}
            <div className="bg-blue-50 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-700 mb-2">Cost Summary</h3>
              <div className="flex justify-between text-lg">
                <span>{formData.duration} hours × ${provider?.hourlyRate}/hour</span>
                <span className="font-bold text-blue-900">
                  ${provider ? provider.hourlyRate * parseInt(formData.duration) : 0}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-900 text-white py-3 rounded-full font-semibold hover:bg-blue-800 transition-colors"
              >
                Request Booking
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

export default BookingForm;