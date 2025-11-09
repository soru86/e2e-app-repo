const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-jwt-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '15m';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';

// Generate access and refresh tokens
const generateTokens = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRE,
  });

  return { accessToken, refreshToken };
};

// Store refresh token in Redis
const storeRefreshToken = async (userId, refreshToken) => {
  try {
    await redisClient.setEx(`refresh_token:${userId}`, 7 * 24 * 60 * 60, refreshToken);
  } catch (error) {
    console.error('Error storing refresh token:', error);
    throw error;
  }
};

// Verify refresh token from Redis
const verifyRefreshToken = async (userId, refreshToken) => {
  try {
    const storedToken = await redisClient.get(`refresh_token:${userId}`);
    if (!storedToken || storedToken !== refreshToken) {
      return false;
    }
    return jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  } catch (error) {
    console.error('Error verifying refresh token:', error);
    return false;
  }
};

// Remove refresh token from Redis
const removeRefreshToken = async (userId) => {
  try {
    await redisClient.del(`refresh_token:${userId}`);
  } catch (error) {
    console.error('Error removing refresh token:', error);
    throw error;
  }
};

// Verify access token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateTokens,
  storeRefreshToken,
  verifyRefreshToken,
  removeRefreshToken,
  verifyAccessToken,
};

