import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiWifi, FiActivity, FiFileText, FiUsers } from 'react-icons/fi';
import { useUserStore } from '../stores/useUserStore';

const Sidebar = () => {
  const { user } = useUserStore(); 


  const navItems = [
    { name: 'Dashboard', path: '/', icon: <FiHome /> },
    { name: 'Access Points', path: '/devices', icon: <FiWifi /> }, 
    { name: 'Analytics', path: '/analytics', icon: <FiActivity /> },
    { name: 'Reports', path: '/reports', icon: <FiFileText /> }, 
  ];


  if (user?.role === 'admin') {
    navItems.push({ 
      name: 'Users', 
      path: '/users', 
      icon: <FiUsers /> 
    });
  }

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 fixed left-0 top-16 bottom-0 overflow-y-auto z-40">
      <div className="py-6 px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};


export default Sidebar;
