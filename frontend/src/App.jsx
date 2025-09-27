// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppContextProvider, useAppContext } from './context/AppContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CareProviderDashboard from './pages/CareProviderDashboard'
import Profile from './pages/careprovider/Profile'
import Bookings from './pages/careprovider/Bookings'
import Payments from './pages/careprovider/Payments'
import Reviews from './pages/careprovider/Reviews'

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

// Component to hide navbar on auth pages
const Layout = ({ children }) => {
  const { user } = useAppContext();
  const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
  
  if (isAuthPage) {
    return <>{children}</>;
  }
  
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