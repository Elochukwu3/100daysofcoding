import passport, { Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../../auth/models/User";
import { SessionUser } from "../../interfaces/User";
import { generateRefreshToken } from "../../common/utils/genRefreshToken";
import { generateAccessToken } from "../utils/genAccessToken";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const GOOGLE_CALLBACK = process.env.GOOGLE_CALLBACK as string;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK,
    },
    async (accessToken, refreshToken, profile: Profile, done) => {
      const email = profile.emails?.[0]?.value || null;
      const firstname = profile.name?.familyName || "Unknown";
      const lastname = profile.name?.givenName || "";

      if (!email) return done(new Error("Email is required for Google signup"));

      try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          if (
            existingUser.provider.includes("local") &&
            existingUser.googleId !== profile.id
          ) {
            return done(null, {
              id: existingUser._id,
              accessToken: generateAccessToken(
                existingUser._id,
                existingUser.roles
              ),
            });
          }

          if (existingUser.googleId === profile.id) {
            const sessionUser: SessionUser = {
              id: existingUser._id,
              accessToken: generateAccessToken(
                existingUser._id,
                existingUser.roles
              ),
            };
            return done(null, sessionUser);
          }

          // Link Google account to existing user
          existingUser.googleId = profile.id;
          if (!existingUser.provider.includes("google")) {
            existingUser.provider.push("google");
          }
          existingUser.refreshToken = generateRefreshToken(existingUser._id);
          await existingUser.save();

          const sessionUser: SessionUser = {
            id: existingUser._id,
            accessToken: generateAccessToken(
              existingUser._id,
              existingUser.roles
            ),
          };
          return done(null, sessionUser);
        }

        const newUser = await User.create({
          firstname,
          lastname,
          email,
          phoneNumber: "",
          profilePicture: profile.photos?.[0]?.value || null,
          provider: ["google"],
          googleId: profile.id,
          address: "",
        });

        newUser.refreshToken = generateRefreshToken(newUser._id);
        await newUser.save();

        const sessionUser: SessionUser = {
          id: newUser._id,
          accessToken: generateAccessToken(newUser._id, newUser.roles),
        };
        return done(null, sessionUser);
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
  try {
    const user = await User.findOne({ _id: sessionUser.id }).lean();
    if (user) {
      done(null, { ...user, accessToken: sessionUser.accessToken });
    } else {
      done(new Error("User not found"), false);
    }
  } catch (error) {
    done(error, false);
  }
});
