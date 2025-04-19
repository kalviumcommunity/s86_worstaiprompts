const express = require("express");
const router = express.Router();
const Challenge = require("../models/ChallengeSchema"); // Make sure this is correct
const auth=require('../middleware/tokenauth')

// ✅ POST route to add a challenge
router.post("/",auth, async (req, res) => {
  try {
    const { title, challenge } = req.body;
    
    if (!title || !challenge) {
      return res.status(400).json({ error: "Title and Challenge text are required" });
    }

    const newChallenge = new Challenge({ title, challenge,createdBy:req.user.userId });
    // console.log(req.user.userId,createdBy)
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
    const challenges = await Challenge.find()
    .populate('createdBy', 'name')
    .exec();
    res.status(200).json(challenges);
      
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id'),auth,async (req,res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
    Challenge.find({ createdBy: { $exists: true } }).populate('createdBy', 'name');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

router.get('/post/user/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const challenges = await Challenge.find({ createdBy: id }).populate('createdBy', 'name');
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/challenges', async (req, res) => {
  try {
    const challenges = await Challenge.find().populate('createdBy', 'name');
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
router.put("/:id", async (req, res) => {
    try {
      const updateChallenge = await Challenge.findByIdAndUpdate(req.params.id,req.body,{new:true});
      if (!updateChallenge) return res.status(404).json({ message: "Challenge not found" });
      res.json({ message: "Challenge updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;
