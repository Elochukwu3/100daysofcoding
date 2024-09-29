import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { google } from "googleapis";
import GoogleUser from "../../auth/models/GoogleUser";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const people = google.people("v1");

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user in the database
        let user = await GoogleUser.findOne({ googleId: profile.id });
        if (!user) {
          const response = await people.people.get({
            resourceName: "people/me",
            personFields: "phoneNumbers",
            auth: accessToken,
          });

          const phoneNumbers = response.data.phoneNumbers;
          const phoneNumber = phoneNumbers ? phoneNumbers[0]?.value : null;
          const profilePicture = profile.photos
            ? profile.photos[0].value
            : null;

          const user = await GoogleUser.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            phoneNumber,
            profilePicture,
            refreshToken,
          });
        } else {
          // Update refresh token
          user.refreshToken = refreshToken || user.refreshToken;
          await user.save();
        }

        const sessionUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          phoneNumber: user.phoneNumber,
          profilePicture: user.profilePicture,
          accessToken,
        };
        return done(null, sessionUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((userObj, done) => {
  done(null, userObj);
});
