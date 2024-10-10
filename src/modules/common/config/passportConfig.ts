import passport, { Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { google } from "googleapis";
import GoogleUser from "../../auth/models/GoogleUser";
import { SessionUser } from "../../interfaces/User";
import { generateRefreshToken } from "../../common/utils/genRefreshToken";
import { generateAccessToken } from "../utils/genAccessToken";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

const people = google.people("v1");

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/v1/google/callback",
    },
    async (accessToken, refreshToken, profile: Profile, done) => {
      try {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });
        // Find or create user in the database
        let userDB = await GoogleUser.findOne({ googleId: profile.id });
        if (!userDB) {
          const response = await google
            .people({ version: "v1", auth: oauth2Client })
            .people.get({
              resourceName: "people/me",
              personFields: "phoneNumbers",
            });

          const phoneNumbers = response.data.phoneNumbers;
          const phoneNumber = phoneNumbers ? phoneNumbers[0]?.value : null;
          const profilePicture = profile.photos
            ? profile.photos[0].value
            : null;

          const myRefreshToken = generateRefreshToken(profile.id);
          const myAccessToken = generateAccessToken(profile.id);

          userDB = await GoogleUser.create({
            googleId: profile.id,
            name: profile.displayName,
            email:
              profile.emails && profile.emails.length > 0
                ? profile.emails[0].value
                : null,
            phoneNumber,
            profilePicture,
            refreshToken: myRefreshToken,
          });
          const sessionUser: SessionUser = {
            id: profile.id,
            accessToken: myAccessToken,
          };
          done(null, sessionUser);
        } else {
          const myRefreshToken = generateRefreshToken(profile.id);
          const myAccessToken = generateAccessToken(profile.id);
          userDB.refreshToken = myRefreshToken;
          await userDB.save();
          const sessionUser = {
            id: profile.id,
            accessToken: myAccessToken,
          };
          done(null, sessionUser);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  const sessionUser = user as SessionUser;
  done(null, { id: sessionUser.id, accessToken: sessionUser.accessToken });
});

passport.deserializeUser(async (sessionData: SessionUser, done) => {
  try {
    const user = await GoogleUser.findOne({ googleId: sessionData.id });
    if (user) {
      // user.accessToken = sessionData.accessToken;
      done(null, user);
    } else {
      done(new Error("User not found"), false);
    }
  } catch (error) {
    done(error, false);
  }
});