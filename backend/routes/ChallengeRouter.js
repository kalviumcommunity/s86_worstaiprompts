const express = require("express");
const router = express.Router();
const Challenge = require("../models/ChallengeSchema"); // Make sure this is correct

// ✅ POST route to add a challenge
router.post("/", async (req, res) => {
  try {
    const { title, challenge } = req.body;
    
    if (!title || !challenge) {
      return res.status(400).json({ error: "Title and Challenge text are required" });
    }

    const newChallenge = new Challenge({ title, challenge });
    await newChallenge.save();
    
    res.status(201).json(newChallenge);
  } catch (error) {
    console.error("Error saving challenge:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ GET route to fetch challenges
router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch challenges" });
  }
});

router.delete("/:id", async (req, res) => {
    try {
      const deletedChallenge = await Challenge.findByIdAndDelete(req.params.id);
      if (!deletedChallenge) return res.status(404).json({ message: "Challenge not found" });
      res.json({ message: "Challenge deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
