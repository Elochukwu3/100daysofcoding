import passport, { Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import getPhoneNumber from "../../auth/utils/getGooglePhone";
import { User } from "../../auth/models/User";
import { SessionUser } from "../../interfaces/User";
import { generateRefreshToken } from "../../common/utils/genRefreshToken";
import { generateAccessToken } from "../utils/genAccessToken";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const GOOGLE_CALLBACK = process.env.GOOGLE_CALLBACK as string;
// console.log(GOOGLE_CALLBACK);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK
    },
    async (accessToken, refreshToken, profile: Profile, done) => {
      const email = profile.emails?.[0]?.value || null;
      const firstname = profile.name?.familyName || "Unknown";
        const lastname = profile.name?.givenName || "";
      if (!email) return done(new Error("Email is required for Google signup"));

      try {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.googleId !== profile.id) {
          return done(new Error("Email already used by another account"));
        }

        let userDB = await User.findOne({ googleId: profile.id });
        if (!userDB) {
        //   const phoneNumber = await getPhoneNumber(accessToken);
         
          userDB = await User.create({
            firstname,
            lastname,
            email,
            phoneNumber: "",
            profilePicture: profile.photos?.[0]?.value || null,
            provider: [profile.provider],
            googleId: profile.id,
             address:""
          });
          const myRefreshToken = generateRefreshToken(userDB._id);
          const myAccessToken = generateAccessToken(userDB._id, userDB.roles);
          userDB.refreshToken = myRefreshToken;
          await userDB.save()

          const sessionUser: SessionUser = {
            id: userDB._id,
            accessToken: myAccessToken,
          };
          // done(null, userDB)
          done(null, sessionUser);
        } else {
          const myRefreshToken = generateRefreshToken(userDB._id);
          const myAccessToken = generateAccessToken(userDB._id, userDB.roles);
          userDB.refreshToken = myRefreshToken;
          await userDB.save();
          const sessionUser = {
            id: userDB._id,
            accessToken: myAccessToken,
          };
          done(null, sessionUser);
          // done(null, userDB)
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  const sessionUser = user as SessionUser;
  // done(null, user.id)
  done(null, { id: sessionUser.id, accessToken: sessionUser.accessToken });
});

passport.deserializeUser(async (sessionUser: SessionUser, done) => {
  // Fetch full user from database based on sessionUser.id
  try {
    const user = await User.findOne({ _id: sessionUser.id }).lean();
    // const user = await User.findOne({ googleId: sessionUser.id }).lean();
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
