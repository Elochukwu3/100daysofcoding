import MongoStore from "connect-mongo";
import session from "express-session";


const otpSessionConfig = session({
  secret: process.env.SESSION_SECRET || "defaultSecret",
  resave: true,
  saveUninitialized: false,
  name: 'MyCoolWebAppCookieName',
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
    collectionName: "sessions",
    ttl: 20 * 60, // TTL in seconds
  }),
  cookie: {
    maxAge: 1000 * 60 * 20, // 20 minutes
    secure: process.env.NODE_ENV === "production" && process.env.USE_HTTPS === "true", // Secure only when using HTTPS    httpOnly: true, // Prevent client-side JavaScript access to cookies
    sameSite: 'none', 
  },
});

export default otpSessionConfig;
