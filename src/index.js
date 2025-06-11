import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./lib/connectDB.js";
import authRoutes from "./modules/auth/auth.router.js";

const app = express();
const Port = process.env.PORT || 4000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());
app.use("/api/v1/auth", authRoutes);

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
  connectDB();
});
