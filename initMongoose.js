const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

global.mongoose = mongoose;

mongoose
  .connect(process.env.DB_URI, {
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
