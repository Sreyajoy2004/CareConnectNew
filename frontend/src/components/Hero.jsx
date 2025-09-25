// src/components/Hero.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const Hero = () => {
  const navigate = useNavigate();
  const { user, role } = useAppContext(); // Added role

  const handleFindCaregivers = () => {
    if (user) {
      // Check user role for proper redirection
      if (role === 'careseeker' || role === 'admin') {
        navigate('/caregivers');
      } else if (role === 'careprovider') {
        // Caregivers shouldn't search for caregivers - redirect to their dashboard
        navigate('/careprovider/dashboard');
      }
    } else {
      // Not logged in - go to login page instead of register
      navigate('/login', { state: { from: '/caregivers' } });
    }
  };

  const handleBecomeCaregiver = () => {
    if (user) {
      // Check user role for proper redirection
      if (role === 'careprovider') {
        navigate('/careprovider/dashboard');
      } else if (role === 'careseeker') {
        // If careseeker wants to become caregiver, guide to registration
        navigate('/register', { state: { switchTo: 'careprovider' } });
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      }
    } else {
      // Not logged in - go to login page instead of register
      navigate('/login', { state: { from: '/careprovider/dashboard' } });
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-950 to-purple-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/10 to-transparent animate-pulse"></div>
      
      {/* Geometric Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #ffffff 1%, transparent 15%),
                           radial-gradient(circle at 80% 20%, #ffffff 1%, transparent 15%)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="container mx-auto px-6 py-20 flex items-center justify-center min-h-screen relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl w-full">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              Find Trusted Care 
              <span className="block text-blue-200 mt-4">For Your Loved Ones</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-2xl leading-relaxed font-light">
              Connect with verified caregivers for childcare and elderly care services. 
              Safe, reliable, and personalized care solutions for your family.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center mb-16">
              <button 
                onClick={handleFindCaregivers}
                className="bg-white text-blue-900 hover:bg-blue-50 px-12 py-5 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl border-2 border-white"
              >
                Find Caregivers
              </button>
              <button 
                onClick={handleBecomeCaregiver}
                className="border-2 border-white/50 text-white hover:bg-white hover:text-blue-900 px-12 py-5 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                Become a Caregiver
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl">
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <div className="bg-green-500/20 rounded-2xl p-3">
                  <span className="text-green-400 text-xl">✓</span>
                </div>
                <div>
                  <div className="text-blue-200 font-semibold">Verified Caregivers</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <div className="bg-green-500/20 rounded-2xl p-3">
                  <span className="text-green-400 text-xl">✓</span>
                </div>
                <div>
                  <div className="text-blue-200 font-semibold">Background Checked</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <div className="bg-green-500/20 rounded-2xl p-3">
                  <span className="text-green-400 text-xl">✓</span>
                </div>
                <div>
                  <div className="text-blue-200 font-semibold">24/7 Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Banner Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img 
                src={assets.banner1} 
                alt="Happy family with caregiver" 
                className="rounded-3xl shadow-2xl max-w-full h-auto max-h-96 lg:max-h-[500px] object-cover border-4 border-white/20"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-4 bg-white rounded-full mt-3"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;