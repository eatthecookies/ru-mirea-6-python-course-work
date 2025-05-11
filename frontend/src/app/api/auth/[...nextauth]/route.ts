import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { JWT } from "next-auth/jwt";

// Конфигурация NextAuth
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post("http://backend:8000/user/token/", {
            username: credentials?.username,
            password: credentials?.password,
          });

          const data = res.data;

          if (data.access) {
            return {
              id: "static-or-api-user-id",
              access_token: data.access,
              refresh_token: data.refresh,
              token_type: data.token_type || "Bearer",
            };
          }

          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    error: '/auth/login',
    newUser: '/auth/register'
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Всегда редиректим на корень
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.access_token = token.access_token;
      session.refresh_token = token.refresh_token;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Только хендлеры экспортируем!
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
