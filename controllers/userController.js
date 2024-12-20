const generateToken = require("../utils/generateToken");

const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Use generateToken to create the token
    const token = generateToken({ id: user._id });

    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
