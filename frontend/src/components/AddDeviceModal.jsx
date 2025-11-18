import React, { useState } from 'react';
import { FiX, FiSave, FiLoader, FiAlertCircle } from 'react-icons/fi'; // Added Alert Icon
import { useDataStore } from '../stores/useDataStore';

const AddDeviceModal = ({ isOpen, onClose }) => {
  const { addDevice } = useDataStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Error State
  
  const [formData, setFormData] = useState({
    deviceId: '',
    name: '',
    zone: 'Library',
    macAddress: '',
    status: 'offline'
  });

  // MAC Address Regex (XX:XX:XX:XX:XX:XX)
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // 1. Validate MAC Address Format
    if (!macRegex.test(formData.macAddress)) {
      setError("Invalid MAC Address. Format: 00:1A:2B:3C:4D:5E");
      return;
    }

    setLoading(true);
    
    const success = await addDevice(formData);
    
    setLoading(false);
    if (success) {
      setFormData({ deviceId: '', name: '', zone: 'Library', macAddress: '', status: 'offline' });
      onClose();
    } else {
      setError("Failed to add device. ID might be duplicate.");
    }
  };

  // Clear error when user types to improve UX
  const handleChange = (key, value) => {
    setError('');
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-md flex items-center justify-center z-50 transition-all">
      
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
        
        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Add New Access Point</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <FiX size={24} />
          </button>
        </div>

        {/* Error Message Banner */}
        {error && (
          <div className="bg-red-50 text-red-600 px-6 py-3 text-sm flex items-center gap-2 border-b border-red-100">
            <FiAlertCircle />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Device ID</label>
            <input 
              type="text" 
              required 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.deviceId}
              onChange={(e) => handleChange('deviceId', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Device Name</label>
            <input 
              type="text" 
              required 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
              <select 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                value={formData.zone}
                onChange={(e) => handleChange('zone', e.target.value)}
              >
                <option value="Library">Library</option>
                <option value="Hostel">Hostel</option>
                <option value="Academic">Academic</option>
                <option value="Admin">Admin Block</option>
                <option value="Common Area">Common Area</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
              <select 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MAC Address</label>
            <input 
              type="text" 
              required 
              placeholder="00:1A:2B:3C:4D:5E"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none font-mono text-sm transition-all ${
                error.includes('MAC') ? 'border-red-300 focus:ring-red-200' : 'focus:ring-blue-500'
              }`}
              value={formData.macAddress}
              onChange={(e) => handleChange('macAddress', e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">Format: XX:XX:XX:XX:XX:XX (Hex)</p>
          </div>

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
              Save Device
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddDeviceModal;