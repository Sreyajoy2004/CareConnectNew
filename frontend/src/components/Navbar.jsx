// src/components/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);             // mobile menu
  const [servicesOpen, setServicesOpen] = React.useState(false); // services dropdown
  const [profileOpen, setProfileOpen] = React.useState(false); // profile dropdown
  const containerRef = React.useRef(null);
  const servicesRef = React.useRef(null);
  const profileRef = React.useRef(null);

  const { user, role, logout, navigate } = useAppContext();

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    function handleDocClick(e) {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  // helper to close menus when navigating
  const navAndClose = (path) => {
    setOpen(false);
    setServicesOpen(false);
    setProfileOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setOpen(false);
    setServicesOpen(false);
    setProfileOpen(false);
    logout();
  };

  return (
    <nav
      ref={containerRef}
      className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-200 bg-white relative shadow-sm transition-all"
    >
      {/* Logo + Brand */}
      <NavLink to="/" onClick={() => { setOpen(false); setServicesOpen(false); setProfileOpen(false); }} className="flex items-center gap-2">
        <img className="h-12 w-auto" src={assets.logo} alt="CareConnect Logo" />
        <span className="text-2xl font-bold text-[--color-primary]">CareConnect</span>
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-10 font-medium">
        <NavLink to="/" className="text-blue-900 hover:text-[--color-primary] transition-colors duration-200">Home</NavLink>
        <NavLink to="/about" className="text-blue-900 hover:text-[--color-primary] transition-colors duration-200">About</NavLink>

        {/* Services dropdown: supports click + hover */}
        <div
          ref={servicesRef}
          className="relative"
        >
          <button
            aria-expanded={servicesOpen}
            onClick={() => setServicesOpen(prev => !prev)}
            onMouseEnter={() => setServicesOpen(true)}
            className="text-blue-900 hover:text-[--color-primary] transition-colors duration-200 flex items-center gap-1"
          >
            Services
            <svg className={`w-4 h-4 transform transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown - toggled by servicesOpen */}
          <div
            className={`absolute ${servicesOpen ? "block" : "hidden"} bg-white border border-gray-200 shadow-lg mt-2 rounded-lg min-w-[200px] overflow-hidden z-40`}
            role="menu"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <NavLink
              to="/childcare"
              onClick={() => setServicesOpen(false)}
              className={({ isActive }) =>
                `block px-5 py-3 transition-colors duration-200 border-b border-gray-100 last:border-b-0 ${
                  isActive
                    ? "bg-[--color-primary] text-white"
                    : "text-blue-900 hover:bg-blue-50 hover:text-[--color-primary]"
                }`
              }
            >
              Childcare
            </NavLink>

            <NavLink
              to="/elderlycare"
              onClick={() => setServicesOpen(false)}
              className={({ isActive }) =>
                `block px-5 py-3 transition-colors duration-200 border-b border-gray-100 last:border-b-0 ${
                  isActive
                    ? "bg-[--color-primary] text-white"
                    : "text-blue-900 hover:bg-blue-50 hover:text-[--color-primary]"
                }`
              }
            >
              Elderly Care
            </NavLink>
          </div>
        </div>

        <NavLink to="/contact" className="text-blue-900 hover:text-[--color-primary] transition-colors duration-200">Contact</NavLink>

        {/* Login Button - Always shown when user is not logged in */}
        {!user && (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white font-semibold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
        )}

        {/* Profile Dropdown - Only shown when user is logged in */}
        {user && (
          <div ref={profileRef} className="relative">
            <button 
              onClick={() => setProfileOpen(prev => !prev)}
              onMouseEnter={() => setProfileOpen(true)}
              className="flex items-center gap-2 cursor-pointer transition-transform duration-200 hover:scale-105"
            >
              <img src={assets.profile_icon} className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-blue-300 transition-colors" alt="Profile" />
            </button>

            <div 
              className={`absolute top-12 right-0 bg-white shadow-xl border border-gray-200 py-2 w-48 rounded-xl text-sm z-50 ${profileOpen ? "block" : "hidden"}`}
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              {role === "careseeker" && (
                <>
                  <div onClick={() => navAndClose("/my-bookings")} className="px-4 py-3 text-blue-900 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-gray-100">My Bookings</div>
                  <div onClick={() => navAndClose("/reviews")} className="px-4 py-3 text-blue-900 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-gray-100">Reviews</div>
                </>
              )}
              {role === "careprovider" && (
                <>
                  <div onClick={() => navAndClose("/profile")} className="px-4 py-3 text-blue-900 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-gray-100">Profile</div>
                  <div onClick={() => navAndClose("/reviews")} className="px-4 py-3 text-blue-900 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-gray-100">Reviews</div>
                </>
              )}
              <div
                onClick={handleLogout}
                className="px-4 py-3 text-blue-900 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors duration-200 font-semibold"
              >
                Logout
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button onClick={() => setOpen(prev => !prev)} aria-label="Menu" className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-[70px] left-0 w-full bg-white shadow-xl border-t border-gray-200 py-6 flex flex-col items-start gap-4 px-6 text-base sm:hidden z-50">
          <NavLink to="/" onClick={() => setOpen(false)} className="text-blue-900 hover:text-[--color-primary] transition-colors duration-200 py-2">Home</NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)} className="text-blue-900 hover:text-[--color-primary] transition-colors duration-200 py-2">About</NavLink>
          <NavLink to="/childcare" onClick={() => setOpen(false)} className="text-blue-900 hover:text-[--color-primary] transition-colors duration-200 py-2">Childcare</NavLink>
          <NavLink to="/elderlycare" onClick={() => setOpen(false)} className="text-blue-900 hover:text-[--color-primary] transition-colors duration-200 py-2">Elderly Care</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)} className="text-blue-900 hover:text-[--color-primary] transition-colors duration-200 py-2">Contact</NavLink>

          {/* Mobile Login/Logout */}
          {!user ? (
            <button
              onClick={() => { setOpen(false); navigate("/login"); }}
              className="w-full text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white font-semibold rounded-full shadow-md mt-4"
            >
              Login
            </button>
          ) : (
            <>
              {role === "careseeker" && (
                <>
                  <NavLink to="/my-bookings" onClick={() => setOpen(false)} className="text-blue-900 hover:text-[--color-primary] transition-colors duration-200 py-2">My Bookings</NavLink>
                  <NavLink to="/reviews" onClick={() => setOpen(false)} className="text-blue-900 hover:text-[--color-primary] transition-colors duration-200 py-2">Reviews</NavLink>
                </>
              )}
              {role === "careprovider" && (
                <>
                  <NavLink to="/profile" onClick={() => setOpen(false)} className="text-blue-900 hover:text-[--color-primary] transition-colors duration-200 py-2">Profile</NavLink>
                  <NavLink to="/reviews" onClick={() => setOpen(false)} className="text-blue-900 hover:text-[--color-primary] transition-colors duration-200 py-2">Reviews</NavLink>
                </>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-center px-6 py-3 bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white font-semibold rounded-full shadow-md mt-4"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;