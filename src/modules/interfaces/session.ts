import { Session } from "express-session";

declare module "express-session" {
    interface Session {
      user: {
        firstname: string;
        lastname: string;
        state: string;
        email: string;
        password: string;
        accessToken?: string;
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


// declare module "express-session" {
//   interface Session {
//     user: {
//       id: string;
//       firstname: string;
//       lastname: string;
//       state: string;
//       email: string;
//       password: string;
     
//     };
//     otp: string;
//   }
// }
