require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const pageRoutes = require("./routes/pageRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const userRoutes = require("./routes/userRoutes");
const cloudinaryRoutes = require("./routes/cloudinaryRoutes");
const app = express();
const PORT = process.env.PORT || 4000;
const courseRoutes = require("./routes/courseRoutes");
const paymentRoutes = require("./routes/orderRoute");
const promoCodeRoutes = require("./routes/promoCodeRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Parse JSON request body
app.use(cors()); // Enable CORS for frontend access
app.use(cors({
  origin: ['http://localhost:5173', 'https://cms-for-edu-1kac.vercel.app'], 
  credentials: true,
}));
process.env.TZ = "Asia/Calcutta";
// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// ✅ Routes
app.use("/api/pages", pageRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/promocodes", promoCodeRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
