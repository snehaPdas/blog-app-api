const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwtService");
const { setCookie } = require("../utils/setCookie");
const User = require("../Model/userModel");


// Controller/authController.js
const loginData = async (req, res) => {
    const { email, password } = req.body
  
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      // Check if the user exists
      const reader = await User.findOne({ email });
      console.log("the readeris",reader)
      if (!reader) {
        return res.status(400).json({ message: "User not found" });
      }

      if(!reader.isActive) {
        return res.status(400).json({ message: "User is blocked" });
      }
   
      // Compare the entered password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, reader.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const payload = {
          id: reader._id,
          role: reader.role
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
  ///////////////////////////////

  

const signupData = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body.form;
  const role = req.body.role; 


  // Basic validation
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Check if the email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const reader = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Save the user to the database
    await reader.save();

    res.status(201).json({
      message: "User registered successfully",
      reader: {
        id: reader._id,
        name: reader.name,
        email: reader.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

  
  module.exports = {
    loginData,
    signupData
  };
  