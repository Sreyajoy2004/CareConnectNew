import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// 1. Create context
export const AppContext = createContext();

// 2. Provider component
export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // Global states
  const [user, setUser] = useState(null); // will store {id, name, email, role}
  const [role, setRole] = useState(null); // "careseeker" | "careprovider" | "admin"
  const [bookings, setBookings] = useState([]); // active user’s bookings
  const [reviews, setReviews] = useState([]); // reviews by/for user
  const [loading, setLoading] = useState(false); // global loading spinner

  // Example: login function
  const login = (userData) => {
    setUser(userData);
    setRole(userData.role);
    navigate("/"); // go to home after login
  };

  // Example: logout function
  const logout = () => {
    setUser(null);
    setRole(null);
    setBookings([]);
    setReviews([]);
    navigate("/login");
  };

  const value = {
    navigate,
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
