import Device from "../models/Device.js";
import Alert from "../models/Alert.js";
import User from "../models/User.js";
import TrafficLog from "../models/TrafficLog.js";

export const getDevices = async (req, res) => {
    try {
        const devices = await Device.find();
        res.status(200).json({ success: true, data: devices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const addDevice = async (req, res) => {
    try {
        const newDevice = await Device.create(req.body);
        res.status(201).json({ success: true, data: newDevice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ timestamp: -1 });
        res.status(200).json({ success: true, data: alerts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteDevice = async (req, res) => {
    try {
        const { id } = req.params; 
        
        const deletedDevice = await Device.findByIdAndDelete(id);

        if (!deletedDevice) {
            return res.status(404).json({ success: false, message: "Device not found" });
        }

        res.status(200).json({ success: true, message: "Device deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
  

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        
        if (!username || !password || !role) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

    
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        const newUser = await User.create({
            username,
            password,
            role
        });


        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({ success: true, data: userResponse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTrafficHistory = async (req, res) => {
    try {
      
        const logs = await TrafficLog.find().sort({ timestamp: -1 }).limit(20);
        
       
        res.status(200).json({ success: true, data: logs.reverse() });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};