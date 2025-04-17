const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // ✅ Add JWT for login
const userSchema = require("../Models/userSchema");

require('dotenv').config(); // ⚠️ Change this to an environment variable in production

// 🚀 **Signup Route**
router.post("/add", async (req, res) => {
    try {
        const { name, email, password, phonenumber } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Fill all required fields to add a user" });
        }

        // Check if user exists
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already in use" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save new user
        const newUser = new userSchema({ name, email, password: hashedPassword, phonenumber });
        await newUser.save();

        return res.status(201).json({ msg: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error", error });
    }
});

// 🚀 **Login Route**
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Please provide email and password" });
        }

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({ msg: "Login successful", token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error", error });
    }
});

// 🚀 **Get Users List**
router.get("/userlist", async (req, res) => {
    try {
        const userData = await userSchema.find();
        return res.status(200).json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error", error });
    }
});


// 🚀 **Update User**
router.put('/update/:id', async(req, res) => {
    try {
        const { name, email, password, phonenumber } = req.body;
        const userId = req.params.id;

        let dataUpdate = { name, phonenumber };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            dataUpdate.password = await bcrypt.hash(password, salt);
        }

        const userUpdate = await userSchema.findByIdAndUpdate(userId, dataUpdate, { new: true });

        if (!userUpdate) {
            return res.status(400).json({ msg: "User not found" });
        }

        return res.status(200).json({ msg: "User Updated successfully", userUpdate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// 🚀 **Delete User**
router.delete("/delete/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        const userDelete = await userSchema.findByIdAndDelete(userId);

        if (!userDelete) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({ msg: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error", error });
    }
});

module.exports = router;
