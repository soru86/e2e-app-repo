const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User');
const { generateTokens } = require('../utils/jwt');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Update OAuth info if user exists
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        } else {
          // Create new user
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            avatar: profile.photos[0]?.value,
            provider: 'google',
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/api/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
        let user = await User.findOne({ email });

        if (user) {
          if (!user.facebookId) {
            user.facebookId = profile.id;
            await user.save();
          }
        } else {
          user = await User.create({
            facebookId: profile.id,
            email,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
            provider: 'facebook',
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// GitHub Strategy
// Note: GitHub requires additional API call to get email if not public
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/api/auth/github/callback',
      scope: ['user:email'], // Ensure email scope is requested
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // GitHub may return emails in profile.emails array
        // If not, we'll use username-based email as fallback
        const email = profile.emails?.[0]?.value || 
                     profile._json?.email || 
                     `${profile.username}@github.com`;
        let user = await User.findOne({ email });

        if (user) {
          if (!user.githubId) {
            user.githubId = profile.id;
            await user.save();
          }
        } else {
          user = await User.create({
            githubId: profile.id,
            email,
            name: profile.displayName || profile.username,
            avatar: profile.photos?.[0]?.value,
            username: profile.username,
            provider: 'github',
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// LinkedIn Strategy
// Note: LinkedIn API v2 uses different scopes
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: '/api/auth/linkedin/callback',
      scope: ['r_emailaddress', 'r_liteprofile'], // For v1 API
      // For v2 API, use: scope: ['openid', 'profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.id}@linkedin.com`;
        let user = await User.findOne({ email });

        if (user) {
          if (!user.linkedinId) {
            user.linkedinId = profile.id;
            await user.save();
          }
        } else {
          user = await User.create({
            linkedinId: profile.id,
            email,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
            provider: 'linkedin',
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
