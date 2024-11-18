import NextAuth from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { NextApiHandler } from 'next';


const handler = NextAuth(options) as NextApiHandler;

export { handler as GET, handler as POST };
