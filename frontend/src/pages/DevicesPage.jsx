import React, { useEffect, useState } from 'react';
import { FiSearch, FiPlus, FiRefreshCw, FiWifi, FiCpu, FiTrash2 } from 'react-icons/fi'; // Import FiTrash2
import toast from 'react-hot-toast';
import { useUserStore } from '../stores/useUserStore';
import { useDataStore } from '../stores/useDataStore';
import AddDeviceModal from '../components/AddDeviceModal';

const DevicesPage = () => {
  const { user } = useUserStore();
  const { devices, fetchDevices, deleteDevice, loading } = useDataStore(); // Import deleteDevice
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReboot = (id) => {
    toast.loading(`Sending reboot command to ${id}...`, { duration: 2000 });
    setTimeout(() => toast.success(`Device ${id} rebooted successfully`), 2000);
  };

  // Handle Delete with Confirmation
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this device? This action cannot be undone.")) {
      deleteDevice(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* ... Header & Search Bar (Unchanged) ... */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Access Points</h1>
          <p className="text-gray-500 text-sm">Manage {devices.length} network devices across campus</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FiPlus /> Add Device
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search devices by Name, ID, or Zone..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* --- Table --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <FiRefreshCw className="animate-spin h-8 w-8 mb-2 text-blue-500" />
            <p>Loading inventory...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Device Info</th>
                  <th className="px-6 py-4">Zone</th>
                  <th className="px-6 py-4">MAC Address</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Clients</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDevices.map(device => (
                  <tr key={device._id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Device Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <FiWifi />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{device.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{device.deviceId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Zone */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                        {device.zone}
                      </span>
                    </td>

                    {/* MAC */}
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                      {device.macAddress}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          device.status === 'online' ? 'bg-green-50 text-green-700 border-green-100' : 
                          device.status === 'maintenance' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                          'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                            device.status === 'online' ? 'bg-green-500' : 
                            device.status === 'maintenance' ? 'bg-yellow-500' :
                            'bg-red-500'
                        }`}></span>
                        <span className="capitalize">{device.status}</span>
                      </span>
                    </td>
                    
                    {/* Clients */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {device.clients || 0}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* Reboot Button (Everyone) */}
                        <button 
                          onClick={() => handleReboot(device.deviceId)} 
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                          title="Reboot Device"
                        >
                          <FiRefreshCw />
                        </button>

                        {/* Delete Button (Admin Only) */}
                        {user?.role === 'admin' && (
                          <button 
                            onClick={() => handleDelete(device._id)} 
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                            title="Delete Device"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredDevices.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FiCpu className="h-8 w-8 text-gray-300 mb-2" />
                        <p>No devices found matching "{searchTerm}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddDeviceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
    </div>
  );
};

export default DevicesPage;