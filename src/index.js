import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./lib/connectDB.js";
import authRoutes from "./modules/auth/auth.router.js";
import transcriptionRoutes from "./modules/Transcription/Transcription.routes.js";
import serverlessHttp from "serverless-http";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
// connectDB();
const Port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/test", (req, res) => {
  res.send("✅ Route works");
});
app.get("/", (req, res) => {
  res.send("🚀 Spokify backend is running.");
});
app.get("/favicon.ico", (req, res) => res.status(204).end());

app.use("/api/v1/auth", authRoutes);
app.use("/api/", transcriptionRoutes);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تقديم مجلد public كـ static
app.use("/audio", express.static(path.join(__dirname, "../public")));
// export default serverlessHttp(app);


app.listen(Port, () => { 
  console.log(`Server is running on port ${Port}`);
  connectDB();
});
