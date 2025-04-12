const User = require("../Model/userModel");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwtService");

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user exists
    const reader = await User.findOne({ email });
    console.log("the readeris", reader);
    if (!reader) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, reader.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: reader._id,
      role: reader.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // setCookie(res, "user_access_token", accessToken);
    // setCookie(res, "user_refresh_token", refreshToken);

    res.status(200).json({
      message: "Login successful",
      reader: {
        id: reader._id,
        name: reader.name,
        email: reader.email,
      },
      token: accessToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const getAllUsers = async (req, res) => {
    // Fetch users with role 'reader' or 'author'
    const users = await User.find({ 
        role: { $in: ['reader', 'author'] }
    })
    .select('-password') // Exclude password from response
    .lean(); // Convert to plain JavaScript object for better performance

    if (!users || users.length === 0) {
        res.status(404);
        throw new Error('No users found');
    }

    res.status(200).json({
        success: true,
        count: users.length,
        users: users
    });
}


// @desc    Block a user
// @route   PUT /api/users/block/:id
// @access  Admin
const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Block the user
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been blocked`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Unblock a user
// @route   PUT /api/users/unblock/:id
// @access  Admin
const unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if user is already active
    if (user.isActive) {
      return res.status(400).json({ success: false, message: 'User is already active' });
    }

    // Unblock the user
    user.isActive = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been unblocked`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


module.exports = {
    adminLogin,
    getAllUsers,
    blockUser,
    unblockUser,
};
