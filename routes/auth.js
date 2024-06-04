const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// JWT token verification middleware
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ message: "Malformed token" });
    }

    jwt.verify(tokenParts[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.userId = decoded.id;
        next();
    });
}

// Register a new user
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({ username, password });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ message: err.message });
    }
});

// Login user
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log("Login attempt for username:", username); 

        const user = await User.findOne({ username });
        if (!user) {
            console.error("User not found:", username);
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch); 
        if (!isMatch) {
            console.error("Incorrect password for user:", username);
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ message: "An error occurred while logging in" });
    }
});

router.get("/users", async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "An error occured while fetching users"});
    }
});

router.post("/logout", verifyToken, async (req, res) => {
    try {
        

        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.error("Error logging out:", err);
        res.status(500).json({ message: "An error occurred while logging out" });
    }
});

// Protected route 
router.get("/protected-route", verifyToken, (req, res) => {
    res.json({ message: "Protected route accessed successfully" });
});

module.exports = {
    router,
    verifyToken
};