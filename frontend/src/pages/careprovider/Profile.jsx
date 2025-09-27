// src/pages/careprovider/Profile.jsx
import React, { useState, useRef } from 'react';
import CareProviderSidebar from '../../components/careprovider/CareProviderSidebar';
import { useAppContext } from '../../context/AppContext';

const Profile = () => {
  const { user } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showSpecialtyInput, setShowSpecialtyInput] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [notificationSent, setNotificationSent] = useState(false);
  const fileInputRef = useRef(null);
  const certificateInputRef = useRef(null);

  // Initialize profile data from user context or registration data
  const [profileData, setProfileData] = useState({
    name: user?.name || "Sarah Johnson",
    email: user?.email || "sarah.johnson@careconnect.com",
    phone: user?.profileData?.phone || "+1 (555) 123-4567",
    address: user?.profileData?.address || "123 Care Street, Boston, MA 02115",
    bio: user?.profileData?.bio || "Experienced caregiver with 5+ years in child and elderly care. Certified in CPR and First Aid.",
    specialties: user?.profileData?.specialties || ["Child Care", "Elderly Care", "Special Needs"],
    experience: user?.profileData?.experience || "5 years",
    hourlyRate: user?.profileData?.hourlyRate || "$25/hr",
    availability: user?.profileData?.availability || "Full-time",
    qualifications: user?.profileData?.qualifications || "CPR Certified, Nursing Degree",
    mainSpecialty: user?.profileData?.mainSpecialty || "Childcare",
    certifications: user?.profileData?.certifications || ["CPR Certificate.pdf", "First Aid Certificate.pdf"],
    memberSince: user?.profileData?.memberSince || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
    completedJobs: user?.profileData?.completedJobs || 47,
    responseRate: user?.profileData?.responseRate || 95,
    profileImage: user?.profileData?.profileImage || null
  });

  const handleSave = () => {
    setIsEditing(false);
    setNotificationSent(true);
    
    // Notify admin about profile changes
    notifyAdminAboutChanges();
    
    // Here you would typically send the updated data to your backend
    console.log('Updated profile data:', profileData);
    
    // Reset notification after 3 seconds
    setTimeout(() => setNotificationSent(false), 3000);
  };

  const notifyAdminAboutChanges = () => {
    // This would be an API call to notify admin in a real application
    console.log('Admin notified about profile changes for verification');
    // Example: axios.post('/api/admin/notify-profile-update', { userId: user.id, updates: profileData });
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !profileData.specialties.includes(newSpecialty.trim())) {
      setProfileData({
        ...profileData,
        specialties: [...profileData.specialties, newSpecialty.trim()]
      });
      setNewSpecialty('');
      setShowSpecialtyInput(false);
    }
  };

  const handleRemoveSpecialty = (index) => {
    const updatedSpecialties = profileData.specialties.filter((_, i) => i !== index);
    setProfileData({ ...profileData, specialties: updatedSpecialties });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setProfileData({ ...profileData, profileImage: URL.createObjectURL(file) });
    }
  };

  const handleCertificateUpload = (e) => {
    const files = Array.from(e.target.files);
    const newCertificates = files.map(file => file.name);
    setProfileData({
      ...profileData,
      certifications: [...profileData.certifications, ...newCertificates]
    });
  };

  const handleRemoveCertificate = (index) => {
    const updatedCertifications = profileData.certifications.filter((_, i) => i !== index);
    setProfileData({ ...profileData, certifications: updatedCertifications });
  };

  const getInitials = (name) => {
    if (!name) return 'UP';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex">
        <CareProviderSidebar />
        
        <div className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2">Manage your professional information</p>
            </div>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Admin Notification */}
          {notificationSent && (
            <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Changes saved! Admin has been notified for verification.</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border-2 border-blue-100 hover:border-blue-200 transition-all duration-300">
                <div className="text-center">
                  {/* Profile Image */}
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white overflow-hidden">
                      {profileData.profileImage ? (
                        <img 
                          src={profileData.profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(user?.name || profileData.name)
                      )}
                    </div>
                    {isEditing && (
                      <>
                        <input 
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className="hidden"
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name || profileData.name}</h2>
                  <p className="text-gray-600 mb-3">Professional Caregiver</p>
                  
                  {/* Verification Status */}
                  <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Pending Admin Verification
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
                        <p className="font-semibold text-gray-900">{profileData.responseRate}%</p>
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
                        <p className="font-semibold text-gray-900">{profileData.completedJobs}</p>
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
                        <p className="font-semibold text-gray-900">{profileData.memberSince}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Personal Information */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-gray-200 transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.name}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={profileData.phone}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                    <input 
                      type="text" 
                      value={profileData.hourlyRate}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, hourlyRate: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                    <select 
                      value={profileData.availability}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, availability: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                      <option value="Full-time">Full Time</option>
                      <option value="Part-time">Part Time</option>
                      <option value="Weekends">Weekends Only</option>
                      <option value="Flexible">Flexible</option>
                      <option value="Not Available">Not Available</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <input 
                      type="text" 
                      value={profileData.experience}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Specialty</label>
                    <select 
                      value={profileData.mainSpecialty}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, mainSpecialty: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                      <option value="Childcare">Child Care</option>
                      <option value="Elderlycare">Elderly Care</option>
                      <option value="Special Needs">Special Needs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
                    <input 
                      type="text" 
                      value={profileData.qualifications}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, qualifications: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input 
                      type="text" 
                      value={profileData.address}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea 
                      value={profileData.bio}
                      disabled={!isEditing}
                      rows="3"
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
                    />
                  </div>
                  
                  {/* Specialties Section */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profileData.specialties.map((specialty, index) => (
                        <div key={index} className="relative group">
                          <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                            {specialty}
                          </span>
                          {isEditing && (
                            <button 
                              onClick={() => handleRemoveSpecialty(index)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        {showSpecialtyInput ? (
                          <div className="flex gap-2 flex-1">
                            <input 
                              type="text"
                              value={newSpecialty}
                              onChange={(e) => setNewSpecialty(e.target.value)}
                              placeholder="Enter new specialty"
                              className="flex-1 p-2 border border-gray-300 rounded-lg"
                            />
                            <button 
                              onClick={handleAddSpecialty}
                              className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
                            >
                              Add
                            </button>
                            <button 
                              onClick={() => setShowSpecialtyInput(false)}
                              className="bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setShowSpecialtyInput(true)}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                          >
                            + Add Specialty
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Certificates Section */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificates & Documents
                    </label>
                    <div className="space-y-2 mb-3">
                      {profileData.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-700">{cert}</span>
                          </div>
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveCertificate(index)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <div>
                        <input 
                          ref={certificateInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleCertificateUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => certificateInputRef.current?.click()}
                          className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Upload More Certificates
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Info Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-sm text-blue-600 font-medium">Experience</p>
                      <p className="text-lg font-bold text-gray-900">{profileData.experience}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <p className="text-sm text-green-600 font-medium">Availability</p>
                      <p className="text-lg font-bold text-gray-900">{profileData.availability}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                      <p className="text-sm text-purple-600 font-medium">Member Since</p>
                      <p className="text-lg font-bold text-gray-900">{profileData.memberSince}</p>
                    </div>
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

export default Profile;