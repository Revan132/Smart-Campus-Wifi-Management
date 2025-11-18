import React, { useState } from 'react';
import { FiX, FiSave, FiLoader, FiUser, FiLock } from 'react-icons/fi';
import { useDataStore } from '../stores/useDataStore';

const CreateUserModal = ({ isOpen, onClose }) => {
  const { createUser } = useDataStore();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'engineer' // Default role
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await createUser(formData);
    
    setLoading(false);
    if (success) {
      setFormData({ username: '', password: '', role: 'engineer' });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-md flex items-center justify-center z-50 transition-all">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Create New User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                type="text" 
                required 
                placeholder="e.g. john_doe"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="engineer">Network Engineer</option>
              <option value="admin">Administrator</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
                Admins have full access. Engineers can only view and monitor.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-400 transition-colors shadow-sm"
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
              Create User
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;