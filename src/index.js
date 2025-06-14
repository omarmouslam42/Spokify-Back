import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./lib/connectDB.js";
import authRoutes from "./modules/auth/auth.router.js";
import transcriptionRoutes from "./modules/Transcription/Transcription.routes.js";
import serverlessHttp from "serverless-http";

const app = express();
connectDB();                               // اتصال وحيد

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
  res.send("🚀 Spokify backend is running.");
});
app.get("/test", (_, res) => res.send("✅ Route works"));
app.get("/favicon.ico", (_, res) => res.status(204).end());

app.use("/api/v1/auth", authRoutes);
app.use("/api", transcriptionRoutes);       // لاحظ بدون "/" زائدة

export default serverlessHttp(app);         // default export مطلوب فى Vercel


// app.listen(Port, () => { 
//   console.log(`Server is running on port ${Port}`);
//   connectDB();
// });
