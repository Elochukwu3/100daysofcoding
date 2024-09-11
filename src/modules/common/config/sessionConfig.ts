import MongoStore from "connect-mongo";
import session from "express-session";

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || "defaultSecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 10 * 60,
  }),
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: process.env.NODE_ENV === "development",
    httpOnly: true,
  },
});

export default sessionConfig;
