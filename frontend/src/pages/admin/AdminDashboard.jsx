// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar'; // Fixed import path
import AdminStatsCard from '../../components/admin/AdminStatsCard'; // Fixed import path
import { useAppContext } from '../../context/AppContext';

const AdminDashboard = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    totalBookings: 0,
    activeProviders: 0,
    flaggedAccounts: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get demo admin data
  const getDemoDashboardData = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const storedBookings = JSON.parse(localStorage.getItem('careSeekerBookings') || '[]');
    const storedCaregivers = JSON.parse(localStorage.getItem('caregivers') || '[]');

    const totalUsers = storedUsers.length || 1248;
    const pendingVerifications = storedCaregivers.filter(cg => cg.status === 'pending').length || 23;
    const totalBookings = storedBookings.length || 892;
    const activeProviders = storedCaregivers.filter(cg => cg.status === 'verified').length || 156;
    const flaggedAccounts = storedUsers.filter(u => u.flagged).length || 12;

    // Demo recent activity
    const demoRecentActivity = [
      { id: 1, type: 'user_registered', message: 'New user John registered', timestamp: new Date(Date.now() - 10 * 60 * 1000) },
      { id: 2, type: 'caregiver_verified', message: 'Provider Sarah Johnson verified', timestamp: new Date(Date.now() - 25 * 60 * 1000) },
      { id: 3, type: 'booking_completed', message: 'Booking #001 completed', timestamp: new Date(Date.now() - 45 * 60 * 1000) },
      { id: 4, type: 'user_suspended', message: 'User Mike suspended', timestamp: new Date(Date.now() - 60 * 60 * 1000) }
    ];

    // Demo pending actions
    const demoPendingActions = [
      { id: 1, type: 'verification', count: 5, label: 'caregivers need verification' },
      { id: 2, type: 'flagged', count: 3, label: 'flagged accounts need review' },
      { id: 3, type: 'support', count: 2, label: 'support tickets pending' }
    ];

    return {
      stats: {
        totalUsers,
        pendingVerifications,
        totalBookings,
        activeProviders,
        flaggedAccounts
      },
      recentActivity: demoRecentActivity,
      pendingActions: demoPendingActions
    };
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data.stats);
          setRecentActivity(data.recentActivity || []);
          setPendingActions(data.pendingActions || []);
        } else {
          throw new Error('API not available');
        }
      } catch (apiError) {
        // Fallback to demo data
        const demoData = getDemoDashboardData();
        setDashboardData(demoData.stats);
        setRecentActivity(demoData.recentActivity);
        setPendingActions(demoData.pendingActions);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-60 to-blue-100">
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-6 lg:p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'Admin'}! 👋
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
              <span>Admin Demo Mode: Platform overview with sample data.</span>
            </div>
          </div>
          
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <AdminStatsCard 
              title="Total Users"
              value={dashboardData.totalUsers}
              icon={(
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              )}
              color="purple"
              onClick={() => navigate('/admin/users')}
            />
            
            <AdminStatsCard 
              title="Pending Verifications"
              value={dashboardData.pendingVerifications}
              icon={(
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              color="yellow"
              onClick={() => navigate('/admin/caregivers/unverified')}
            />

            <AdminStatsCard 
              title="Total Bookings"
              value={dashboardData.totalBookings}
              icon={(
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              color="blue"
              onClick={() => navigate('/admin/bookings')}
            />

            <AdminStatsCard 
              title="Active Providers"
              value={dashboardData.activeProviders}
              icon={(
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
              color="green"
              onClick={() => navigate('/admin/caregivers')}
            />

            <AdminStatsCard 
              title="Flagged Accounts"
              value={dashboardData.flaggedAccounts}
              icon={(
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              )}
              color="red"
              onClick={() => navigate('/admin/users?filter=flagged')}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <button 
              onClick={() => navigate('/admin/users')}
              className="bg-blue-900 text-white p-4 rounded-xl hover:bg-blue-950 transition-colors text-center"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span>Manage Users</span>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/admin/caregivers/unverified')}
              className="bg-blue-900 text-white p-4 rounded-xl hover:bg-blue-950 transition-colors text-center"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Verify Caregivers</span>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/admin/bookings')}
              className="bg-blue-900 text-white p-4 rounded-xl hover:bg-blue-950 transition-colors text-center"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>View Bookings</span>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/admin/reports')}
              className="bg-blue-900 text-white p-4 rounded-xl hover:bg-blue-950 transition-colors text-center"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>View Reports</span>
              </div>
            </button>
          </div>

          {/* Activity and Pending Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-[#1F6FA3] rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-gray-800">{activity.message}</p>
                      <p className="text-gray-500 text-sm">{formatTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Actions</h2>
              <div className="space-y-4">
                {pendingActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div>
                      <p className="font-medium text-gray-800">
                        <span className="text-[#1F6FA3] font-bold">{action.count}</span> {action.label}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        if (action.type === 'verification') navigate('/admin/caregivers/unverified');
                        else if (action.type === 'flagged') navigate('/admin/users?filter=flagged');
                        else navigate('/admin/dashboard');
                      }}
                      className="bg-[#1F6FA3] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#1A5A8A] transition-colors"
                    >
                      Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;