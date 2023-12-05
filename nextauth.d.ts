import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

interface IUser extends DefaultUser {
  companyId: string?;
}
declare module "next-auth" {
  interface User extends IUser {}
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}
