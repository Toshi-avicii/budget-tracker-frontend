import NextAuth from "next-auth"
import Google from 'next-auth/providers/google';
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    // Store the Google access_token in the JWT
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // Expose access_token to the session object
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});