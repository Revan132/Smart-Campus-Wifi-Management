import mongoose from "mongoose";

const trafficLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    totalBandwidth: { type: Number, required: true }, // Mbps
    activeUsers: { type: Number, required: true }
});

const TrafficLog = mongoose.model("TrafficLog", trafficLogSchema);
export default TrafficLog;