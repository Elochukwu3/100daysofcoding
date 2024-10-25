import MongoStore from "connect-mongo";
import session from "express-session";

const otpSessionConfig = session({
  secret: process.env.SESSION_SECRET || "defaultSecret",
  resave: true,
  saveUninitialized: false,
  name: "sessionOtpCookie",
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
    collectionName: "sessions",
    ttl: 20 * 60, // TTL in seconds
  }),
  cookie: {
    maxAge: 1000 * 60 * 20,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    httpOnly: true,
  },
});

export default otpSessionConfig;
