const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB (Fixed SSL/TLS Issue)
mongoose.connect(process.env.MONGO_URI, { 
    tls: true,  // Enforce TLS connection
    serverSelectionTimeoutMS: 5000,  // Timeout after 5s if no connection
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ======================= SCHEMAS & MODELS =======================
// 🔹 User Schema & Model
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

// 🔹 Joke Schema & Model
const jokeSchema = new mongoose.Schema({
  text: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null } // Null for default jokes
});
const Joke = mongoose.model("Joke", jokeSchema);

// ======================= AUTH MIDDLEWARE =======================
// 🔹 Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.userId = decoded.id;
    next();
  });
};

// ======================= AUTH ROUTES =======================
// 🔹 Register User
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Login User
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================= JOKE ROUTES =======================
// 🔹 Get a random joke
app.get("/api/jokes/random", async (req, res) => {
  try {
    const jokes = await Joke.find();
    if (jokes.length === 0) return res.json({ text: "No jokes available!" });
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    res.json(randomJoke);
  } catch (error) {
    console.error("❌ Fetch Random Joke Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Get all jokes
app.get("/api/jokes", async (req, res) => {
  try {
    const jokes = await Joke.find();
    res.json(jokes);
  } catch (error) {
    console.error("❌ Fetch Jokes Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Get user-added jokes (Requires Authentication)
app.get("/api/jokes/user-added", verifyToken, async (req, res) => {
  try {
    const jokes = await Joke.find({ userId: req.userId });
    res.json(jokes);
  } catch (error) {
    console.error("❌ Fetch User Jokes Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Add a new joke (Requires Authentication)
app.post("/api/jokes", verifyToken, async (req, res) => {
  try {
    const newJoke = new Joke({ text: req.body.text, userId: req.userId });
    await newJoke.save();
    res.json(newJoke);
  } catch (error) {
    console.error("❌ Add Joke Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Delete a joke (Requires Authentication)
app.delete("/api/jokes/:id", verifyToken, async (req, res) => {
  try {
    const joke = await Joke.findById(req.params.id);
    if (!joke) return res.status(404).json({ message: "Joke not found" });

    if (joke.userId && joke.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized to delete this joke" });
    }

    await Joke.findByIdAndDelete(req.params.id);
    res.json({ message: "Joke deleted" });
  } catch (error) {
    console.error("❌ Delete Joke Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Update a joke (Requires Authentication)
app.put("/api/jokes/:id", verifyToken, async (req, res) => {
  try {
    const joke = await Joke.findById(req.params.id);
    if (!joke) return res.status(404).json({ message: "Joke not found" });

    if (joke.userId && joke.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized to update this joke" });
    }

    joke.text = req.body.text;
    await joke.save();
    res.json(joke);
  } catch (error) {
    console.error("❌ Update Joke Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================= START SERVER =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
