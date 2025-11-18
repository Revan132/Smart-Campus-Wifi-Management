import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    deviceId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    zone: { type: String, required: true },
    macAddress: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['online', 'offline', 'maintenance'], 
        default: 'offline' 
    },
    clients: { type: Number, default: 0 }
}, { timestamps: true });

const Device = mongoose.model("Device", deviceSchema);
export default Device;