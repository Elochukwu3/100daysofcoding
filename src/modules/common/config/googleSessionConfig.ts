import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";

const googleAuthSessionConfig = session({
  secret: process.env.SESSION_SECRET || "defaultSecret",
  resave: false,
  saveUninitialized: false,
  name: "sessionGoogleCookie",
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
    collectionName: "sessions",
    ttl: 24 * 60 * 60, // TTL in seconds for longer sessions
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  }, // Closing brace for the cookie object
}); // Closing brace for the session object

export default googleAuthSessionConfig;
