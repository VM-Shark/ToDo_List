const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const tasksRouter = require("./routes/tasks");
// Import only the router property
const { router: authRouter } = require("./routes/auth"); 
const path = require("path"); 

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/tasks", tasksRouter);
app.use("/auth", authRouter);

// Serve login and register pages
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/login.html"));
});

app.get("/register.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/register.html"));
});

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/login.html"));
});

// Middleware to serve static files
app.use(express.static("public"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Connecting to MongoDB
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Starting the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});