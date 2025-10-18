// src/pages/careseeker/CareProviderProfileRead.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const CareProviderProfileRead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Synchronized caregiver data that matches dashboard data
  const synchronizedCaregivers = {
    'caregiver': {
      id: 'caregiver',
      name: "Maria Caregiver",
      email: "caregiver@careconnect.com",
      phone: "+1 (555) 123-4567",
      address: "123 Care Street, Boston, MA 02115",
      bio: "Experienced caregiver with 5+ years in child and elderly care. Certified in CPR and First Aid. Passionate about providing compassionate care and building strong relationships with families.",
      specialties: ["Child Care", "Elderly Care", "Special Needs"],
      experience: "5 years",
      hourlyRate: "$25/hr",
      availability: "Full-time",
      qualifications: "CPR Certified, Nursing Degree, First Aid Certified",
      mainSpecialty: "Childcare",
      certifications: ["CPR Certificate.pdf", "First Aid Certificate.pdf", "Nursing License.pdf"],
      memberSince: "Jan 2023",
      completedJobs: 47,
      responseRate: 95,
      rating: 4.8,
      reviews: 42,
      profileImage: null,
      careType: "Childcare & Elderly Care",
      specialization: "Infant & Senior Care Specialist"
    },
    'mariagarcia': {
      id: 'mariagarcia',
      name: "Maria Garcia",
      email: "mariagarcia@careconnect.com",
      phone: "+1 (555) 987-6543",
      address: "456 Caregiver Ave, Boston, MA 02115",
      bio: "Dedicated caregiver specializing in elderly care with 8 years of experience. Compassionate and patient with excellent communication skills.",
      specialties: ["Elderly Care", "Special Needs", "Dementia Care"],
      experience: "8 years",
      hourlyRate: "$28/hr",
      availability: "Part-time",
      qualifications: "CPR Certified, Elderly Care Specialist",
      mainSpecialty: "Elderly Care",
      certifications: ["CPR Certificate.pdf", "Elderly Care Certification.pdf"],
      memberSince: "Mar 2022",
      completedJobs: 63,
      responseRate: 98,
      rating: 4.9,
      reviews: 63,
      profileImage: null,
      careType: "Elderly Care",
      specialization: "Senior Companion & Dementia Care"
    },
    'caregiver3': {
      id: 'caregiver3',
      name: "David Chen",
      email: "david.chen@careconnect.com",
      phone: "+1 (555) 456-7890",
      address: "789 Childcare Lane, Boston, MA 02115",
      bio: "Passionate about child development and early education. Creative and engaging activities for children with 6 years of experience.",
      specialties: ["Homework Assistance", "Child Development"],
      experience: "6 years",
      hourlyRate: "$20/hr",
      availability: "Full-time",
      qualifications: "Early Childhood Education",
      mainSpecialty: "Childcare",
      certifications: ["Early Childhood Certificate.pdf", "CPR Certificate.pdf", "Child Development Certification.pdf"],
      memberSince: "Jun 2023",
      completedJobs: 38,
      responseRate: 92,
      rating: 4.7,
      reviews: 38,
      profileImage: null,
      careType: "Childcare",
      specialization: "Toddler Care Expert"
    },
    'caregiver4': {
      id: 'caregiver4',
      name: "Lisa Wang",
      email: "lisa.wang@careconnect.com",
      phone: "+1 (555) 234-5678",
      address: "321 Elder Care Road, Boston, MA 02115",
      bio: "Specialized in dementia and Alzheimer's care with extensive experience. Patient and understanding with excellent communication skills.",
      specialties: ["Alzheimer Care", "Medication Management"],
      experience: "10 years",
      hourlyRate: "$25/hr",
      availability: "Full-time",
      qualifications: "Special Needs Certification",
      mainSpecialty: "Special Needs",
      certifications: ["Special Needs Certificate.pdf", "Therapeutic Care Certificate.pdf", "Nursing License.pdf"],
      memberSince: "Feb 2022",
      completedJobs: 34,
      responseRate: 96,
      rating: 4.9,
      reviews: 34,
      profileImage: null,
      careType: "Elderly Care",
      specialization: "Dementia Care Specialist"
    }
  };

  // Check if user is allowed to view this page
  useEffect(() => {
    if (user && user.role !== 'careseeker') {
      setError('Access denied. Only care seekers can view caregiver profiles.');
      setLoading(false);
      return;
    }
  }, [user]);

  // Fetch caregiver profile data (only for care seekers) with synchronized data fallback
  useEffect(() => {
    if (user?.role !== 'careseeker') return;

    const fetchCaregiverProfile = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        try {
          const response = await fetch(`/api/careproviders/${id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setCaregiver(data);
            setLoading(false);
            return;
          }
        } catch (apiError) {
          console.log('API not available, using synchronized data');
        }
        
        // Fallback to synchronized data if API fails
        if (synchronizedCaregivers[id]) {
          setTimeout(() => {
            setCaregiver(synchronizedCaregivers[id]);
            setLoading(false);
          }, 500); // Simulate API delay
        } else {
          setError('Caregiver profile not found');
          setLoading(false);
        }
        
      } catch (err) {
        // Final fallback to synchronized data
        if (synchronizedCaregivers[id]) {
          setCaregiver(synchronizedCaregivers[id]);
          setError('');
        } else {
          setError('Failed to load caregiver profile');
        }
        setLoading(false);
      }
    };

    fetchCaregiverProfile();
  }, [id, user]);

  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/careprovider/${id}` } });
      return;
    }
    // Navigate to the dedicated booking form
    navigate(`/booking/${id}`);
  };

  const getInitials = (name) => {
    if (!name) return 'CP';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg 
            key={star} 
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
        <span className="text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  // If user is not a care seeker, show access denied
  if (user && user.role !== 'careseeker') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <strong className="font-bold">Access Denied!</strong>
            <p className="mt-1">Only care seekers can view caregiver profiles.</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

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
          <div className="text-red-500 text-lg mb-4">{error || 'Error loading profile'}</div>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mr-2"
          >
            Go Back
          </button>
          <button 
            onClick={() => navigate('/careseeker/dashboard')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Browse Caregivers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="p-6 lg:p-8">
        {/* Demo Mode Indicator */}
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Demo Mode: Real-time synchronization with caregiver profiles.</span>
          </div>
        </div>

        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate('/careseeker/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Search
          </button>
          
          <button 
            onClick={handleBookNow}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Book Now
          </button>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border-2 border-blue-100">
              <div className="text-center">
                {/* Profile Image */}
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white overflow-hidden">
                    {getInitials(caregiver.name)}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{caregiver.name}</h2>
                <p className="text-gray-600 mb-3">Professional Caregiver</p>
                
                {/* Rating */}
                <div className="flex items-center justify-center mb-4">
                  <StarRating rating={caregiver.rating} />
                </div>
                
                {/* Verification Status */}
                <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verified Caregiver
                </div>
              </div>

              {/* Stats Section */}
              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Response Rate</p>
                      <p className="font-semibold text-gray-900">{caregiver.responseRate}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Completed Jobs</p>
                      <p className="font-semibold text-gray-900">{caregiver.completedJobs}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-semibold text-gray-900">{caregiver.memberSince}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Professional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Read-only Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.name}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.phone}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.hourlyRate}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.availability}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.experience}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Specialty</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.mainSpecialty}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.qualifications}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                    {caregiver.address}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 leading-relaxed">
                    {caregiver.bio}
                  </div>
                </div>
                
                {/* Specialties Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {caregiver.specialties.map((specialty, index) => (
                      <span key={index} className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certificates Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificates & Documents
                  </label>
                  <div className="space-y-2">
                    {caregiver.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-700">{cert}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareProviderProfileRead;