// src/components/CaregiverCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const CaregiverCard = ({ caregiver }) => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  const handleViewProfile = () => {
    if (!user) {
      navigate('/register?role=careseeker');
      return;
    }
    
    // Only allow care seekers to view profiles
    if (user.role === 'careprovider') {
      alert('Care providers cannot view other caregiver profiles. Please use a care seeker account.');
      return;
    }
    
    // Navigate to read-only profile view for care seekers only
    navigate(`/careprovider/${caregiver.id}`);
  };

  const getInitials = (name) => {
    if (!name) return 'CP';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6 relative">
        {/* Profile Image */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white overflow-hidden">
            {caregiver.profileImage ? (
              <img 
                src={caregiver.profileImage} 
                alt={caregiver.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {getInitials(caregiver.name)}
              </div>
            )}
          </div>
          
          {/* Name and Verification */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-white font-bold text-lg truncate">{caregiver.name}</h3>
              {caregiver.verified && (
                <div className="flex items-center bg-green-500/20 backdrop-blur-sm rounded-full px-2 py-1">
                  <svg className="w-3 h-3 text-green-300 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-200 text-xs font-medium">Verified</span>
                </div>
              )}
            </div>
            <p className="text-blue-200 text-sm font-medium truncate">{caregiver.specialization || caregiver.mainSpecialty}</p>
            <p className="text-blue-300 text-xs mt-1">{caregiver.careType}</p>
          </div>
        </div>

        {/* Rating and Rate */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span className="text-white font-bold text-sm">{caregiver.rating || '4.8'}</span>
            </div>
            <span className="text-blue-300 text-sm">({caregiver.reviews || '42'} reviews)</span>
          </div>
          <div className="text-right">
            <span className="text-white font-bold text-xl">${caregiver.rate || caregiver.hourlyRate?.replace('$', '')?.replace('/hr', '') || '25'}</span>
            <span className="text-blue-300 text-sm">/hour</span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6">
        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Experience</p>
              <p className="text-gray-900 font-semibold text-sm">{caregiver.experience || '5 years'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Location</p>
              <p className="text-gray-900 font-semibold text-sm truncate">{caregiver.location || caregiver.address || 'Boston, MA'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Availability</p>
              <p className="text-gray-900 font-semibold text-sm">{caregiver.availability || 'Full-time'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Status</p>
              <p className="text-green-600 font-semibold text-sm">Available</p>
            </div>
          </div>
        </div>

        {/* Qualifications Preview */}
        {caregiver.qualifications && (
          <div className="mb-6">
            <p className="text-gray-600 text-xs mb-2">Qualifications</p>
            <p className="text-gray-900 text-sm line-clamp-2">{caregiver.qualifications}</p>
          </div>
        )}

        {/* Specialties */}
        {caregiver.specialties && caregiver.specialties.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600 text-xs mb-2">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {caregiver.specialties.slice(0, 3).map((specialty, index) => (
                <span 
                  key={index}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                >
                  {specialty}
                </span>
              ))}
              {caregiver.specialties.length > 3 && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                  +{caregiver.specialties.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button 
          onClick={handleViewProfile}
          disabled={user?.role === 'careprovider'}
          className={`
            w-full py-3 rounded-xl font-semibold text-white transition-all duration-200
            ${user?.role === 'careprovider' 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {user?.role === 'careprovider' ? 'Not Available' : 'View Full Profile'}
        </button>

        {/* Warning message for care providers */}
        {user?.role === 'careprovider' && (
          <p className="text-xs text-red-500 text-center mt-2">
            Care providers cannot view other profiles
          </p>
        )}
      </div>

      {/* Bottom Border Accent */}
      <div className="h-1 bg-gradient-to-r from-blue-900 to-blue-800"></div>
    </div>
  );
};

export default CaregiverCard;