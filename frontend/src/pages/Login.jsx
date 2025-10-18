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

  // Demo accounts for testing
  const demoAccounts = [
    { email: 'provider@careconnect.com', password: 'password', role: 'Care Provider' },
    { email: 'seeker@careconnect.com', password: 'password', role: 'Care Seeker' },
    { email: 'admin@careconnect.com', password: 'admin123', role: 'Admin' }
  ];

  const fillDemoAccount = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your CareConnect account</p>
        </div>

        {/* Demo Accounts */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3 text-center">Demo Accounts:</p>
          <div className="grid grid-cols-1 gap-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => fillDemoAccount(account)}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-colors text-left"
              >
                <span className="font-medium">{account.role}:</span> {account.email}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Backend Status */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            <span className="font-medium">Backend Integration:</span> Automatic fallback to demo mode if backend unavailable
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;