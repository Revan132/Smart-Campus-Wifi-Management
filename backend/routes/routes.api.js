import express from "express";
import { login } from "../controllers/Login.js";
import { getDevices, addDevice, getAlerts, getUsers, deleteDevice,deleteUser, createUser,getTrafficHistory} from "../controllers/DataController.js"; // Import getUsers
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public
router.post("/login", login);

// Protected (Logged in users)
router.get("/devices", verifyToken, getDevices);
router.get("/alerts", verifyToken, getAlerts);
router.get("/analytics/traffic", verifyToken, getTrafficHistory);

// Admin Only (Logged in + Admin Role)
router.post("/devices", verifyToken, verifyAdmin, addDevice);
router.get("/users", verifyToken, verifyAdmin, getUsers); 
router.delete("/devices/:id", verifyToken, verifyAdmin, deleteDevice);
router.delete("/users/:id", verifyToken, verifyAdmin, deleteUser);
router.post("/users", verifyToken, verifyAdmin, createUser);

export default router;