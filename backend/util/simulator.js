import cron from "node-cron";
import Device from "../models/Device.js";
import TrafficLog from "../models/TrafficLog.js";
import Alert from "../models/Alert.js";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const startSimulator = () => {
    console.log("Traffic Simulator Started");

 
    cron.schedule("*/5 * * * * *", async () => {
        try {
            const devices = await Device.find();
            
            if (devices.length === 0) return;

            let totalUsers = 0;

    
            for (const device of devices) {
                if (device.status === 'online') {
                    const change = randomInt(-2, 3);
                    let newCount = (device.clients || 0) + change;
                    
                    if (newCount < 0) newCount = 0;
                    if (newCount > 150) newCount = 150;

                    device.clients = newCount;
                    await device.save();
                    totalUsers += newCount;
                }
            }
            
            const baseLoad = totalUsers > 0 ? (totalUsers * 3.5) : 5; 
            const bandwidth = baseLoad + randomInt(-5, 10);
            
            await TrafficLog.create({
                totalBandwidth: Math.max(0, bandwidth),
                activeUsers: totalUsers
            });



         
            const count = await TrafficLog.countDocuments();
            if (count > 50) {
                const oldLogs = await TrafficLog.find().sort({ timestamp: 1 }).limit(count - 50);
                oldLogs.forEach(async log => await TrafficLog.findByIdAndDelete(log._id));
            }

        } catch (error) {
            console.error("Simulator Error:", error.message);
        }
    });

 
    cron.schedule("*/60 * * * * *", async () => {
        
        if (Math.random() > 0.7) { 
            const zones = ["Library", "Hostel", "Academic"];
            const msgs = ["High Latency", "Packet Loss", "Interference"];
            
            await Alert.create({
                message: `${msgs[randomInt(0,2)]} detected in ${zones[randomInt(0,2)]}`,
                severity: Math.random() > 0.8 ? "high" : "medium",
                zone: zones[randomInt(0,2)],
                status: "active"
            });
            console.log(" Simulated Alert Generated");
        }
    });
};