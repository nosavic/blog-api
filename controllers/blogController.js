const Blog = require("../models/Blog");
const User = require("../models/User");
const calculateReadingTime = require("../utils/calculateReadingTime");

exports.createBlog = async (req, res) => {
  try {
    const blog = new Blog({
      ...req.body,
      author: req.user.id,
      reading_time: calculateReadingTime(req.body.body),
    });
    await blog.save();

    res.status(201).json({
      message: "Blog created successfully!",
      blog,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      state,
      search,
      sortBy = "timestamp",
    } = req.query;

    let filter = {};
    if (state) {
      filter.state = state;
    }

    if (search) {
      filter = {
        ...filter,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ],
      };

      const nameParts = search.split(" ");
      if (nameParts.length === 2) {
        const [firstName, lastName] = nameParts;

        const authorFilter = await User.find({
          $or: [
            { first_name: { $regex: firstName, $options: "i" } },
            { last_name: { $regex: lastName, $options: "i" } },
          ],
        }).select("_id");

        if (authorFilter && authorFilter.length > 0) {
          const authorIds = authorFilter.map((author) => author._id);
          filter.$or.push({ author: { $in: authorIds } });
        }
      } else {
        const authorFilter = await User.find({
          $or: [
            { first_name: { $regex: search, $options: "i" } },
            { last_name: { $regex: search, $options: "i" } },
          ],
        }).select("_id");

        if (authorFilter && authorFilter.length > 0) {
          const authorIds = authorFilter.map((author) => author._id);
          filter.$or.push({ author: { $in: authorIds } });
        }
      }
    }

    const blogs = await Blog.find(filter)
      .sort({ [sortBy]: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate({
        path: "author",
        select: "first_name last_name",
      });

    const totalBlogs = await Blog.countDocuments(filter);

    res.status(200).json({
      blogs,
      totalBlogs,
      totalPages: Math.ceil(totalBlogs / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }

    const blog = await Blog.findById(id).populate(
      "author",
      "first_name last_name"
    );

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    blog.read_count += 1;
    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBlogByUserId = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID not found in request" });
    }

    const blogs = await Blog.find({ author: req.user.id });

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ error: "No blogs found for this user" });
    }

    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error, please try again later" });
  }
};

exports.getBlogsByAuthorId = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID not found in request" });
    }

    const blogs = await Blog.find({ author: req.user.id });

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ error: "No blogs found for this user" });
    }

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Server error, please try again later" });
  }
};

exports.getBlogsByAuthorName = async (req, res) => {
  try {
    const nameParts = name.split(" ");

    const regexFirstName = new RegExp(nameParts[0], "i");
    const regexLastName = nameParts[1] ? new RegExp(nameParts[1], "i") : null;

    const blogs = await Blog.find()
      .populate({
        path: "author",
        match: {
          $and: [
            { first_name: { $regex: regexFirstName } },
            {
              last_name: regexLastName
                ? { $regex: regexLastName }
                : { $exists: true },
            },
          ],
        },
        select: "first_name last_name",
      })
      .exec();

    const filteredBlogs = blogs.filter((blog) => blog.author);

    if (filteredBlogs.length === 0) {
      return res.status(404).json({ error: "No blogs found for this author" });
    }

    res.status(200).json(filteredBlogs);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Server error, please try again later" });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this blog" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, reading_time: calculateReadingTime(req.body.body) },
      { new: true }
    );

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
