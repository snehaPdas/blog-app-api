const bcrypt = require("bcryptjs");
const User = require('../Model/userModel');
const { generateAccessToken } = require("../utils/jwtService");

const loginData = async (req, res) => {
  console.log("Reached at author login");
  const { email, password } = req.body;
  console.log("Email:", email, "Password:", password);

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the author exists
    const author = await User.findOne({ email });
    console.log("Author found:", author);

    if (!author) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, author.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: author._id,
      role: author.role,
    };

    const accessToken = generateAccessToken(payload);
    // const refreshToken = generateRefreshToken(payload);

    

    res.status(200).json({
      message: "Login successful",
      author: {
        id: author._id,
        name: author.name,
        email: author.email,
      },
      token: accessToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const signupData = async (req, res) => {
  console.log("yeeeeesssssss");
  const { name, email, password, confirmPassword, role } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const author = new User({ name, email, password: hashedPassword, role });
    await author.save();

    res.status(201).json({
      message: "User registered successfully",
      author: {
        id: author._id,
        name: author.name,
        email: author.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signupData, loginData };
