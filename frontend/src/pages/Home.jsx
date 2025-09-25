// src/pages/Home.jsx
import React from 'react'
import Hero from '../components/Hero'
import SearchCaregivers from '../components/SearchCaregivers'
import About from '../components/About'
import Footer from '../components/Footer'
const Home = () => {
  return (
    <div>
      <Hero/>
      <SearchCaregivers/>
      <About/>
      <Footer/>
    </div>
  )
}

export default Home