const express = require('express');
const passport = require('passport');
const router = express.Router();

const { generateTokens, storeRefreshToken, verifyRefreshToken, removeRefreshToken } = require('../utils/jwt');
const User = require('../models/User');

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_failed` }),
  async (req, res) => {
    try {
      const { accessToken, refreshToken } = generateTokens(req.user);
      await storeRefreshToken(req.user._id.toString(), refreshToken);

      // Update last login
      await User.findByIdAndUpdate(req.user._id, { lastLogin: new Date() });

      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${accessToken}&refreshToken=${refreshToken}`);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=token_generation_failed`);
    }
  }
);

// Facebook OAuth routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=facebook_failed` }),
  async (req, res) => {
    try {
      const { accessToken, refreshToken } = generateTokens(req.user);
      await storeRefreshToken(req.user._id.toString(), refreshToken);

      await User.findByIdAndUpdate(req.user._id, { lastLogin: new Date() });

      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${accessToken}&refreshToken=${refreshToken}`);
    } catch (error) {
      console.error('Facebook callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=token_generation_failed`);
    }
  }
);

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=github_failed` }),
  async (req, res) => {
    try {
      const { accessToken, refreshToken } = generateTokens(req.user);
      await storeRefreshToken(req.user._id.toString(), refreshToken);

      await User.findByIdAndUpdate(req.user._id, { lastLogin: new Date() });

      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${accessToken}&refreshToken=${refreshToken}`);
    } catch (error) {
      console.error('GitHub callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=token_generation_failed`);
    }
  }
);

// LinkedIn OAuth routes
router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=linkedin_failed` }),
  async (req, res) => {
    try {
      const { accessToken, refreshToken } = generateTokens(req.user);
      await storeRefreshToken(req.user._id.toString(), refreshToken);

      await User.findByIdAndUpdate(req.user._id, { lastLogin: new Date() });

      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${accessToken}&refreshToken=${refreshToken}`);
    } catch (error) {
      console.error('LinkedIn callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=token_generation_failed`);
    }
  }
);

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    // Decode token to get user ID
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(refreshToken);
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Verify refresh token
    const isValid = await verifyRefreshToken(decoded.id, refreshToken);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    // Get user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user);
    await storeRefreshToken(user._id.toString(), newRefreshToken);

    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Error refreshing token',
      error: error.message,
    });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.decode(refreshToken);
      
      if (decoded && decoded.id) {
        await removeRefreshToken(decoded.id);
      }
    }

    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error logging out',
          error: err.message,
        });
      }

      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Error destroying session',
            error: err.message,
          });
        }

        res.json({
          success: true,
          message: 'Logged out successfully',
        });
      });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out',
      error: error.message,
    });
  }
});

module.exports = router;
