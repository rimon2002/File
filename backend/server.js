// server.js (ES Module style)
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", fileRoutes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ Mongo Error:", err));
