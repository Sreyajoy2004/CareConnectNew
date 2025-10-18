// src/pages/CareSeekerDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CareSeekerSidebar from "../components/careseeker/CareSeekerSidebar";
import { useAppContext } from "../context/AppContext";
import CaregiverCard from "../components/CaregiverCard";
import { assets } from "../assets/assets";
import apiService from "../services/api"; // FIXED IMPORT PATH

const CareSeekerDashboard = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [recommendedCaregivers, setRecommendedCaregivers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Try to get caregivers from backend
      try {
        const caregivers = await apiService.getCaregivers();
        setRecommendedCaregivers(caregivers.slice(0, 3)); // Show first 3
      } catch (apiError) {
        console.log('Backend unavailable, using demo data');
        // Fallback to demo data
        setRecommendedCaregivers([
          {
            id: 1,
            name: "Maria Garcia",
            specialty: "Elderly Care & Child Care",
            rating: 4.8,
            reviews: 47,
            hourlyRate: "$25/hr",
            experience: "5 years",
            image: assets.caregiver1
          },
          {
            id: 2,
            name: "John Smith",
            specialty: "Special Needs Care",
            rating: 4.9,
            reviews: 32,
            hourlyRate: "$30/hr",
            experience: "7 years",
            image: assets.caregiver2
          },
          {
            id: 3,
            name: "Sarah Johnson",
            specialty: "Post-Surgery Care",
            rating: 4.7,
            reviews: 28,
            hourlyRate: "$28/hr",
            experience: "4 years",
            image: assets.caregiver3
          }
        ]);
      }

      // Try to get recent bookings
      try {
        const bookings = await apiService.getMyBookings();
        setRecentBookings(bookings.slice(0, 3)); // Show first 3
      } catch (apiError) {
        // Fallback to demo bookings
        setRecentBookings([
          {
            id: 1,
            caregiverName: "Maria Garcia",
            serviceType: "Elderly Care",
            date: "2024-01-15",
            status: "confirmed",
            amount: 100
          },
          {
            id: 2,
            caregiverName: "John Smith",
            serviceType: "Special Needs",
            date: "2024-01-10",
            status: "completed",
            amount: 120
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookCaregiver = (caregiverId) => {
    navigate(`/booking/${caregiverId}`);
  };

  const handleViewAllCaregivers = () => {
    navigate('/search');
  };

  const handleViewBookingDetails = (bookingId) => {
    navigate('/careseeker/bookings');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex">
          <CareSeekerSidebar />
          <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || 'Care Seeker'}!
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening with your care services today.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Upcoming Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed Services</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Caregivers Rated</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Caregivers */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recommended Caregivers</h2>
              <button 
                onClick={handleViewAllCaregivers}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedCaregivers.map((caregiver) => (
                <CaregiverCard
                  key={caregiver.id}
                  caregiver={caregiver}
                  onBook={() => handleBookCaregiver(caregiver.id)}
                />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.caregiverName}</h3>
                      <p className="text-sm text-gray-600">{booking.serviceType} • {booking.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                    <button 
                      onClick={() => handleViewBookingDetails(booking.id)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareSeekerDashboard;