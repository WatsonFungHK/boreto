// pages/api/auth/[...nextauth].ts

import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email"
import prisma from '../../../lib/prisma';
import { compare } from 'bcrypt';
import { User } from '@prisma/client'
import jwt from 'jsonwebtoken';

export const authOptions: NextAuthOptions = {
  providers: [
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, email, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
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

        const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.accessToken = accessToken;

        return user;
      },
    }),
    EmailProvider({
      server: process.env.MAIL_SERVER,
      from: "<no-reply@example.com>",
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user, profile, isNewUser }) {
      console.log('isNewUser: ', isNewUser);
      console.log('profile: ', profile);
      console.log('user: ', user);
      console.log('account: ', account);
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.accessToken = user.accessToken
        token.companyId = user.companyId
      }
      return token
    },
    async session({ session, token, user }) {
      console.log('session: ', session);
      console.log('token: ', token);
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      session.user = {
        ...session.user,
        companyId: token.companyId

      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  }
};

export default NextAuth(authOptions)