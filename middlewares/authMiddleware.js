const { verifyAccessToken } = require("../utils/jwtService");

const veryfyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing." });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

    const decoded = verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token Expired" });
  }
};

module.exports = { veryfyToken };
