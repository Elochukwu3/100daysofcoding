import passport, { Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import getPhoneNumber from "../../auth/utils/getGooglePhone";
import { User } from "../../auth/models/User";
import { SessionUser } from "../../interfaces/User";
import { generateRefreshToken } from "../../common/utils/genRefreshToken";
import { generateAccessToken } from "../utils/genAccessToken";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV !== "production"
          ? process.env.GOOGLE_CALLBACK_URL_DEV
          : process.env.GOOGLE_CALLBACK_URL_PROD,
    },
    async (accessToken, refreshToken, profile: Profile, done) => {
      try {
        let useremail =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

        const firstname = profile.name?.familyName || "Unknown";
        const lastname = profile.name?.givenName || "";

        // Find or create user in the database
        let userDB = await User.findOne({ googleId: profile.id });
        let userEmail = await User.findOne({ email: useremail });
        if (userEmail && userEmail.googleId !== profile.id)
          return done(new Error("Email already used by another user"));
        if (!userDB) {
          const phoneNumber = await getPhoneNumber(accessToken);
          const profilePicture = profile.photos
            ? profile.photos[0].value
            : null;

          const myRefreshToken = generateRefreshToken(profile.id);

          userDB = await User.create({
            googleId: profile.id,
            firstname,
            lastname,
            email:
              profile.emails && profile.emails.length > 0
                ? profile.emails[0].value
                : null,
            phoneNumber,
            profilePicture,
            refreshToken: myRefreshToken,
            provider: [profile.provider],
          });
          const myAccessToken = generateAccessToken(profile.id, userDB.roles);
          const sessionUser: SessionUser = {
            id: profile.id,
            accessToken: myAccessToken,
          };
          done(null, sessionUser);
        } else {
          const myRefreshToken = generateRefreshToken(profile.id);
          const myAccessToken = generateAccessToken(profile.id, userDB.roles);
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

passport.deserializeUser(async (sessionUser: SessionUser, done) => {
  // Fetch full user from database based on sessionUser.id
  try {
    const user = await User.findOne({ googleId: sessionUser.id }).lean();
    if (user) {
      const userObj = { ...user, accessToken: sessionUser.accessToken };
      done(null, userObj); // Now req.user will be populated with the full user object
    } else {
      done(new Error("User not found"), false);
    }
  } catch (error) {
    done(error, false);
  }
});
