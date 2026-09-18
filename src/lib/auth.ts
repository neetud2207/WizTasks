import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error('Enter a valid email and password.');
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          // Deliberately vague to avoid leaking which emails are registered.
          throw new Error('Invalid email or password.');
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          throw new Error('Invalid email or password.');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          house: user.house,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-expect-error -- house is attached in `authorize` above
        token.house = user.house;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // @ts-expect-error -- extending the default session shape
        session.user.house = token.house;
      }
      return session;
    },
  },
};
