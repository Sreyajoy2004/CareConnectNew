// src/context/AppContext.jsx
import { createContext, useContext, useState } from "react";

// 1. Create context
export const AppContext = createContext();

// 2. Provider component
export const AppContextProvider = ({ children }) => {
  // Global states
  const [user, setUser] = useState(null); // Changed from {name:"sreya"} to null
  const [role, setRole] = useState(null); // Changed from "careseeker" to null
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

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
      password: 'demo123'
    },
    'admin@careconnect.com': { 
      name: 'Admin User',
      role: 'admin', 
      password: 'admin123'
    }
  };

  // Updated login function that accepts email and password
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = mockUsers[email];
      
      if (userData && userData.password === password) {
        const user = {
          email: email,
          name: userData.name,
          role: userData.role
        };
        
        setUser(user);
        setRole(userData.role);
        localStorage.setItem('user', JSON.stringify(user));
        
        setLoading(false);
        return true; // Success
      } else {
        setLoading(false);
        return false; // Invalid credentials
      }
    } catch (error) {
      setLoading(false);
      return false; // Login failed
    }
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
  useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setRole(userData.role);
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
    login,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// 3. Custom hook
export const useAppContext = () => {
  return useContext(AppContext);
};