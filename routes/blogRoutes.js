const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth"); // Authentication middleware
const { body, validationResult } = require("express-validator");
const {
  createBlog,
  getBlogs,
  getBlogById,
  getBlogByUserId,
  getBlogsByAuthorId,
  getBlogsByAuthorName,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

// Validation middleware for creating a blog
const validateCreateBlog = [
  body("title").notEmpty().withMessage("Title is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Define blog routes
router.post("/", authenticate, validateCreateBlog, createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.get("/user", authenticate, getBlogByUserId);
router.get("/author/:id", getBlogsByAuthorId);
router.get("/authorName/:name", getBlogsByAuthorName);
router.put("/:id", authenticate, updateBlog);
router.delete("/:id", authenticate, deleteBlog);

module.exports = router;
