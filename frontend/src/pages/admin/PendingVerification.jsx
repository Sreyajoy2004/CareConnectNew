// src/pages/admin/PendingVerification.jsx
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAppContext } from '../../context/AppContext';

const PendingVerification = () => {
  const { user } = useAppContext();
  const [pendingCaregivers, setPendingCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get demo pending caregivers
  const getDemoPendingCaregivers = () => {
    const storedCaregivers = JSON.parse(localStorage.getItem('caregivers') || '[]');
    return storedCaregivers.filter(cg => cg.status === 'pending');
  };

  useEffect(() => {
    fetchPendingCaregivers();
  }, []);

  const fetchPendingCaregivers = async () => {
    try {
      setLoading(true);
      
      try {
        const response = await fetch('/api/admin/careproviders/unverified', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setPendingCaregivers(data);
        } else {
          throw new Error('API not available');
        }
      } catch (apiError) {
        setPendingCaregivers(getDemoPendingCaregivers());
      }
    } catch (err) {
      setError('Failed to load pending verifications');
      console.error('Error fetching pending caregivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifyCaregiver = async (caregiverId) => {
    try {
      try {
        const response = await fetch(`/api/caregivers/${caregiverId}/verify`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          fetchPendingCaregivers();
          return;
        }
      } catch (apiError) {
        console.log('API not available, using demo mode');
      }

      // Demo mode - update in localStorage
      const storedCaregivers = JSON.parse(localStorage.getItem('caregivers') || '[]');
      const updatedCaregivers = storedCaregivers.map(cg => 
        cg.id === caregiverId ? { ...cg, status: 'verified' } : cg
      );
      localStorage.setItem('caregivers', JSON.stringify(updatedCaregivers));
      setPendingCaregivers(updatedCaregivers.filter(cg => cg.status === 'pending'));
      
      alert('Caregiver verified successfully!');
    } catch (err) {
      setError('Failed to verify caregiver');
      console.error('Error verifying caregiver:', err);
    }
  };

  const rejectCaregiver = async (caregiverId) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      try {
        const response = await fetch(`/api/caregivers/${caregiverId}/reject`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reason })
        });
        
        if (response.ok) {
          fetchPendingCaregivers();
          return;
        }
      } catch (apiError) {
        console.log('API not available, using demo mode');
      }

      // Demo mode - remove from localStorage
      const storedCaregivers = JSON.parse(localStorage.getItem('caregivers') || '[]');
      const updatedCaregivers = storedCaregivers.filter(cg => cg.id !== caregiverId);
      localStorage.setItem('caregivers', JSON.stringify(updatedCaregivers));
      setPendingCaregivers(updatedCaregivers.filter(cg => cg.status === 'pending'));
      
      alert('Caregiver rejected successfully!');
    } catch (err) {
      setError('Failed to reject caregiver');
      console.error('Error rejecting caregiver:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading pending verifications...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Pending Verifications</h1>
            <p className="text-gray-600 mt-2">Review and verify caregiver applications</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Pending Caregivers */}
          <div className="space-y-6">
            {pendingCaregivers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending verifications</h3>
                <p className="text-gray-600">All caregiver applications have been processed.</p>
              </div>
            ) : (
              pendingCaregivers.map((caregiver) => (
                <div key={caregiver.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Caregiver Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {caregiver.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{caregiver.name}</h3>
                          <p className="text-gray-600">{caregiver.email}</p>
                          <p className="text-sm text-gray-500">Applied {new Date(caregiver.joined).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Experience</p>
                          <p className="font-medium">{caregiver.experience}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Hourly Rate</p>
                          <p className="font-medium">{caregiver.hourlyRate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Specialties</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {caregiver.specialties.map((specialty, index) => (
                              <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Qualifications</p>
                          <p className="font-medium">{caregiver.qualifications || 'Not specified'}</p>
                        </div>
                      </div>

                      {caregiver.bio && (
                        <div>
                          <p className="text-sm text-gray-500">Bio</p>
                          <p className="text-gray-700 mt-1">{caregiver.bio}</p>
                        </div>
                      )}
                    </div>

                    {/* Documents and Actions */}
                    <div className="lg:w-80 space-y-4">
                      {/* Documents Section */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-sm text-gray-700">CPR Certificate.pdf</span>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              View
                            </button>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-sm text-gray-700">First Aid Certificate.pdf</span>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              View
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <button
                          onClick={() => verifyCaregiver(caregiver.id)}
                          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                          Approve & Verify
                        </button>
                        <button
                          onClick={() => rejectCaregiver(caregiver.id)}
                          className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                          Reject Application
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="mt-6 text-sm text-gray-600">
            {pendingCaregivers.length} caregiver(s) awaiting verification
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingVerification;