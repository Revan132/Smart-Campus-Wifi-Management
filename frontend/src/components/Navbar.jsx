import React from 'react';
import { FiLogOut, FiBell } from 'react-icons/fi';
import { useUserStore } from '../stores/useUserStore';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm h-16 fixed w-full top-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <img 
          src="https://lnmiit.ac.in/wp-content/uploads/2023/07/cropped-LNMIIT-Logo-Transperant-Background-e1699342125845.png" 
          className="h-10 w-auto" 
          alt="LNMIIT Logo" 
        />
        <span className="text-xl font-bold text-gray-800 hidden md:block">
          {user?.role === 'admin' ? 'Wi-Fi Admin Portal' : 'Smart Campus Wi-Fi'}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/alerts')} 
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative"
          title="View Alerts"
        >
          <FiBell className="h-6 w-6" />
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-700">{user?.name}</p>
          <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <FiLogOut className="h-5 w-5" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;