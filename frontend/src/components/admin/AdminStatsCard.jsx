// src/components/admin/AdminStatsCard.jsx
import React from 'react';

const AdminStatsCard = ({ title, value, icon, color = 'blue', onClick }) => {
  const colorClasses = {
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    green: 'from-green-400 to-green-600',
    yellow: 'from-yellow-400 to-yellow-600',
    red: 'from-red-400 to-red-600'
  };

  const bgColorClasses = {
    blue: 'from-white to-blue-50 border-blue-100',
    purple: 'from-white to-purple-50 border-purple-100',
    green: 'from-white to-green-50 border-green-100',
    yellow: 'from-white to-yellow-50 border-yellow-100',
    red: 'from-white to-red-50 border-red-100'
  };

  const iconBgClasses = {
    blue: 'from-blue-100 to-blue-200 text-blue-600',
    purple: 'from-purple-100 to-purple-200 text-purple-600',
    green: 'from-green-100 to-green-200 text-green-600',
    yellow: 'from-yellow-100 to-yellow-200 text-yellow-600',
    red: 'from-red-100 to-red-200 text-red-600'
  };

  return (
    <div className="group relative" onClick={onClick}>
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorClasses[color]} rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300`}></div>
      <div 
        className={`relative bg-gradient-to-br ${bgColorClasses[color]} p-6 rounded-2xl shadow-sm border hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <div className={`w-12 h-12 bg-gradient-to-br ${iconBgClasses[color]} rounded-xl flex items-center justify-center shadow-inner`}>
            {icon}
          </div>
        </div>
        <p className="text-4xl font-bold text-gray-900 mt-3 bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
          {value}
        </p>
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className={`w-5 h-5 text-${color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsCard;