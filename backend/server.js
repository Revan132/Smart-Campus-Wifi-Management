import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnect } from "./util/database.js";
import apiRoutes from "./routes/routes.api.js";
import { startSimulator } from "./util/simulator.js";
import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // React Frontend URL
    credentials: true
}));

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}



app.use('/api', apiRoutes);

// Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Base: http://localhost:${PORT}/api`);
    dbConnect();
    startSimulator();
});