// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import apiService from '../services/api';

// 1. Create context
export const AppContext = createContext();

// 2. Provider component
export const AppContextProvider = ({ children }) => {
  // Global states
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminNotifications, setAdminNotifications] = useState([]);

  // Mock user database for testing (fallback)
  const mockUsers = {
    'family@careconnect.com': { 
      name: 'Sarah Family',
      role: 'careseeker',
      password: 'demo123'
    },
    'caregiver@careconnect.com': { 
      name: 'Maria Caregiver', 
      role: 'careprovider',
      password: 'demo123',
      profileData: {
        phone: "+1 (555) 123-4567",
        address: "123 Care Street, Boston, MA 02115",
        bio: "Experienced caregiver with 5+ years in child and elderly care.",
        specialties: ["Child Care", "Elderly Care"],
        experience: "5 years",
        availability: "Full-time",
        qualifications: "CPR Certified, Nursing Degree",
        mainSpecialty: "Childcare",
        certifications: ["CPR Certificate.pdf", "First Aid Certificate.pdf"],
        memberSince: "Jan 2023",
        completedJobs: 47,
        responseRate: 95
      }
    },
    'mariagarcia@careconnect.com': { 
      name: 'Maria Garcia', 
      role: 'careprovider',
      password: 'demo123',
      profileData: {
        phone: "+1 (555) 987-6543",
        address: "456 Caregiver Ave, Boston, MA 02115",
        bio: "Dedicated caregiver specializing in elderly care with 8 years of experience.",
        specialties: ["Elderly Care", "Special Needs"],
        experience: "8 years",
        availability: "Part-time",
        qualifications: "CPR Certified, Elderly Care Specialist",
        mainSpecialty: "Elderly Care",
        certifications: ["CPR Certificate.pdf", "Elderly Care Certification.pdf"],
        memberSince: "Mar 2022",
        completedJobs: 63,
        responseRate: 98
      }
    },
    'admin@careconnect.com': { 
      name: 'Admin User',
      role: 'admin', 
      password: 'admin123'
    }
  };

  // Function to notify admin about profile changes
  const notifyAdmin = (userId, userName, updates) => {
    const notification = {
      id: Date.now(),
      type: 'profile_update',
      userId,
      userName,
      updates,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    setAdminNotifications(prev => [notification, ...prev]);
    
    // In real app, this would be an API call to backend
    console.log('Admin notified about profile update:', notification);
  };

  // Login function with backend integration
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Try backend first
      const response = await apiService.login(email, password);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        // Transform backend user to frontend format
        const userData = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role, // This will be 'provider' or 'seeker' from backend
          profilePicture: null,
          phone: response.user.phone || '',
          address: response.user.address || '',
          // Map backend role to frontend role names for routing
          frontendRole: response.user.role === 'provider' ? 'careprovider' : 
                       response.user.role === 'seeker' ? 'careseeker' : response.user.role,
          profileData: {
            memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
            completedJobs: 0,
            responseRate: 100,
            ...response.user
          }
        };
        
        setUser(userData);
        setRole(userData.frontendRole); // Use frontend role for routing
        localStorage.setItem('user', JSON.stringify(userData));
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
      
    } catch (error) {
      // Fallback to demo mode
      console.log('Backend unavailable, using demo mode');
      return demoLogin(email, password);
    }
  };

  // Update demo login to handle role mapping
  const demoLogin = (email, password) => {
    const userData = mockUsers[email];
    if (userData && userData.password === password) {
      const user = {
        id: email.split('@')[0],
        email: email,
        name: userData.name,
        role: userData.role, // Keep original for display
        frontendRole: userData.role, // Same for demo
        profileData: userData.profileData || {
          memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
          completedJobs: 0,
          responseRate: 100
        }
      };
      
      setUser(user);
      setRole(userData.role);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  // Register function - Enhanced for backend integration
  const register = async (formData) => {
    setLoading(true);
    try {
      // Prepare data for backend
      const backendData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: formData.role === 'careprovider' ? 'provider' : 'seeker',
        phone: formData.phone,
        address: formData.address,
        description: formData.bio,
        specialization: formData.mainSpecialty,
        hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
        experience_years: formData.experience ? parseInt(formData.experience) : null,
        category: formData.mainSpecialty,
        // Add other fields as needed
      };

      // Try backend registration first
      try {
        const response = await apiService.register(backendData);
        
        if (response.userId) {
          // Auto-login after successful registration
          const loginSuccess = await login(formData.email, formData.password);
          if (loginSuccess) {
            // Notify admin about new caregiver registration
            if (formData.role === 'careprovider') {
              notifyAdmin(response.userId, backendData.name, { type: 'new_registration' });
            }
            
            setLoading(false);
            return true;
          }
        }
      } catch (apiError) {
        console.log('Backend registration failed, using demo mode');
      }

      // Fallback to demo registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: formData.email.split('@')[0],
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        role: formData.role,
        profileData: {
          phone: formData.phone,
          address: formData.address,
          experience: formData.experience ? `${formData.experience} years` : '0 years',
          qualifications: formData.qualifications || '',
          specialties: formData.specialties || [],
          availability: formData.availability || 'Flexible',
          bio: formData.bio || '',
          mainSpecialty: formData.mainSpecialty || '',
          certifications: formData.certifications ? formData.certifications.map(f => f.name) : [],
          memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
          completedJobs: 0,
          responseRate: 100
        }
      };
      
      setUser(user);
      setRole(formData.role);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Notify admin about new caregiver registration
      if (formData.role === 'careprovider') {
        notifyAdmin(user.id, user.name, { type: 'new_registration' });
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  // Update user profile function
  const updateUserProfile = async (updates) => {
    setLoading(true);
    try {
      // Try backend first
      try {
        await apiService.updateProfile(updates);
      } catch (apiError) {
        console.log('Backend profile update failed, using demo mode');
      }

      // Fallback to localStorage update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = {
        ...user,
        profileData: {
          ...user.profileData,
          ...updates
        }
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Notify admin about profile changes
      if (user.role === 'careprovider') {
        notifyAdmin(user.id, user.name, updates);
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  // Update profile function for CareSeeker
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      // Try backend first
      try {
        await apiService.updateProfile(profileData);
      } catch (apiError) {
        console.log('Backend profile update failed, using demo mode');
      }

      // Fallback to localStorage update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = {
        ...user,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        profileData: {
          ...user.profileData,
          address: profileData.address,
          emergencyContact: profileData.emergencyContact,
          profileImage: profileData.profileImage
        }
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  // Admin function to verify caregiver
  const verifyCaregiver = (userId) => {
    setAdminNotifications(prev => 
      prev.map(notification => 
        notification.userId === userId 
          ? { ...notification, status: 'verified' }
          : notification
      )
    );
    
    // In real app, update caregiver status in backend
    console.log(`Caregiver ${userId} verified by admin`);
  };

  // Admin function to delete user
  const deleteUser = (userId) => {
    // In real app, this would make an API call to delete user
    console.log(`User ${userId} deleted by admin`);
  };

  // Admin function to flag/unflag user
  const flagUser = (userId, flagged) => {
    // In real app, this would update user status in backend
    console.log(`User ${userId} ${flagged ? 'flagged' : 'unflagged'} by admin`);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setRole(null);
    setBookings([]);
    setReviews([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Check for existing user on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setRole(userData.role);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const value = {
    user,
    setUser,
    role,
    setRole,
    bookings,
    setBookings,
    reviews,
    setReviews,
    loading,
    setLoading,
    adminNotifications,
    login,
    logout,
    register,
    updateUserProfile,
    updateProfile,
    verifyCaregiver,
    deleteUser,
    flagUser,
    notifyAdmin
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// 3. Custom hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export default AppContextProvider;