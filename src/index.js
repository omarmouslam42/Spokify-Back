import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./lib/connectDB.js";
import authRoutes from "./modules/auth/auth.router.js";
import transcriptionRoutes from "./modules/Transcription/Transcription.routes.js";
import serverlessHttp from "serverless-http";
const app = express();
connectDB();

const Port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


app.use("/api/v1/auth", authRoutes);
app.use("/api/", transcriptionRoutes);
export default serverlessHttp(app);

// app.listen(Port, () => { 
//   console.log(`Server is running on port ${Port}`);
//   connectDB();
// });
