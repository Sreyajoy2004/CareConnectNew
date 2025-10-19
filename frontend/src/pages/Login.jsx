// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Use frontendRole for routing if available
      const roleToUse = user.frontendRole || user.role;
      
      if (roleToUse === 'careprovider' || user.role === 'provider') {
        navigate('/careprovider/dashboard', { replace: true });
      } else if (roleToUse === 'careseeker' || user.role === 'seeker') {
        navigate('/careseeker/dashboard', { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, navigate, from]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          
          // Enhanced role-based routing with backend support
          const roleToUse = userData.frontendRole || userData.role;
          
          console.log('Login successful, redirecting:', { 
            role: userData.role, 
            frontendRole: userData.frontendRole,
            roleToUse 
          });

          if (roleToUse === 'careprovider' || userData.role === 'provider') {
            navigate('/careprovider/dashboard', { replace: true });
          } else if (roleToUse === 'careseeker' || userData.role === 'seeker') {
            navigate('/careseeker/dashboard', { replace: true });
          } else if (userData.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate(from, { replace: true });
          }
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-800/10 to-transparent animate-pulse"></div>
      
      <form onSubmit={handleSubmit} className="max-w-md w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white relative z-10 shadow-2xl">
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Login</h1>
        <p className="text-gray-500 text-sm mt-2">Please sign in to continue</p>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-full text-sm">
            {error}
          </div>
        )}

        {/* Email Field */}
        <div className="flex items-center w-full mt-6 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
          <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280"/>
          </svg>
          <input 
            name="email"
            type="email" 
            placeholder="Email id" 
            value={formData.email}
            onChange={handleChange}
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full" 
            required 
          />                 
        </div>
    
        {/* Password Field */}
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
          <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280"/>
          </svg>
          <input 
            name="password"
            type="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange}
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full" 
            required 
          />                 
        </div>
        
        <div className="mt-5 text-left text-blue-600">
          <Link to="/forgot-password" className="text-sm hover:text-blue-700 transition-colors">Forgot password?</Link>
        </div>
    
        <button 
          type="submit" 
          disabled={isLoading}
          className="mt-2 w-full h-11 rounded-full text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isLoading ? 'Signing in...' : 'Login'}
        </button>
        
        <p className="text-gray-500 text-sm mt-3 mb-11">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">Sign up</Link>
        </p>
      </form>

      {/* Floating Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-blue-600/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-blue-700/10 rounded-full blur-lg animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-gray-400/10 rounded-full blur-md animate-pulse delay-500"></div>
    </div>
  );
};

export default Login;