import { create } from "zustand";
import axiosInstance from "../util/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user")) || null, 
    loading: false,

    login: async ({ username, password }) => {
        set({ loading: true });

        try {
            // Send username/password to backend
            const res = await axiosInstance.post("/login", { username, password });
            
            // 1. Save Token & User to LocalStorage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.data));

            // 2. Update State
            set({ loading: false, user: res.data.data });
            toast.success("Logged in successfully");
            return true;

        } catch (error) {
            set({ loading: false });
            const message = error.response?.data?.message || "Login failed";
            toast.error(message);
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ user: null });
        toast.success("Logged out");
    }

}));
