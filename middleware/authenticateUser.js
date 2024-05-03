const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next();
  }
  const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;
  try {
    const decoded = jwt.verify(token, JWT_PUBLIC_KEY, {
      algorithms: ['RS256'],
    });
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
    };
    return next();
  } catch (err) {
    console.error(err.response);
    return next();
  }
};

module.exports = authenticateUser;
