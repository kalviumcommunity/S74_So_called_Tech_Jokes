const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true, // Ensure TLS is enabled
  })
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ======================= SCHEMAS & MODELS =======================
// 🔹 User Schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

// 🔹 Joke Schema
const jokeSchema = new mongoose.Schema({
  text: { type: String, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Allows older jokes to be null
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Joke = mongoose.model("Joke", jokeSchema);

// ======================= AUTH MIDDLEWARE =======================
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
// 🔹 Get all jokes (Filter by User)
app.get("/api/jokes", async (req, res) => {
  try {
    const { userId } = req.query;
    let query = userId ? { created_by: userId } : {}; // Filter by user if selected

    const jokes = await Joke.find(query).populate("created_by", "username");

    // Ensure 'created_by' exists, otherwise, default to "Unknown"
    const formattedJokes = jokes.map((joke) => ({
      _id: joke._id,
      text: joke.text,
      created_by: joke.created_by ? joke.created_by.username : "Unknown",
      createdAt: joke.createdAt,
    }));

    res.json(formattedJokes);
  } catch (error) {
    console.error("❌ Fetch Jokes Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Get a random joke (Considering user filter)
app.get("/api/jokes/random", async (req, res) => {
  try {
    const { userId } = req.query;
    let query = userId ? { created_by: userId } : {}; // Filter by user if selected

    const jokes = await Joke.find(query).populate("created_by", "username");
    if (jokes.length === 0) return res.json({ text: "No jokes available!" });

    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

    res.json({
      text: randomJoke.text,
      created_by: randomJoke.created_by ? randomJoke.created_by.username : "Unknown",
    });
  } catch (error) {
    console.error("❌ Fetch Random Joke Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Add a new joke (Requires Authentication)
app.post("/api/jokes", verifyToken, async (req, res) => {
  try {
    const newJoke = new Joke({ text: req.body.text, created_by: req.userId });
    await newJoke.save();
    res.json(newJoke);
  } catch (error) {
    console.error("❌ Add Joke Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Get all users (For dropdown)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, "username");
    res.json(users);
  } catch (error) {
    console.error("❌ Fetch Users Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================= START SERVER =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
