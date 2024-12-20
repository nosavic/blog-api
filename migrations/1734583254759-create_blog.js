const mongoose = require("mongoose");
require("dotenv").config();
const Blog = require("../models/Blog"); // Ensure the path is correct

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
});

/**
 * Apply the changes to the database schema (e.g., create indexes, add default values, etc.)
 */
async function up() {
  // Ensuring that the Blog model is ready
  const blogsCollection = mongoose.connection.collection("blogs");

  // Example: Add index for title (if not already present)
  await blogsCollection.createIndex({ title: 1 }, { unique: true });

  // Example: Add a new field to existing documents (if needed)
  // This is just a placeholder for applying data changes if necessary
  await Blog.updateMany(
    { publishedAt: { $exists: false } }, // Check if the field does not exist
    { $set: { publishedAt: null } } // Set a default value for existing documents
  );

  console.log("Blogs collection schema updated with necessary changes.");
}

/**
 * Undo the changes made in the up function (if needed)
 */
async function down() {
  // Example: Remove the index on title if added
  const blogsCollection = mongoose.connection.collection("blogs");
  await blogsCollection.dropIndex("title_1");

  console.log("Blogs collection index dropped.");
}

module.exports = { up, down };
