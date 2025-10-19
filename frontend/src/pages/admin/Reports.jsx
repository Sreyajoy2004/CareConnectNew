// src/pages/admin/Reports.jsx
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAppContext } from '../../context/AppContext';

const Reports = () => {
  const { user } = useAppContext();
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get demo reports data
  const getDemoReports = () => {
    return {
      platformStats: {
        totalUsers: 1248,
        activeProviders: 156,
        totalBookings: 892,
        completedBookings: 645,
        cancellationRate: 8.5,
        averageRating: 4.6
      },
      userGrowth: [
        { month: 'Jan', users: 1200, growth: 0 },
        { month: 'Feb', users: 1250, growth: 4.2 },
        { month: 'Mar', users: 1300, growth: 4.0 },
        { month: 'Apr', users: 1350, growth: 3.8 },
        { month: 'May', users: 1420, growth: 5.2 },
        { month: 'Jun', users: 1480, growth: 4.2 }
      ],
      bookingTrends: [
        { service: 'Child Care', bookings: 320, percentage: 36 },
        { service: 'Elderly Care', bookings: 280, percentage: 31 },
        { service: 'Special Needs', bookings: 180, percentage: 20 },
        { service: 'Respite Care', bookings: 112, percentage: 13 }
      ],
      providerPerformance: [
        { name: 'Sarah Johnson', rating: 4.8, completed: 45, response: 98 },
        { name: 'Lisa Chen', rating: 4.9, completed: 67, response: 99 },
        { name: 'Mike Brown', rating: 4.5, completed: 32, response: 95 },
        { name: 'Emily Davis', rating: 4.7, completed: 38, response: 96 }
      ]
    };
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      try {
        const response = await fetch('/api/admin/reports', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        } else {
          throw new Error('API not available');
        }
      } catch (apiError) {
        setReports(getDemoReports());
      }
    } catch (err) {
      setError('Failed to load reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportData = (type) => {
    alert(`Exporting ${type} data...`);
    // In a real app, this would trigger a download
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading reports...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-60 to-blue-100">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 mt-2">Platform performance and insights</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => exportData('users')}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Export User Data
              </button>
              <button 
                onClick={() => exportData('bookings')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Export Booking Data
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 text-center">
              <p className="text-2xl font-bold text-gray-900">{reports.platformStats?.totalUsers}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 text-center">
              <p className="text-2xl font-bold text-gray-900">{reports.platformStats?.activeProviders}</p>
              <p className="text-sm text-gray-600">Active Providers</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 text-center">
              <p className="text-2xl font-bold text-gray-900">{reports.platformStats?.totalBookings}</p>
              <p className="text-sm text-gray-600">Total Bookings</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 text-center">
              <p className="text-2xl font-bold text-gray-900">{reports.platformStats?.completedBookings}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 text-center">
              <p className="text-2xl font-bold text-gray-900">{reports.platformStats?.cancellationRate}%</p>
              <p className="text-sm text-gray-600">Cancellation Rate</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 text-center">
              <p className="text-2xl font-bold text-gray-900">{reports.platformStats?.averageRating}</p>
              <p className="text-sm text-gray-600">Avg Rating</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">User Growth</h3>
              <div className="space-y-3">
                {reports.userGrowth?.map((month, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{month.month}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{month.users} users</span>
                      <span className={`text-sm font-medium ${month.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {month.growth >= 0 ? '+' : ''}{month.growth}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Service Distribution</h3>
              <div className="space-y-4">
                {reports.bookingTrends?.map((service, index) => (
                  service.service !== 'Special Needs' && service.service !== 'Respite Care' && (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{service.service}</span>
                        <span className="text-gray-600">{service.bookings} bookings ({service.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${service.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Top Providers */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Top Performing Providers</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Provider</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Rating</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Completed</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Response Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reports.providerPerformance?.map((provider, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{provider.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <span className="mr-1">{provider.rating}</span>
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{provider.completed}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{provider.response}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Additional Reports */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="font-medium text-gray-900">Generate Monthly Report</span>
                  <p className="text-sm text-gray-600">Create comprehensive platform report</p>
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="font-medium text-gray-900">User Activity Analysis</span>
                  <p className="text-sm text-gray-600">Detailed user engagement metrics</p>
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="font-medium text-gray-900">Provider Performance</span>
                  <p className="text-sm text-gray-600">Caregiver quality and reliability</p>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">System Health</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Platform Uptime</span>
                  <span className="text-sm text-green-600 font-medium">99.9%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Active Sessions</span>
                  <span className="text-sm text-gray-600">247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">API Response Time</span>
                  <span className="text-sm text-gray-600">128ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Database Status</span>
                  <span className="text-sm text-green-600 font-medium">Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;