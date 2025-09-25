// src/components/CaregiverCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const CaregiverCard = ({ caregiver }) => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [isHovered, setIsHovered] = useState(false);

  const handleViewProfile = () => {
    if (!user) {
      navigate('/register?role=careseeker');
      return;
    }
    navigate(`/caregiver/${caregiver.id}`);
  };

  // Gradient based on care type
  const getGradient = () => {
    if (caregiver.careType === 'Childcare') {
      return 'from-blue-950 via-blue-800 to-purple-500';
    } else {
      return 'from-purple-700 via-purple-800 to-blue-950';
    }
  };

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div className={`
        relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100
        transform transition-all duration-500 ease-out
        ${isHovered ? 'scale-105 shadow-2xl' : 'scale-100'}
      `}>
        
        {/* Gradient Overlay */}
        <div className={`
          absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-0 
          transition-opacity duration-500
          ${isHovered ? 'opacity-5' : ''}
        `}></div>

        {/* Header with Gradient Background */}
        <div className={`
          relative h-40 bg-gradient-to-r ${getGradient()} overflow-hidden
        `}>
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #ffffff 2%, transparent 20%),
                               radial-gradient(circle at 75% 75%, #ffffff 2%, transparent 20%)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          {/* Profile Image */}
          <div className="absolute -bottom-6 left-6">
            <div className={`
              relative w-20 h-20 rounded-2xl border-4 border-white shadow-lg
              transform transition-transform duration-300
              ${isHovered ? 'scale-110 rotate-2' : ''}
            `}>
              <img 
                src={caregiver.image} 
                alt={caregiver.name}
                className="w-full h-full rounded-2xl object-cover"
              />
              {/* Online Status Dot */}
              <div className="absolute -top-1 -right-1">
                <div className="relative">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          {caregiver.verified && (
            <div className="absolute top-4 right-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                <span className="text-white text-sm">✓ Verified</span>
              </div>
            </div>
          )}

          {/* Care Type Badge */}
          <div className="absolute bottom-4 right-4">
            <span className={`
              px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm
              ${caregiver.careType === 'Childcare' 
                ? 'bg-blue-500/20 text-blue-100' 
                : 'bg-purple-500/20 text-purple-100'
              }
            `}>
              {caregiver.careType}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="pt-10 pb-6 px-6 relative z-10">
          {/* Name and Specialization */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
              {caregiver.name}
            </h3>
            <p className="text-blue-600 font-medium text-sm">
              {caregiver.specialization}
            </p>
          </div>

          {/* Rating and Price Row */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-lg">⭐</span>
                <span className="font-bold text-gray-900">{caregiver.rating}</span>
              </div>
              <span className="text-gray-500 text-sm">({caregiver.reviews} reviews)</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">${caregiver.rate}</span>
              <span className="text-gray-500 text-sm">/hour</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm">⏱️</span>
              </div>
              <span className="text-gray-700 text-sm">{caregiver.experience}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-sm">📍</span>
              </div>
              <span className="text-gray-700 text-sm truncate">{caregiver.location}</span>
            </div>
          </div>

          {/* Availability */}
          <div className="mb-6">
            <span className={`
              inline-block px-3 py-1 rounded-full text-sm font-medium
              ${caregiver.availability === 'Full-time' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
              }
            `}>
              {caregiver.availability}
            </span>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleViewProfile}
            className={`
              w-full py-3 rounded-xl font-semibold transition-all duration-300
              relative overflow-hidden group
              bg-gradient-to-r ${getGradient()} text-white
              transform hover:scale-105 hover:shadow-lg
              before:absolute before:inset-0 before:bg-white/10 before:translate-x-[-100%] 
              before:hover:translate-x-[100%] before:transition-transform before:duration-300
            `}
          >
            <span className="relative z-10">View Profile</span>
          </button>
        </div>

        {/* Hover Effect Border */}
        <div className={`
          absolute inset-0 rounded-2xl border-2 border-transparent 
          bg-gradient-to-r ${getGradient()} bg-clip-padding
          opacity-0 transition-opacity duration-300
          ${isHovered ? 'opacity-100' : ''}
          -m-0.5
        `}></div>
      </div>

      {/* Floating Shadow Effect */}
      <div className={`
        absolute inset-0 bg-gradient-to-r ${getGradient()} rounded-2xl blur-lg
        opacity-0 transition-all duration-500 -z-10
        ${isHovered ? 'opacity-20 translate-y-4' : 'opacity-0 translate-y-0'}
      `}></div>
    </div>
  );
};

export default CaregiverCard;