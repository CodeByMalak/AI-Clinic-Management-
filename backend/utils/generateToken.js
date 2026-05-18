const jwt = require('jsonwebtoken');

/**
 * Generate a cryptographically secure JWT session token for authenticated users
 * @param {string} id - The MongoDB user document ID
 * @returns {string} Signed JWT Token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'mediflow_ai_jwt_secret_token_key_2026_clinic',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

module.exports = generateToken;
