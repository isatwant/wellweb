require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const Task = require("./models/Task");

const app = express();

console.log("__dirname:", __dirname);
console.log("public path:", path.join(__dirname, "public"));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Missing MONGO_URI in environment. Set it in .env or the environment variables.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Serve the frontend
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "public", "index.html");
  console.log("Serving:", filePath);
  res.send("NEW RESPONSE");
});

// CRUD routes for tasks
app.post("/tasks", async (req, res) => {
  try {
    const { title, description, completed, priority } = req.body;
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Title is required and must be a string." });
    }

    const task = await Task.create({ title, description, completed, priority });
    return res.status(201).json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create task." });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch tasks." });
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch task." });
  }
});

app.patch("/tasks/:id", async (req, res) => {
  try {
    const updates = req.body;
    if (updates.title && typeof updates.title !== "string") {
      return res.status(400).json({ error: "Title must be a string." });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update task." });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    return res.json({ message: "Task deleted." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete task." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});