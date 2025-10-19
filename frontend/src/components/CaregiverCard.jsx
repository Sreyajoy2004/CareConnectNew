// src/components/CaregiverCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CaregiverCard = ({ caregiver }) => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  const handleViewProfile = () => {
    if (!user) {
      navigate('/register?role=careseeker');
      return;
    }
    if (user.role === 'careprovider') {
      alert('Care providers cannot view other caregiver profiles.');
      return;
    }
    navigate(`/caregivers/${caregiver.id}`);
  };

  const getInitials = (name) => {
    if (!name) return 'CG';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
            {caregiver.image ? (
              <img src={caregiver.image} alt={caregiver.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {getInitials(caregiver.name)}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">{caregiver.name}</h3>
            <p className="text-blue-200 text-sm">{caregiver.specialization || 'General Care'}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-white font-semibold text-sm">
            {caregiver.experience_years ? `${caregiver.experience_years} yrs` : '5 yrs'}
          </div>
          <div className="text-white font-bold text-lg">${caregiver.hourly_rate || 25}/hr</div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{caregiver.description}</p>
        <button
          onClick={handleViewProfile}
          disabled={user?.role === 'careprovider'}
          className={`w-full py-3 rounded-xl font-semibold text-white ${
            user?.role === 'careprovider'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700'
          }`}
        >
          {user?.role === 'careprovider' ? 'Not Available' : 'View Full Profile'}
        </button>
      </div>
    </div>
  );
};

export default CaregiverCard;
