// src/components/About.jsx
import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-white to-blue-50">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-950 to-purple-800 bg-clip-text text-transparent mb-6">
            About CareConnect
          </h2>
          <p className="text-xl text-gray-900 leading-relaxed">
            We're revolutionizing the way families find trusted caregivers and caregivers find meaningful work. 
            Our platform brings transparency, safety, and convenience to caregiving services.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-900 mb-2">10,000+</div>
            <div className="text-gray-600">Verified Caregivers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-900 mb-2">50,000+</div>
            <div className="text-gray-600">Happy Families</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-900 mb-2">100+</div>
            <div className="text-gray-600">Cities Served</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-900 mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-blue-900 mb-4">Our Mission</h3>
            <p className="text-gray-900 text-lg leading-relaxed mb-6">
              To create a world where every family has access to trusted, qualified caregivers, 
              and every caregiver has the opportunity to build a rewarding career doing what they love.
            </p>
            <h3 className="text-3xl font-bold text-blue-900 mb-4">Our Vision</h3>
            <p className="text-gray-900 text-lg leading-relaxed">
              To be the most trusted platform connecting families with caregivers, 
              setting new standards for safety, quality, and reliability in the caregiving industry.
            </p>
          </div>
          <div className="relative">
            <img 
              src={assets.banner1} 
              alt="CareConnect Team" 
              className="rounded-2xl shadow-xl w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800/20 to-purple-300/20 rounded-2xl"></div>
          </div>
        </div>

        {/* Values Section - Updated with blue-950 background */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-blue-950 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-blue-800">
              <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">🔒</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Trust & Safety</h4>
              <p className="text-blue-200 leading-relaxed">Every caregiver is thoroughly vetted and background checked to ensure complete safety for your family.</p>
            </div>
            <div className="text-center p-8 bg-blue-950 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-blue-800">
              <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">❤️</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Compassion</h4>
              <p className="text-blue-200 leading-relaxed">We care deeply about both families and caregivers, fostering meaningful connections built on empathy.</p>
            </div>
            <div className="text-center p-8 bg-blue-950 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-blue-800">
              <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">⚡</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Innovation</h4>
              <p className="text-blue-200 leading-relaxed">Constantly improving our platform with cutting-edge technology for better caregiving experiences.</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-blue-950 to-purple-900 rounded-2xl p-8 text-white">
          <h3 className="text-3xl font-bold text-center mb-8">How CareConnect Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h4 className="text-xl font-bold mb-2">Create Profile</h4>
              <p>Sign up and tell us your care needs or caregiving experience</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h4 className="text-xl font-bold mb-2">Find Match</h4>
              <p>Browse verified profiles and find your perfect match</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h4 className="text-xl font-bold mb-2">Connect & Care</h4>
              <p>Connect directly and start your care journey</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;