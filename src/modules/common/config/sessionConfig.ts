import MongoStore from "connect-mongo";
import session from "express-session";

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || "defaultSecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
    collectionName: "sessions",
    ttl: 20 * 60,
  }),
  cookie: {
    maxAge: 1000 * 60 * 20,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
});

export default sessionConfig;
