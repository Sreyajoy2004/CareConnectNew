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
// FIXED IMPORT PATH:
import CareProviderProfileRead from './pages/careseeker/CareProviderProfileRead' // This should work now
import BookingForm from './pages/careseeker/BookingForm'
import ReviewForm from './pages/careseeker/ReviewForm'
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
  
  const getBackendRole = (frontendRole) => {
    const roleMap = {
      'careprovider': 'provider',
      'careseeker': 'seeker',
      'admin': 'admin',
      'provider': 'provider',
      'seeker': 'seeker'
    };
    return roleMap[frontendRole] || frontendRole;
  };

  if (requiredRole) {
    const userBackendRole = getBackendRole(user.role);
    const requiredBackendRole = getBackendRole(requiredRole);
    
    console.log('Role check:', { 
      userRole: user.role, 
      userBackendRole, 
      requiredRole, 
      requiredBackendRole 
    });
    
    if (userBackendRole !== requiredBackendRole) {
      console.log('Access denied: role mismatch');
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

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
            <ProtectedRoute requiredRole="provider">
              <CareProviderDashboard/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/careprovider/profile" 
          element={
            <ProtectedRoute requiredRole="provider">
              <Profile/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/careprovider/bookings" 
          element={
            <ProtectedRoute requiredRole="provider">
              <Bookings/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/careprovider/reviews" 
          element={
            <ProtectedRoute requiredRole="provider">
              <Reviews/>
            </ProtectedRoute>
          } 
        />
        
        {/* Care Seeker Routes */}
        <Route 
          path="/careseeker/dashboard" 
          element={
            <ProtectedRoute requiredRole="seeker">
              <CareSeekerDashboard/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/careseeker/profile" 
          element={
            <ProtectedRoute requiredRole="seeker">
              <CareSeekerProfile/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/search" 
          element={
            <ProtectedRoute requiredRole="seeker">
              <SearchCaregivers/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/careseeker/bookings" 
          element={
            <ProtectedRoute requiredRole="seeker">
              <CareSeekerBookings/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/careseeker/reviews" 
          element={
            <ProtectedRoute requiredRole="seeker">
              <CareSeekerReviews/>
            </ProtectedRoute>
          } 
        />
        
        {/* Booking Form Route */}
        <Route 
          path="/booking/:id" 
          element={
            <ProtectedRoute requiredRole="seeker">
              <BookingForm/>
            </ProtectedRoute>
          } 
        />
        
        {/* Review Form Route */}
        <Route 
          path="/careseeker/review" 
          element={
            <ProtectedRoute requiredRole="seeker">
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