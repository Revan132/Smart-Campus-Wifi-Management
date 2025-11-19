import { create } from "zustand";
import axiosInstance from "../util/axios";
import { toast } from "react-hot-toast";

export const useDataStore = create((set) => ({
    devices: [],
    alerts: [],
    users: [],
    loading: false,
    trafficLogs: [],

    // Fetch Access Points
    fetchDevices: async () => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/devices");
            set({ devices: res.data.data, loading: false });
        } catch (error) {
            console.error("Failed to fetch devices:", error);
            set({ loading: false });
            
        }
    },

    // Fetch Alerts
    fetchAlerts: async () => {
        try {
            const res = await axiosInstance.get("/alerts");
            set({ alerts: res.data.data });
        } catch (error) {
            console.error("Failed to fetch alerts:", error);
        }
    },

    // Add Device (Admin Only)
    addDevice: async (deviceData) => {
        try {
            const res = await axiosInstance.post("/devices", deviceData);
            set((state) => ({ devices: [...state.devices, res.data.data] }));
            toast.success("Device added successfully");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add device");
            return false;
        }
    },

    fetchUsers: async () => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/users");
            set({ users: res.data.data, loading: false });
        } catch (error) {
            console.error("Failed to fetch users:", error);
            set({ loading: false });
            toast.error("Failed to load user list");
        }
    },

    deleteDevice: async (id) => {
        try {
            await axiosInstance.delete(`/devices/${id}`);
            
          
            set((state) => ({
                devices: state.devices.filter((device) => device._id !== id)
            }));
            
            toast.success("Device removed successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to delete device");
        }
    },
    deleteUser: async (id) => {
        try {
            await axiosInstance.delete(`/users/${id}`);
            
          
            set((state) => ({
                users: state.users.filter((u) => u._id !== id)
            }));
            
            toast.success("User deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to delete user");
        }
    },

    createUser: async (userData) => {
        try {
            const res = await axiosInstance.post("/users", userData);
            
           
            set((state) => ({
                users: [res.data.data, ...state.users]
            }));
            
            toast.success("User created successfully");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create user");
            return false;
        }
    },
    
    fetchTrafficLogs: async () => {
        try {
            const res = await axiosInstance.get("/analytics/traffic");
            set({ trafficLogs: res.data.data });
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }




}));
