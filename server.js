// Load environment variables from .env file
require("dotenv").config();

// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");

// Import routes
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

// Initialize express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Log Database URI for debugging (optional, remove in production)
console.log("Database URI:", process.env.DB_URI);

// Connect to MongoDB using mongoose
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Database connection error:", error));

// Define routes with consistent prefixes
app.use("/api/users", userRoutes); // User routes
app.use("/api/blogs", blogRoutes); // Blog routes

// Define a welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the blogging API!");
});

// Handle 404 errors for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Export app for testing
module.exports = app;

// Start the server only if not in test mode
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
