// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img className="h-12 w-auto" src={assets.logotitle} alt="CareConnect" />
              <span className="text-2xl font-bold text-white">CareConnect</span>
            </Link>
            <p className="text-blue-200 leading-relaxed mb-6">
              Connecting families with trusted caregivers for quality childcare and elderly care services. 
              Your family's safety and happiness are our top priority.
            </p>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a href="#" className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              {/* Twitter */}
              <a href="#" className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              
              {/* LinkedIn */}
              <a href="#" className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              {/* Instagram */}
              <a href="#" className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.25 14.816 3.76 13.665 3.76 12.368s.49-2.448 1.366-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.875.875 1.366 2.026 1.366 3.323s-.491 2.448-1.366 3.323c-.875.807-2.026 1.297-3.323 1.297zm8.062-10.966h-2.207c-.432 0-.807.16-1.076.49-.269.269-.49.644-.49 1.076v2.207c0 .432.16.807.49 1.076.269.269.644.49 1.076.49h2.207c.432 0 .807-.16 1.076-.49.269-.269.49-.644.49-1.076V7.588c0-.432-.16-.807-.49-1.076-.269-.33-.644-.49-1.076-.49z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-blue-200 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-200 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/caregivers" className="text-blue-200 hover:text-white transition-colors duration-200">
                  Find Caregivers
                </Link>
              </li>
              <li>
                <Link to="/become-provider" className="text-blue-200 hover:text-white transition-colors duration-200">
                  Become a Caregiver
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-blue-200 hover:text-white transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/childcare" className="text-blue-200 hover:text-white transition-colors duration-200">
                  Childcare Services
                </Link>
              </li>
              <li>
                <Link to="/elderlycare" className="text-blue-200 hover:text-white transition-colors duration-200">
                  Elderly Care Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-white text-sm">📍</span>
                </div>
                <p className="text-blue-200">
                  123 Care Street<br />
                  Suite 100<br />
                  City, State 12345
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">📞</span>
                </div>
                <p className="text-blue-200">(555) 123-4567</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✉️</span>
                </div>
                <p className="text-blue-200">support@careconnect.com</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🕒</span>
                </div>
                <p className="text-blue-200">24/7 Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-blue-300 text-sm">
              © 2024 CareConnect. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-blue-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-blue-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-blue-300 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group">
          <span className="text-white text-xl">💬</span>
          <span className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
          <span className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full"></span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;