const jwt = require('jsonwebtoken');

const generateJwtToken = (payload) => {
  const privateKey = process.env.JWT_PRIVATE_KEY;

  const token = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    // expiresIn: '1d',
  });

  return token;
};

module.exports = generateJwtToken;
