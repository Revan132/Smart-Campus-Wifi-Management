import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
    message: { type: String, required: true },
    severity: { 
        type: String, 
        enum: ['low', 'medium', 'high'],
        required: true 
    },
    zone: { type: String },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: 'active' }
});

const Alert = mongoose.model("Alert", alertSchema);
export default Alert;