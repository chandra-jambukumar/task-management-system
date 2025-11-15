import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userRepository from '../repositories/userRepository';

// Only configure Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Google profile'));
          }

          let user = await userRepository.findByEmailPublic(email);

          if (!user) {
            user = await userRepository.createFromOAuth({
              email,
              name: profile.displayName || email.split('@')[0],
              avatarUrl: profile.photos?.[0]?.value,
              provider: 'google',
              providerId: profile.id,
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
  console.log('✓ Google OAuth configured');
} else {
  console.log('ℹ Google OAuth not configured (optional)');
}

export default passport;
