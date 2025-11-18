import React, { useState } from 'react';
import { FiArrowRight, FiLoader, FiAlertCircle } from 'react-icons/fi'; 
import { useUserStore } from '../stores/useUserStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // CHANGED: 'email' -> 'username'
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { loading, login } = useUserStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Pass formData correctly (contains username, password)
    const success = await login(formData);
    if (success) navigate("/");
  };

  return (
    
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4]">
        
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Network Portal</h1>
          <p className="text-gray-500 text-sm mt-2">Sign in to manage campus Wi-Fi</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="admin or engineer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 disabled:bg-blue-400 transition-colors"
          >
            {loading ? <><FiLoader className="animate-spin" /> Authenticating...</> : <><FiArrowRight /> Log in</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;