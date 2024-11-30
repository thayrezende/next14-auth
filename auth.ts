import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter  }from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client"; 
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
 
export const {
  auth,
  handlers : { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }){
      //Allow oauth without email verif
      if(account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id as string);

      //prevent sign in without email verif

    if(!existingUser?.emailVerified) return false;

    if(existingUser.isTwoFactorEnabled) {
      const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if(!twoFactorConfirmation) return false;

      //delete two factor conf for next sign in

      await db.twoFactorConfirmation.delete({
        where: { id: twoFactorConfirmation.id}
      });
    }

      return true;
    },
    async session({token, session}){
      if(token.sub && session.user){
        session.user.id = token.sub;  
      }

      if(token.role && session.user){
        session.user.role = token.role as UserRole;
      }

      if(session.user){
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }
        
      return session
    },

    async jwt({ token }){
      if(!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if(!existingUser) return token;

      const existingAccount = await getAccountByUserId(
        existingUser.id
      );

      token.isOAuth = !!existingAccount;
      token.nome = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt"},
  ...authConfig,
})