import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();
const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Other middleware
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Server running successfully 🚀" });
});

app.post("/api/addUser", async (req, res) => {
  try {
    const { clerkId, email, name, role } = req.body;
    console.log("addUser called with:", { clerkId, email, name, role });

    let user = await User.findOne({ clerkId });
    if (!user) {
      user = new User({ clerkId, email, name, role });
      await user.save();
      return res.status(201).json({ message: "User created", user });
    }

    console.log("user exists");
    return res.status(200).json({ message: "User already exists", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));