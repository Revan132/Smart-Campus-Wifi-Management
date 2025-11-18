import React, { useEffect, useState } from 'react';
import { FiUser, FiShield, FiTrash2, FiPlus } from 'react-icons/fi'; // Removed FiClock
import { useDataStore } from '../stores/useDataStore';
import { useUserStore } from '../stores/useUserStore';
import toast from 'react-hot-toast';
import CreateUserModal from '../components/CreateUserModal';

const UsersPage = () => {
  const { users, fetchUsers, deleteUser, loading } = useDataStore();
  const { user: currentUser } = useUserStore(); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = (id, username) => {
    if (currentUser?.username === username) {
      toast.error("You cannot delete your own account.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      deleteUser(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500">Manage system access and roles</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
            <FiPlus /> Create User
        </button>
      </div>

      {/* --- Users Table --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
           <div className="p-12 text-center text-gray-500">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">User Identity</th>
                  <th className="px-6 py-4">Role</th>
                  {/* Removed 'Created At' Header */}
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Identity */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                              <FiUser />
                          </div>
                          <div>
                              <div className="font-medium text-gray-900">{u.username}</div>
                              <div className="text-xs text-gray-400 font-mono">ID: {u._id.slice(-6)}</div>
                          </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                            u.role === 'admin' 
                              ? 'bg-purple-50 text-purple-700 border-purple-100' 
                              : 'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                            <FiShield className="h-3 w-3" /> 
                            <span className="capitalize">{u.role}</span>
                        </span>
                    </td>

                    {/* Removed 'Created At' Data Cell */}

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {currentUser?.username !== u.username ? (
                        <button 
                          onClick={() => handleDelete(u._id, u.username)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                          title="Remove User"
                        >
                          <FiTrash2 />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic pr-2">Current User</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && users.length === 0 && (
             <div className="p-10 text-center text-gray-500">No users found in database.</div>
        )}
      </div>

      <CreateUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </div>
  );
};

export default UsersPage;