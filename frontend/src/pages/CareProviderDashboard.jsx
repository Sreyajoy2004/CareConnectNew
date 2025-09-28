// src/pages/CareProviderDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CareProviderSidebar from '../components/careprovider/CareProviderSidebar';
import { useAppContext } from '../context/AppContext';

const CareProviderDashboard = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState({
    upcomingBookings: 0,
    completedBookings: 0,
    averageRating: 0,
    totalReviews: 0,
    responseRate: 95,
    recentBookings: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get demo dashboard data
  const getDemoDashboardData = () => {
    const storedBookings = JSON.parse(localStorage.getItem('careProviderBookings') || '[]');
    const now = new Date();
    
    const upcomingBookings = storedBookings.filter(booking => 
      new Date(booking.startTime) > now && (booking.status === 'confirmed' || booking.status === 'pending')
    ).length;
    
    const completedBookings = storedBookings.filter(booking => 
      booking.status === 'completed'
    ).length;
    
    const recentBookings = storedBookings
      .slice(0, 5) // Get latest 5 bookings
      .map(booking => ({
        id: booking.id,
        clientName: booking.clientName,
        serviceType: booking.serviceType,
        startTime: booking.startTime,
        duration: booking.duration,
        totalAmount: booking.totalAmount,
        status: booking.status
      }));

    // Calculate average rating from completed bookings with ratings
    const ratedBookings = storedBookings.filter(booking => 
      booking.status === 'completed' && booking.rating
    );
    const averageRating = ratedBookings.length > 0 
      ? ratedBookings.reduce((sum, booking) => sum + booking.rating, 0) / ratedBookings.length
      : 4.8; // Default demo rating

    // Add static demo data if no stored bookings
    if (storedBookings.length === 0) {
      return {
        upcomingBookings: 1,
        completedBookings: 1,
        averageRating: 4.8,
        totalReviews: 1,
        responseRate: 95,
        recentBookings: [
          {
            id: 1,
            clientName: 'Emily Johnson',
            serviceType: 'Elderly Care',
            startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            duration: 4,
            totalAmount: 100,
            status: 'confirmed'
          }
        ]
      };
    }

    return {
      upcomingBookings,
      completedBookings,
      averageRating,
      totalReviews: ratedBookings.length,
      responseRate: 95,
      recentBookings
    };
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Listen for storage changes to update in real-time
    const handleStorageChange = () => {
      fetchDashboardData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(`/api/careprovider/${user?.id}/dashboard`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          throw new Error('API not available');
        }
      } catch (apiError) {
        // Fallback to demo data with localStorage integration
        setDashboardData(getDemoDashboardData());
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data periodically to catch new bookings
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex">
          <CareProviderSidebar />
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
        <CareProviderSidebar />
        
        <div className="flex-1 p-6 lg:p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'Care Provider'}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
              <button 
                onClick={fetchDashboardData}
                className="ml-4 text-red-700 underline hover:text-red-800"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Demo Mode Indicator */}
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Demo Mode: Real-time updates enabled. New bookings will appear automatically.</span>
            </div>
          </div>
          
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Upcoming Bookings Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div 
                className="relative bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => navigate('/careprovider/bookings?filter=upcoming')}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Upcoming Bookings</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-inner">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900 mt-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {dashboardData.upcomingBookings}
                </p>
                <p className="text-gray-500 text-sm mt-1">Scheduled appointments</p>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Rating Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div 
                className="relative bg-gradient-to-br from-white to-green-50 p-6 rounded-2xl shadow-sm border border-green-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => navigate('/careprovider/reviews')}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Customer Rating</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-inner">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline space-x-2 mt-3">
                  <p className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent">
                    {dashboardData.averageRating > 0 ? dashboardData.averageRating.toFixed(1) : '0.0'}
                  </p>
                  <span className="text-lg text-gray-400">/5</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  {dashboardData.totalReviews} review{dashboardData.totalReviews !== 1 ? 's' : ''}
                </p>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Bookings Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
              <button 
                onClick={() => navigate('/careprovider/bookings')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors flex items-center space-x-1 group"
              >
                <span>View All</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {dashboardData.recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recent bookings</h3>
                <p className="text-gray-600">Your upcoming bookings will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.recentBookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-white rounded-xl border border-gray-100 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] group"
                    onClick={() => navigate('/careprovider/bookings')}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-3 h-3 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-500' : 
                        booking.status === 'pending' ? 'bg-yellow-500' :
                        booking.status === 'completed' ? 'bg-blue-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {booking.clientName}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          {booking.serviceType?.toLowerCase()} • {new Date(booking.startTime).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">{booking.duration} hours • ${booking.totalAmount}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800 group-hover:bg-green-200' 
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200'
                          : booking.status === 'completed'
                          ? 'bg-blue-100 text-blue-800 group-hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-800 group-hover:bg-gray-200'
                      } transition-colors capitalize`}>
                        {booking.status}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/careprovider/bookings');
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareProviderDashboard;