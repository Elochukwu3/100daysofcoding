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
        otp: string;
        expires_at: number;
      };
    }
  }
