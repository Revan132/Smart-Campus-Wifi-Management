import React from 'react';
import { Outlet } from 'react-router-dom';
import  Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Top Header (Fixed) */}
      <Navbar />

      {/* 2. Sidebar (Fixed, below header) */}
      <Sidebar />

      {/* 3. Page Content (Pushed right and down) */}
      <main className="pt-16 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;