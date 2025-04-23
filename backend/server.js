require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const entityRoutes = require('./routes/entities');
const { authenticateDatabase } = require('./config/mysql');
// Import associations to ensure they're set up
require('./Models/associations');

const app = express();
const PORT = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
app.use(cookieParser());


// ✅ Allow CORS & JSON Parsing
// CORS setup (if using CORS middleware)
app.use(cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true
  }));
  
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MongoDB_URI, {})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection failed", err));

    authenticateDatabase();

// ✅ Import & Use Routes
const userRouter = require("./routes/userRouter");
const challengeRouter = require("./routes/ChallengeRouter");
app.use("/users", userRouter); // This registers the "/users" route
app.use("/api", entityRoutes);
app.use("/api/challenges", challengeRouter);

// ✅ Test Route
app.get("/ping", (req, res) => res.send("pong"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
