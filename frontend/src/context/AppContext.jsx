// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

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

  // Mock user database for testing
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

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = mockUsers[email];
      
      if (userData && userData.password === password) {
        const user = {
          id: email.split('@')[0],
          email: email,
          name: userData.name,
          role: userData.role,
          profileData: userData.profileData || {
            memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
            completedJobs: 0,
            responseRate: 100
          }
        };
        
        setUser(user);
        setRole(userData.role);
        localStorage.setItem('user', JSON.stringify(user));
        
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        return false;
      }
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  // Register function - Enhanced for caregiver profile data
  const register = async (formData) => {
    setLoading(true);
    try {
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