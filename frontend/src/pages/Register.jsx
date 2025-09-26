// src/pages/Register.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Register = () => {
  const [formData, setFormData] = useState({
    role: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    // CareSeeker specific fields
    address: '',
    emergencyContact: '',
    // CareProvider specific fields
    experience: '',
    qualifications: '',
    mainSpecialty: '',
    childcareSpecialties: [],
    elderlycareSpecialties: [],
    hourlyRate: '',
    availability: '',
    bio: '',
    certifications: []
  });

  const [showSpecialtiesDropdown, setShowSpecialtiesDropdown] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';
  const switchTo = location.state?.switchTo;

  // Create ref for the dropdown container
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSpecialtiesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.role || !formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.phone) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Role-specific validation
    if (formData.role === 'careseeker' && !formData.address) {
      setError('Please fill in your address');
      setLoading(false);
      return;
    }

    if (formData.role === 'careprovider') {
      if (!formData.experience || !formData.qualifications || !formData.hourlyRate || !formData.mainSpecialty) {
        setError('Please fill in all caregiver required fields');
        setLoading(false);
        return;
      }
    }

    try {
      const success = await register(formData);
      
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'childcareSpecialties') {
        const updatedSpecialties = checked 
          ? [...formData.childcareSpecialties, value]
          : formData.childcareSpecialties.filter(s => s !== value);
        setFormData({ ...formData, childcareSpecialties: updatedSpecialties });
      } else if (name === 'elderlycareSpecialties') {
        const updatedSpecialties = checked 
          ? [...formData.elderlycareSpecialties, value]
          : formData.elderlycareSpecialties.filter(s => s !== value);
        setFormData({ ...formData, elderlycareSpecialties: updatedSpecialties });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      certifications: [...formData.certifications, ...files]
    });
  };

  const removeFile = (indexToRemove) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleMainSpecialtyChange = (specialty) => {
    setFormData({ 
      ...formData, 
      mainSpecialty: specialty,
      childcareSpecialties: [],
      elderlycareSpecialties: []
    });
    setShowSpecialtiesDropdown(true);
  };

  const toggleSpecialtiesDropdown = () => {
    setShowSpecialtiesDropdown(!showSpecialtiesDropdown);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Set role from URL state if provided
  React.useEffect(() => {
    if (switchTo) {
      setFormData(prev => ({ ...prev, role: switchTo }));
    }
  }, [switchTo]);

  const childcareSpecialtiesOptions = [
    'Newborn Care',
    'Toddler Care',
    'School Age Children',
    'Homework Assistance',
    'Meal Preparation for Children',
    'Child Development Activities',
    'Special Needs Children'
  ];

  const elderlycareSpecialtiesOptions = [
    'Dementia Care',
    'Alzheimer Care',
    'Mobility Assistance',
    'Medication Management',
    'Personal Hygiene Care',
    'Meal Preparation for Seniors',
    'Companionship',
    'Post-Surgery Care'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-800/10 to-transparent animate-pulse"></div>
      
      <form onSubmit={handleSubmit} className="max-w-lg w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white relative z-10 shadow-2xl">
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Create Account</h1>
        <p className="text-gray-500 text-sm mt-2">Sign up to get started</p>
        
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-full text-sm">
            {error}
          </div>
        )}

        {/* Role Selection */}
        <div className="mt-6">
          <label className="block text-left text-sm font-medium text-gray-700 mb-2">I want to:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'careseeker' })}
              className={`p-3 border rounded-xl text-sm font-medium transition-all ${
                formData.role === 'careseeker' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              Find Caregivers
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'careprovider' })}
              className={`p-3 border rounded-xl text-sm font-medium transition-all ${
                formData.role === 'careprovider' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              Become a Caregiver
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <input 
              name="firstName"
              type="text" 
              placeholder="First Name" 
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300/80 h-12 rounded-full px-4 text-sm text-gray-500 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required 
            />
          </div>
          <div>
            <input 
              name="lastName"
              type="text" 
              placeholder="Last Name" 
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300/80 h-12 rounded-full px-4 text-sm text-gray-500 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required 
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="mt-4">
          <input 
            name="email"
            type="email" 
            placeholder="Email Address" 
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300/80 h-12 rounded-full px-4 text-sm text-gray-500 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            required 
          />
        </div>

        {/* Phone Field */}
        <div className="mt-4">
          <input 
            name="phone"
            type="tel" 
            placeholder="Phone Number" 
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300/80 h-12 rounded-full px-4 text-sm text-gray-500 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            required 
          />
        </div>

        {/* Password Fields */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <input 
              name="password"
              type="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300/80 h-12 rounded-full px-4 text-sm text-gray-500 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required 
            />
          </div>
          <div>
            <input 
              name="confirmPassword"
              type="password" 
              placeholder="Confirm Password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300/80 h-12 rounded-full px-4 text-sm text-gray-500 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required 
            />
          </div>
        </div>

        {/* CareSeeker Specific Fields */}
        {formData.role === 'careseeker' && (
          <div className="mt-4 space-y-4">
            <input 
              name="address"
              type="text" 
              placeholder="Full Address" 
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300/80 h-12 rounded-full px-4 text-sm text-gray-500 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            <input 
              name="emergencyContact"
              type="text" 
              placeholder="Emergency Contact Number" 
              value={formData.emergencyContact}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300/80 h-12 rounded-full px-4 text-sm text-gray-500 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        )}

        {/* CareProvider Specific Fields */}
        {formData.role === 'careprovider' && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input 
                name="experience"
                type="number" 
                placeholder="Years of Experience" 
                value={formData.experience}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300/80 h-12 rounded-full px-4 text-sm text-gray-500 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <input 
                name="hourlyRate"
                type="number" 
                placeholder="Hourly Rate ($)" 
                value={formData.hourlyRate}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300/80 h-12 rounded-full px-4 text-sm text-gray-500 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            
            <input 
              name="qualifications"
              type="text" 
              placeholder="Qualifications (e.g., CPR Certified, Nursing Degree)" 
              value={formData.qualifications}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300/80 h-12 rounded-full px-4 text-sm text-gray-500 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />

            {/* Main Specialty Selection */}
            <div>
              <label className="block text-left text-sm font-medium text-gray-700 mb-2">Main Specialty:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleMainSpecialtyChange('childcare')}
                  className={`p-3 border rounded-xl text-sm font-medium transition-all ${
                    formData.mainSpecialty === 'childcare' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
                >
                  Child Care
                </button>
                <button
                  type="button"
                  onClick={() => handleMainSpecialtyChange('elderlycare')}
                  className={`p-3 border rounded-xl text-sm font-medium transition-all ${
                    formData.mainSpecialty === 'elderlycare' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  Elderly Care
                </button>
              </div>
            </div>

            {/* Specialties Dropdown */}
            {(formData.mainSpecialty === 'childcare' || formData.mainSpecialty === 'elderlycare') && (
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={toggleSpecialtiesDropdown}
                  className="w-full bg-white border border-gray-300/80 h-12 rounded-full px-4 text-sm text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-left flex justify-between items-center"
                >
                  <span>
                    {formData.mainSpecialty === 'childcare' 
                      ? `Childcare Specialties (${formData.childcareSpecialties.length} selected)`
                      : `Elderly Care Specialties (${formData.elderlycareSpecialties.length} selected)`
                    }
                  </span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showSpecialtiesDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showSpecialtiesDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-xl shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                    <div className="p-3">
                      {formData.mainSpecialty === 'childcare' ? (
                        <div className="space-y-2">
                          {childcareSpecialtiesOptions.map(specialty => (
                            <label key={specialty} className="flex items-center space-x-2 text-sm text-gray-600 hover:bg-gray-50 p-2 rounded">
                              <input
                                type="checkbox"
                                name="childcareSpecialties"
                                value={specialty}
                                checked={formData.childcareSpecialties.includes(specialty)}
                                onChange={handleChange}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span>{specialty}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {elderlycareSpecialtiesOptions.map(specialty => (
                            <label key={specialty} className="flex items-center space-x-2 text-sm text-gray-600 hover:bg-gray-50 p-2 rounded">
                              <input
                                type="checkbox"
                                name="elderlycareSpecialties"
                                value={specialty}
                                checked={formData.elderlycareSpecialties.includes(specialty)}
                                onChange={handleChange}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span>{specialty}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <select 
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300/80 h-12 rounded-full px-4 text-sm text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="">Select Availability</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="weekends">Weekends Only</option>
              <option value="flexible">Flexible</option>
            </select>

            <textarea 
              name="bio"
              placeholder="Brief bio about yourself and your caregiving experience..."
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white border border-gray-300/80 rounded-2xl p-4 text-sm text-gray-500 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
            />

            {/* Certifications Upload */}
            <div>
              <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                Upload Certifications (PDF, DOC)
              </label>
              <input 
                ref={fileInputRef}
                name="certifications"
                type="file" 
                multiple
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleFileButtonClick}
                className="w-full bg-white border border-gray-300/80 h-12 rounded-full px-4 text-sm text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Click to upload certifications</span>
              </button>
              {formData.certifications.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-left text-sm text-gray-600">Selected files:</p>
                  {formData.certifications.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || !formData.role}
          className="mt-6 w-full h-11 rounded-full text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <p className="text-gray-500 text-sm mt-3 mb-11">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">Sign in</Link>
        </p>
      </form>

      {/* Floating Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-blue-600/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-blue-700/10 rounded-full blur-lg animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-gray-400/10 rounded-full blur-md animate-pulse delay-500"></div>
    </div>
  );
};

export default Register;