const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

 const generateAccessToken = (user) => {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "30d",
    });
    return token;
}

 const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

 const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "30d",
    });
    return refreshToken;
}

 const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

module.exports = { generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken };