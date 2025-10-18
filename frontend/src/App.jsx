// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppContextProvider, useAppContext } from './context/AppContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

// CareProvider Pages
import CareProviderDashboard from './pages/CareProviderDashboard'
import Profile from './pages/careprovider/Profile'
import Bookings from './pages/careprovider/Bookings'
import Reviews from './pages/careprovider/Reviews'

// CareSeeker Pages
import CareSeekerDashboard from './pages/CareSeekerDashboard'
import CareSeekerProfile from './pages/careseeker/CareSeekerProfile'
import SearchCaregivers from './pages/careseeker/SearchCaregivers'
import CareSeekerReviews from './pages/careseeker/Reviews'
import CareProviderProfileRead from './pages/careseeker/CareProviderProfileRead'
import BookingForm from './pages/careseeker/BookingForm'
import ReviewForm from './pages/careseeker/ReviewForm' // ADD THIS IMPORT

// Import CareSeekerBookings with proper named import
import CareSeekerBookings from './pages/careseeker/Bookings'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import CaregiverManagement from './pages/admin/CaregiverManagement'
import PendingVerification from './pages/admin/PendingVerification'
import BookingOversight from './pages/admin/BookingOversight'
import Reports from './pages/admin/Reports'

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAppContext();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Component that ALWAYS shows navbar on every page
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

const AppContent = () => {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        
        {/* Care Provider Routes */}
        <Route 
          path="/careprovider/dashboard" 
          element={
            <ProtectedRoute requiredRole="careprovider">
              <CareProviderDashboard/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/careprovider/profile" 
          element={
            <ProtectedRoute requiredRole="careprovider">
              <Profile/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/careprovider/bookings" 
          element={
            <ProtectedRoute requiredRole="careprovider">
              <Bookings/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/careprovider/reviews" 
          element={
            <ProtectedRoute requiredRole="careprovider">
              <Reviews/>
            </ProtectedRoute>
          } 
        />
        
        {/* Care Seeker Routes */}
        <Route 
          path="/careseeker/dashboard" 
          element={
            <ProtectedRoute requiredRole="careseeker">
              <CareSeekerDashboard/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/careseeker/profile" 
          element={
            <ProtectedRoute requiredRole="careseeker">
              <CareSeekerProfile/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/search" 
          element={
            <ProtectedRoute requiredRole="careseeker">
              <SearchCaregivers/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/careseeker/bookings" 
          element={
            <ProtectedRoute requiredRole="careseeker">
              <CareSeekerBookings/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/careseeker/reviews" 
          element={
            <ProtectedRoute requiredRole="careseeker">
              <CareSeekerReviews/>
            </ProtectedRoute>
          } 
        />
        
        {/* Booking Form Route */}
        <Route 
          path="/booking/:id" 
          element={
            <ProtectedRoute requiredRole="careseeker">
              <BookingForm/>
            </ProtectedRoute>
          } 
        />
        
        {/* Review Form Route - ADD THIS ROUTE */}
        <Route 
          path="/careseeker/review" 
          element={
            <ProtectedRoute requiredRole="careseeker">
              <ReviewForm/>
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute requiredRole="admin">
              <UserManagement/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/caregivers" 
          element={
            <ProtectedRoute requiredRole="admin">
              <CaregiverManagement/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/caregivers/unverified" 
          element={
            <ProtectedRoute requiredRole="admin">
              <PendingVerification/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/bookings" 
          element={
            <ProtectedRoute requiredRole="admin">
              <BookingOversight/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Reports/>
            </ProtectedRoute>
          } 
        />
        
        {/* Public Caregiver Profile View (accessible to both roles) */}
        <Route 
          path="/careprovider/:id" 
          element={
            <ProtectedRoute>
              <CareProviderProfileRead/>
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <AppContent />
      </AppContextProvider>
    </BrowserRouter>
  );
};

export default App;