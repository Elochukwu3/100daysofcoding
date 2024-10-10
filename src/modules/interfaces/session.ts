import { Session } from "express-session";

declare module "express-session" {
    interface Session {
      user: {
        firstname: string;
        lastname: string;
        state: string;
        email: string;
        password: string;
      };
      otp: {
        value: string;
        expires_at: number;
      };
      passwordReset:  {
        otp?: string;
        expires_at: number;
        isVerified?: boolean;
        email: string;
      };
    }
  }
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
