import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnect } from "./util/database.js";
import apiRoutes from "./routes/routes.api.js";
import { startSimulator } from "./util/simulator.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors({
    origin: 'https://wifi-management.netlify.app', 
    credentials: true
}));


app.use('/api', apiRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Base: https://smart-campus-wifi-management.onrender.com/api`);
    dbConnect();
    startSimulator();

});
