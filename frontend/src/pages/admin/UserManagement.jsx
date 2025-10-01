// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAppContext } from '../../context/AppContext';

const UserManagement = () => {
  const { user } = useAppContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Get demo users data
  const getDemoUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (storedUsers.length === 0) {
      // Create demo users
      const demoUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@careconnect.com',
          role: 'seeker',
          status: 'active',
          joined: '2024-01-15',
          lastActive: '2024-01-28',
          bookings: 12,
          flagged: false
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah@careconnect.com',
          role: 'provider',
          status: 'pending',
          joined: '2024-01-16',
          lastActive: '2024-01-28',
          experience: '3 years',
          specialties: ['Child Care', 'Elderly Care'],
          flagged: false
        },
        {
          id: 3,
          name: 'Mike Brown',
          email: 'mike@careconnect.com',
          role: 'provider',
          status: 'verified',
          joined: '2024-01-14',
          lastActive: '2024-01-28',
          experience: '5 years',
          specialties: ['Special Needs'],
          bookings: 32,
          rating: 4.8,
          flagged: false
        },
        {
          id: 4,
          name: 'Admin User',
          email: 'admin@careconnect.com',
          role: 'admin',
          status: 'active',
          joined: '2024-01-10',
          lastActive: '2024-01-28',
          flagged: false
        },
        {
          id: 5,
          name: 'Lisa Wang',
          email: 'lisa@careconnect.com',
          role: 'seeker',
          status: 'active',
          joined: '2024-01-20',
          lastActive: '2024-01-27',
          bookings: 8,
          flagged: false
        },
        {
          id: 6,
          name: 'Robert Davis',
          email: 'robert@careconnect.com',
          role: 'provider',
          status: 'flagged',
          joined: '2024-01-18',
          lastActive: '2024-01-25',
          experience: '2 years',
          specialties: ['Child Care'],
          flagged: true,
          flagReason: 'Suspicious activity reported'
        }
      ];
      localStorage.setItem('users', JSON.stringify(demoUsers));
      return demoUsers;
    }
    return storedUsers;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      try {
        const response = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          throw new Error('API not available');
        }
      } catch (apiError) {
        setUsers(getDemoUsers());
      }
    } catch (err) {
      setError('Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          fetchUsers();
          return;
        }
      } catch (apiError) {
        console.log('API not available, using demo mode');
      }

      // Demo mode - remove from localStorage
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      alert('User deleted successfully!');
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const toggleFlagUser = async (userId) => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      const updatedFlagStatus = !userToUpdate.flagged;

      try {
        const response = await fetch(`/api/admin/users/${userId}/flag`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ flagged: updatedFlagStatus })
        });
        
        if (response.ok) {
          fetchUsers();
          return;
        }
      } catch (apiError) {
        console.log('API not available, using demo mode');
      }

      // Demo mode - update in localStorage
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, flagged: updatedFlagStatus } : u
      );
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      alert(`User ${updatedFlagStatus ? 'flagged' : 'unflagged'} successfully!`);
    } catch (err) {
      setError('Failed to update user flag status');
      console.error('Error flagging user:', err);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'provider': return 'bg-blue-100 text-blue-800';
      case 'seeker': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage all platform users and their accounts</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="p-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              >
                <option value="all">All Roles</option>
                <option value="seeker">Care Seekers</option>
                <option value="provider">Care Providers</option>
                <option value="admin">Admins</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No users found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(user.joined).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.lastActive).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleFlagUser(user.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                user.flagged 
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              {user.flagged ? 'Unflag' : 'Flag'}
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;