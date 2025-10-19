// src/pages/careseeker/CareProviderProfileRead.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import apiService from '../../services/api';

const CareProviderProfileRead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Fetch caregiver profile from backend
  useEffect(() => {
    const fetchCaregiverProfile = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCaregiver(id);
        console.log('✅ Backend caregiver data:', response);

        if (!response) {
          setError('No caregiver found.');
          return;
        }

        const transformed = {
          id: response.id || response.caregiver_id,
          name: response.name,
          specialty: response.specialization || response.category || 'General Care',
          rating: 4.8,
          reviews: 47,
          hourlyRate: response.hourly_rate ? `$${response.hourly_rate}/hr` : '$25/hr',
          experience: response.experience_years ? `${response.experience_years} years` : '5 years',
          availability: response.availability || 'Full-time',
          bio: response.description || 'Dedicated caregiver providing quality care.',
          specialties: response.specialization ? [response.specialization] : ['General Care'],
          address: response.address || 'Not specified',
          phone: response.phone || 'Not provided',
          email: response.mail || 'Not provided',
          responseRate: 95,
          completedJobs: 47,
          memberSince: response.created_at
            ? new Date(response.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
            : 'Jan 2023',
          qualifications: response.description || 'Certified Caregiver',
          mainSpecialty: response.specialization || 'General Care',
          certifications: response.verification_doc_url ? [response.verification_doc_url] : [],
          isVerified: response.is_verified || false,
          profileImage: response.image || null,
        };

        setCaregiver(transformed);
      } catch (err) {
        console.error('❌ Error fetching caregiver:', err);
        setError('Failed to load caregiver profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchCaregiverProfile();
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/caregivers/${id}` } });
      return;
    }
    navigate(`/booking/${id}`);
  };

  const getInitials = (name) => {
    if (!name) return 'CG';
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
          <div className="text-red-500 text-lg mb-4">{error || 'Profile not found'}</div>
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
        {/* Header */}
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

          {user && (user.role === 'careseeker' || user.role === 'seeker') && (
            <button
              onClick={handleBookNow}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Book Now
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Left - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border-2 border-blue-100 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white overflow-hidden">
                {caregiver.profileImage ? (
                  <img src={caregiver.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  getInitials(caregiver.name)
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{caregiver.name}</h2>
              <p className="text-gray-600 mb-3">{caregiver.specialty}</p>
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  caregiver.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {caregiver.isVerified ? 'Verified Caregiver' : 'Pending Verification'}
              </div>

              <div className="mt-6 space-y-3">
                <p className="text-gray-700">
                  <strong>Experience:</strong> {caregiver.experience}
                </p>
                <p className="text-gray-700">
                  <strong>Rate:</strong> {caregiver.hourlyRate}
                </p>
                <p className="text-gray-700">
                  <strong>Availability:</strong> {caregiver.availability}
                </p>
                <p className="text-gray-700">
                  <strong>Member Since:</strong> {caregiver.memberSince}
                </p>
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Profile Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                  <div className="p-3 bg-gray-50 rounded-xl border">{caregiver.email}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Phone</label>
                  <div className="p-3 bg-gray-50 rounded-xl border">{caregiver.phone}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Address</label>
                  <div className="p-3 bg-gray-50 rounded-xl border">{caregiver.address}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Bio</label>
                  <div className="p-3 bg-gray-50 rounded-xl border">{caregiver.bio}</div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {caregiver.specialties.map((s, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium border border-blue-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Certificates</h4>
                {caregiver.certifications.length > 0 ? (
                  caregiver.certifications.map((cert, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border mb-2"
                    >
                      <span className="text-sm text-gray-700 truncate">{cert}</span>
                      <a
                        href={cert}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No certificates uploaded</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareProviderProfileRead;
