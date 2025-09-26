// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar/>
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>
              {/* Add other routes here */}
            </Routes>
          </main>
        </div>
      </AppContextProvider>
    </BrowserRouter>
  )
}

export default App