require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow CORS & JSON Parsing
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MongoDB_URI, {})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection failed", err));



// ✅ Import & Use Routes
const userRouter = require("./routes/userRouter");
const challengeRouter = require("./routes/ChallengeRouter");
app.use("/users", userRouter); // This registers the "/users" route

app.use("/api/challenges", challengeRouter);

// ✅ Test Route
app.get("/ping", (req, res) => res.send("pong"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
