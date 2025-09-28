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
import Payments from './pages/careprovider/Payments'
import Reviews from './pages/careprovider/Reviews'

// CareSeeker Pages
import CareSeekerDashboard from './pages/CareSeekerDashboard'
import SearchCaregivers from './pages/careseeker/SearchCaregivers'
import CareSeekerBookings from './pages/careseeker/Bookings'
import CareSeekerReviews from './pages/careseeker/Reviews'
import CareProviderProfileRead from './pages/careseeker/CareProviderProfileRead'

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
          path="/careprovider/payments" 
          element={
            <ProtectedRoute requiredRole="careprovider">
              <Payments/>
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