const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    challenge: { type: String, required: true },
    response: { type: String }, // ✅ Store AI-generated response
}, { timestamps: true });

module.exports = mongoose.model("Challenge", challengeSchema);
