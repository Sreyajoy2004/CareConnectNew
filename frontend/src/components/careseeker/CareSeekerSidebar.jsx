import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const CareSeekerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const menuItems = [
    {
      path: '/careseeker/dashboard',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: 'Dashboard'
    },
    {
      path: '/search',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      label: 'Find Caregivers'
    },
    {
      path: '/careseeker/bookings',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: 'My Bookings'
    },
    {
      path: '/careseeker/reviews',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      label: 'My Reviews'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className={`
        lg:hidden fixed top-0 left-0 right-0 z-50
        bg-white backdrop-blur-lg bg-white/95
        border-b border-gray-200
        transition-all duration-300
        ${isScrolled ? 'shadow-lg' : 'shadow-sm'}
      `}>
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 animate-fadeIn"></div>
        </div>
      )}

      {/* Sidebar with Green Theme for Care Seeker */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-80 bg-green-900 min-h-screen flex flex-col
        transform transition-all duration-300 ease-out
        shadow-2xl lg:shadow-none
        border-r border-green-700
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Mobile Header */}
        <div className="lg:hidden p-6 border-b border-green-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-white font-semibold">{user?.name || 'User'}</h3>
              <p className="text-green-200 text-sm">Care Seeker</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-green-200 hover:text-white hover:bg-green-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Desktop User Info */}
        <div className="hidden lg:block p-6 border-b border-green-700">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-green-300/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate">{user?.name || 'User'}</h3>
              <p className="text-green-200 text-sm truncate">Care Seeker</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all duration-200 overflow-hidden
                ${isActive(item.path)
                  ? 'bg-green-700 text-white shadow-md border border-green-600'
                  : 'text-green-100 hover:bg-green-800 hover:text-white'
                }`}
            >
              {isActive(item.path) && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
              
              <div className={`relative p-2 rounded-xl transition-all duration-200
                ${isActive(item.path) 
                  ? 'bg-white text-green-600 shadow-md' 
                  : 'bg-green-800 text-green-200 group-hover:bg-green-700 group-hover:text-white'
                }`}>
                {item.icon}
              </div>
              
              <span className="font-medium flex-1">{item.label}</span>
              
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-green-700">
          <button 
            onClick={handleLogout}
            className="group relative flex items-center space-x-4 px-4 py-3 rounded-2xl text-green-200 hover:bg-red-500/10 hover:text-red-100 w-full transition-all duration-200 overflow-hidden"
          >
            <div className="relative p-2 rounded-xl bg-green-800 text-green-200 group-hover:bg-red-500/20 group-hover:text-red-100 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="font-medium">Logout</span>
            
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>
        </div>

        {/* Version Info */}
        <div className="p-4 border-t border-green-700">
          <div className="text-center">
            <p className="text-green-200/50 text-xs">CareConnect v1.0</p>
          </div>
        </div>
      </div>

      {/* Mobile Spacer */}
      <div className="lg:hidden h-16"></div>
    </>
  );
};

export default CareSeekerSidebar;