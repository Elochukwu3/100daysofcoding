import MongoStore from "connect-mongo";
import session from "express-session";

const otpSessionConfig = session({
  secret: process.env.SESSION_SECRET || "defaultSecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
    collectionName: "sessions",
    ttl: 20 * 60, // TTL in seconds
  }),
  cookie: {
    maxAge: 1000 * 60 * 20, // 20 minutes
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    httpOnly: true, // Prevent client-side JavaScript access to cookies
  },
});

export default otpSessionConfig;
