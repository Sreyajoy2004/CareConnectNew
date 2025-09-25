// src/context/AppContext.jsx
import { createContext, useContext, useState } from "react";

// 1. Create context
export const AppContext = createContext();

// 2. Provider component
export const AppContextProvider = ({ children }) => {
  // Global states
  const [user, setUser] = useState({name:"sreya"});
  const [role, setRole] = useState("careprovider");
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Login function without navigation
  const login = (userData) => {
    setUser(userData);
    setRole(userData.role);
    // Navigation will be handled in components
  };

  // Logout function without navigation
  const logout = () => {
    setUser(null);
    setRole(null);
    setBookings([]);
    setReviews([]);
    // Navigation will be handled in components
  };

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