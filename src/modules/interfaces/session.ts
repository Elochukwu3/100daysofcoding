import "express-session";
import session from "express-session";

declare module "express-session" {
  interface Session {
    user: {
      id: string;
      firstname: string;
      lastname: string;
      state: string;
      email: string;
      password: string;
      accessToken: string;
    };
    otp: string;
  }
}
