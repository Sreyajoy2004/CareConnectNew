import { createContext, useContext, useState, useEffect } from "react";
import apiService from '../services/api';

// 1. Create context
export const AppContext = createContext();

// 2. Provider component
export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminNotifications, setAdminNotifications] = useState([]);

  // 🔔 Optional: notify admin about profile updates
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
    console.log('Admin notified about profile update:', notification);
  };

  // =============================
  // ✅ LOGIN
  // =============================
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiService.login(email, password);
      if (response && response.token) {
        localStorage.setItem('token', response.token);

        const profile = await apiService.getMe();
        const formattedMemberSince = profile.member_since
          ? new Date(profile.member_since).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
          : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

        const frontendRole = profile.role === 'provider'
          ? 'careprovider'
          : profile.role === 'seeker'
          ? 'careseeker'
          : profile.role;

        const specialtiesArray = profile.specialization
          ? Array.isArray(profile.specialization)
            ? profile.specialization
            : [profile.specialization]
          : [];

        const certificationsArray = Array.isArray(profile.certificates)
          ? profile.certificates
          : (profile.certificates ? String(profile.certificates).split(',').map(s => s.trim()) : []);

        let profileDataObj = {};

        if (profile.role === 'provider') {
          // Provider profile mapping
          profileDataObj = {
            memberSince: formattedMemberSince,
            bio: profile.bio || '',
            phone: profile.phone || '',
            address: profile.address || '',
            specialties: specialtiesArray.length ? specialtiesArray : [profile.category].filter(Boolean),
            experience: profile.experience_years != null ? `${profile.experience_years} years` : '',
            hourlyRate: profile.hourly_rate != null ? `$${Number(profile.hourly_rate).toFixed(2)}/hr` : '',
            qualifications: certificationsArray.length ? certificationsArray.join(', ') : '',
            mainSpecialty: profile.specialization || '',
            certifications: certificationsArray,
            profileImage: profile.image || null,
            specialization: profile.specialization || '',
            hourly_rate: profile.hourly_rate ?? null,
            experience_years: profile.experience_years ?? null,
            category: profile.category || '',
            image: profile.image || null,
            certificates: certificationsArray,
            isVerified: profile.is_verified === 1 || profile.is_verified === true
          };
        } else {
          // Seeker profile mapping
          profileDataObj = {
            memberSince: formattedMemberSince,
            phone: profile.phone || '',
            address: profile.address || '',
            emergencyContact: profile.emergency_contact || '',
            bio: profile.bio || '',
            profileImage: profile.image || null,
            completedBookings: profile.completed_bookings || 0,
            activeBookings: profile.active_bookings || 0,
            preferences: profile.preferences || ''
          };
        }

        const userData = {
          id: profile.user_id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          frontendRole,
          phone: profile.phone || '',
          address: profile.address || '',
          profilePicture: profile.image || null,
          profileData: profileDataObj
        };

        setUser(userData);
        setRole(frontendRole);
        localStorage.setItem('user', JSON.stringify(userData));
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (error) {
      console.error('❌ Login error:', error);
      setLoading(false);
      return false;
    }
  };

  // =============================
  // ✅ REGISTER
  // =============================
  const register = async (formData) => {
    setLoading(true);
    try {
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
        category: formData.category || formData.mainSpecialty || null,
        image: formData.image || null,
        verification_doc_url: formData.verificationDocUrl || null,
      };

      const response = await apiService.register(backendData);

      if (response.userId || response.user_id) {
        const loginSuccess = await login(formData.email, formData.password);
        if (loginSuccess) {
          if (formData.role === 'careprovider') {
            notifyAdmin(response.userId, backendData.name, { type: 'new_registration' });
          }
          setLoading(false);
          return true;
        }
      }

      setLoading(false);
      return false;
    } catch (error) {
      console.error('❌ Registration error:', error);
      setLoading(false);
      return false;
    }
  };

  // =============================
  // ✅ UPDATE PROFILE
  // =============================
  const updateUserProfile = async (updates) => {
    setLoading(true);
    try {
      await apiService.updateProfile(updates);

      const updatedProfile = await apiService.getMe();

      // Merge updated profile
      const newUser = {
        ...user,
        ...updatedProfile,
        profileData: {
          ...user.profileData,
          ...updates
        }
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      if (user.role === 'provider') {
        notifyAdmin(user.id, user.name, updates);
      }

      setLoading(false);
      return true;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      setLoading(false);
      return false;
    }
  };

  // =============================
  // ✅ LOGOUT
  // =============================
  const logout = () => {
    setUser(null);
    setRole(null);
    setBookings([]);
    setReviews([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // =============================
  // Auto login if saved
  // =============================
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setRole(userData.frontendRole);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const value = {
    user,
    role,
    bookings,
    reviews,
    loading,
    adminNotifications,
    login,
    logout,
    register,
    updateUserProfile,
    notifyAdmin,
    setBookings,
    setReviews
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
