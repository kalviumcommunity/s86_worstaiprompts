const mongoose = require("mongoose");
const User = require('./userSchema')

const challengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    challenge: { type: String, required: true },
    response: { type: String }, // ✅ Store AI-generated response
    createdBy:{type:mongoose.Schema.ObjectId,ref:'User'}
}, { timestamps: true });

module.exports = mongoose.model("Challenge", challengeSchema);
