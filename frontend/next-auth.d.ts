import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    access_token: string;
    refresh_token: string;
    token_type: string;
  }
  interface User {
    access_token: string;
    refresh_token: string;
    token_type: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    refresh_token: string;
    token_type: string;
  }
}
