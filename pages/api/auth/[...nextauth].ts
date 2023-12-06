// pages/api/auth/[...nextauth].ts

import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/prisma";
import { compare } from "bcrypt";
import { User } from "@prisma/client";
import { encode, decode } from "next-auth/jwt";
import Cookies from "cookies";
import { randomUUID } from "crypto";

const adapter = PrismaAdapter(prisma);
const session = {
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
};

export const authOptions = (req, res): NextAuthOptions => {
  return {
    providers: [
      CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Credentials",
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, email, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          email: { label: "Email", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials, _) {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };
          if (!email || !password) {
            throw new Error("Missing email or password");
          }
          const user: User = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user || !(await compare(password, user?.password))) {
            throw new Error("Invalid email or password");
          }

          return user;
        },
      }),
    ],
    adapter: adapter,
    secret: process.env.NEXTAUTH_SECRET,
    // session: { strategy: "jwt" },
    jwt: {
      encode(params) {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          const cookies = new Cookies(req, res);
          const cookie = cookies.get("next-auth.session-token");
          if (cookie) return cookie;
          else return "";
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode(params);
      },
      async decode(params) {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          return null;
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return decode(params);
      },
    },
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          if (user && "id" in user) {
            const sessionToken = randomUUID();
            const sessionExpiry = new Date(Date.now() + session.maxAge * 1000);
            await adapter.createSession({
              sessionToken: sessionToken,
              userId: user.id,
              expires: sessionExpiry,
            });
            const cookies = new Cookies(req, res);
            cookies.set("next-auth.session-token", sessionToken, {
              expires: sessionExpiry,
            });
          }
        }
        return true;
      },
      async jwt({ token, user, trigger }) {
        if (user) {
          token.companyId = user.companyId;
        }
        return token;
      },
      async session({ session, token, user }) {
        session.user.companyId = user.companyId;
        session.user.id = user.id;
        return session;
      },
    },

    pages: {
      signIn: "/login",
    },
  };
};
export default async function auth(req, res) {
  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, authOptions(req, res));
}
